import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { getUserFromRequest } from '@/lib/auth';

async function requireAdmin(req) {
    const decoded = await getUserFromRequest(req);
    if (!decoded || decoded.role !== 'admin') return null;
    return decoded;
}

/**
 * POST /api/admin/questions/bulk
 * Body: { questions: [{ category, level, text, options: [{ text, isCorrect }] }] }
 */
export async function POST(req) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { questions } = body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return NextResponse.json({ error: 'questions array is required' }, { status: 400 });
        }

        // Validate each question
        const errors = [];
        const valid = [];
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.category || !q.level || !q.text || !Array.isArray(q.options) || q.options.length !== 4) {
                errors.push({ index: i, error: 'Must have category, level, text, and exactly 4 options' });
                continue;
            }
            const correctCount = q.options.filter(o => o.isCorrect).length;
            if (correctCount !== 1) {
                errors.push({ index: i, error: 'Exactly one option must be correct' });
                continue;
            }
            valid.push(q);
        }

        let inserted = [];
        if (valid.length > 0) {
            inserted = await Question.insertMany(valid, { ordered: false });
        }

        return NextResponse.json({
            inserted: inserted.length,
            failed: errors.length,
            errors,
        }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
