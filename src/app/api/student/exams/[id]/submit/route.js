import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExamSession from '@/models/ExamSession';
import Question from '@/models/Question';
import Scorecard from '@/models/Scorecard';
import TestPaper from '@/models/TestPaper';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

/**
 * POST /api/student/exams/[id]/submit
 * Body: { answers: [{ questionId, selectedOptionIndex }] }
 * - Validates session belongs to the student
 * - Checks for timeout (endTime = startTime + duration)
 * - Calculates score server-side using original DB questions
 * - Updates ExamSession, Scorecard, and User
 */
export async function POST(req, props) {
    try {
        await connectDB();
        const params = await props.params;
        const decoded = await getUserFromRequest(req);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const sessionId = params.id;
        const body = await req.json();
        const { answers } = body;

        // 1. Load session
        const session = await ExamSession.findById(sessionId).populate({
            path: 'testPaper',
            populate: { path: 'category', select: 'name slug' },
        });

        if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        if (session.student.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        if (session.status !== 'in-progress') {
            return NextResponse.json({ error: 'Test already submitted', score: session.score, passed: session.passed }, { status: 409 });
        }

        // 2. Determine final status (timeout or submitted)
        const durationMs = (session.testPaper.config?.duration || 120) * 60 * 1000;
        const elapsed = Date.now() - new Date(session.startTime).getTime();
        const isTimeout = elapsed > durationMs + 30000; // 30s grace period for network
        const finalStatus = isTimeout ? 'timeout' : 'submitted';

        // 3. Fetch the original questions WITH correct answers from DB (server-side only)
        const questionIds = session.questions.map(q => q.questionId);
        const dbQuestions = await Question.find({ _id: { $in: questionIds } }).select('options');

        // Build a map: questionId -> correctOptionIndex
        const correctMap = {};
        dbQuestions.forEach(q => {
            const correctIdx = q.options.findIndex(o => o.isCorrect);
            correctMap[q._id.toString()] = correctIdx;
        });

        // 4. Score the submission
        let correctCount = 0;
        const processedAnswers = Array.isArray(answers) ? answers : [];

        processedAnswers.forEach(a => {
            const correctIdx = correctMap[a.questionId?.toString()];
            if (correctIdx !== undefined && a.selectedOptionIndex === correctIdx) {
                correctCount++;
            }
        });

        const totalQuestions = session.testPaper.config?.questionsCount || 50;
        const score = Math.round((correctCount / totalQuestions) * 100);
        const passingScore = session.testPaper.config?.passingScore || 40;
        const passed = score >= passingScore;

        // 5. Update ExamSession
        session.answers = processedAnswers;
        session.score = score;
        session.passed = passed;
        session.status = finalStatus;
        session.endTime = new Date();
        await session.save();

        // 6. Update / Create Scorecard
        const skillName = session.testPaper?.category?.name || 'Unknown Skill';
        const level = session.testPaper?.level || 'beginner';
        const badgeLabel = passed ? session.testPaper?.badgeLabel : null;

        let scorecard = await Scorecard.findOne({ student: decoded.userId });
        if (!scorecard) {
            scorecard = new Scorecard({ student: decoded.userId, results: [], earnedBadges: [] });
        }

        scorecard.results = scorecard.results.filter(r => r.testPaper?.toString() !== session.testPaper._id.toString());
        scorecard.results.push({
            testPaper: session.testPaper._id,
            skill: skillName,
            level,
            score,
            passed,
            badgeLabel: badgeLabel || '',
            date: new Date(),
        });

        if (passed && badgeLabel) {
            const alreadyHasBadge = scorecard.earnedBadges.some(b => b.label === badgeLabel);
            if (!alreadyHasBadge) {
                scorecard.earnedBadges.push({ label: badgeLabel, date: new Date() });
            }
        }

        await scorecard.save();

        // 7. Sync User skills and badges
        const allSkills = [...new Set(scorecard.results.map(r => r.skill))];
        const allBadgeLabels = scorecard.earnedBadges.map(b => b.label);

        await User.findByIdAndUpdate(decoded.userId, {
            skills: allSkills,
            earnedBadges: allBadgeLabels,
            avgScore: scorecard.overallAverage,
        });

        return NextResponse.json({
            score,
            passed,
            correctCount,
            totalQuestions,
            badgeEarned: passed ? badgeLabel : null,
            overallAverage: scorecard.overallAverage,
        });

    } catch (e) {
        console.error('Submit error:', e);
        return NextResponse.json({ error: e.message || 'Server error', stack: e.stack }, { status: 500 });
    }
}
