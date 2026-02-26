import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExamSession from '@/models/ExamSession';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/student/exams/session/[sessionId]
// Returns the session (without isCorrect) for resuming or displaying results
export async function GET(req, props) {
    try {
        await connectDB();
        const params = await props.params;
        const decoded = await getUserFromRequest(req);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await ExamSession.findById(params.sessionId).populate({
            path: 'testPaper',
            populate: { path: 'category', select: 'name slug icon' },
        });

        if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        if (decoded.role !== 'admin' && session.student.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // If the exam is completed, generate a detailed report
        let reportDetails = [];
        if (session.status === 'submitted' || session.status === 'timeout') {
            const Question = require('@/models/Question').default;
            const questionIds = session.questions.map(q => q.questionId);
            const dbQuestions = await Question.find({ _id: { $in: questionIds } }).select('options');

            // Map DB correct answers
            const correctMap = {};
            dbQuestions.forEach(q => {
                const correctIdx = q.options.findIndex(o => o.isCorrect);
                correctMap[q._id.toString()] = correctIdx;
            });

            // Build report only for attempted questions
            session.answers.forEach(ans => {
                if (ans.selectedOptionIndex === -1) return; // Skip unattempted

                const sessionQuestion = session.questions.find(q => q.questionId.toString() === ans.questionId.toString());
                if (!sessionQuestion) return;

                const correctIdx = correctMap[ans.questionId.toString()];
                reportDetails.push({
                    questionId: ans.questionId,
                    questionText: sessionQuestion.text,
                    options: sessionQuestion.options.map(o => o.text),
                    selectedOptionIndex: ans.selectedOptionIndex,
                    correctOptionIndex: correctIdx,
                    isCorrect: ans.selectedOptionIndex === correctIdx
                });
            });
        }

        return NextResponse.json({
            session,
            reportDetails: reportDetails.length > 0 ? reportDetails : undefined
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
    }
}
