import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestPaper from '@/models/TestPaper';
import ExamSession from '@/models/ExamSession';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/student/exams?skill=<slug>&level=<level>
// Returns active test papers with enrollment status for the logged-in student
export async function GET(req) {
    try {
        await connectDB();
        const decoded = await getUserFromRequest(req);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const skill = searchParams.get('skill');
        const level = searchParams.get('level');

        // Build query — show ALL test papers (no active/inactive concept)
        const filter = {};

        let tests = await TestPaper.find(filter)
            .populate('category', 'name slug icon description')
            .sort({ createdAt: -1 });

        // Filter by skill slug if provided
        if (skill) {
            tests = tests.filter(t => t.category?.slug === skill);
        }
        if (level) {
            tests = tests.filter(t => t.level === level);
        }

        // Fetch student's existing sessions for these test papers
        const testIds = tests.map(t => t._id);
        const sessions = await ExamSession.find({
            student: decoded.userId,
            testPaper: { $in: testIds },
        }).select('testPaper status score passed');

        const sessionMap = {};
        sessions.forEach(s => { sessionMap[s.testPaper.toString()] = s; });

        const result = tests.map(t => {
            const session = sessionMap[t._id.toString()];
            return {
                _id: t._id,
                category: t.category,
                level: t.level,
                badgeLabel: t.badgeLabel,
                description: t.description,
                config: t.config,
                status: session
                    ? (session.status === 'in-progress' ? 'in-progress' : 'completed')
                    : 'not-attempted',
                score: session?.score ?? null,
                passed: session?.passed ?? null,
                sessionId: session?._id ?? null,
            };
        });

        return NextResponse.json({ tests: result });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
