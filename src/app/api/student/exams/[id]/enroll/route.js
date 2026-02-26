import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestPaper from '@/models/TestPaper';
import Question from '@/models/Question';
import ExamSession from '@/models/ExamSession';
import { getUserFromRequest } from '@/lib/auth';

/**
 * POST /api/student/exams/[id]/enroll
 * - Checks no existing session for this student+test
 * - Randomly samples questions from the pool
 * - Strips isCorrect before saving/returning
 * - Creates and returns the ExamSession
 */
export async function POST(req, props) {
    try {
        await connectDB();
        const params = await props.params;
        const decoded = await getUserFromRequest(req);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const testId = params.id;

        // 1. Fetch and validate test paper (no active/inactive restriction)
        const test = await TestPaper.findById(testId).populate('category', 'name slug');
        if (!test) {
            return NextResponse.json({ error: 'Test paper not found' }, { status: 404 });
        }

        // 2. Enforce ONE attempt constraint
        const existingSession = await ExamSession.findOne({
            student: decoded.userId,
            testPaper: testId,
        });
        if (existingSession) {
            return NextResponse.json({
                error: 'You have already attempted this test. No retakes allowed.',
                sessionId: existingSession._id,
                status: existingSession.status,
            }, { status: 409 });
        }

        // 3. Randomly sample questions from the pool (server-side)
        const count = test.config?.questionsCount || 50;
        const randomQuestions = await Question.aggregate([
            { $match: { category: test.category._id, level: test.level } },
            { $sample: { size: count } },
        ]);

        if (randomQuestions.length < count) {
            return NextResponse.json({
                error: `Not enough questions in pool. Has ${randomQuestions.length}, needs ${count}.`
            }, { status: 503 });
        }

        // 4. Strip isCorrect — NEVER expose correct answers to client
        const secureQuestions = randomQuestions.map(q => ({
            questionId: q._id,
            text: q.text,
            options: q.options.map(o => ({ text: o.text })), // NO isCorrect
        }));

        // 5. Create the ExamSession
        const session = await ExamSession.create({
            student: decoded.userId,
            testPaper: testId,
            startTime: new Date(),
            status: 'in-progress',
            questions: secureQuestions,
            answers: [],
        });

        return NextResponse.json({
            sessionId: session._id,
            testPaper: {
                _id: test._id,
                badgeLabel: test.badgeLabel,
                category: test.category,
                level: test.level,
                config: test.config,
            },
            questions: secureQuestions,
            startTime: session.startTime,
        }, { status: 201 });

    } catch (e) {
        console.error('Enroll error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
