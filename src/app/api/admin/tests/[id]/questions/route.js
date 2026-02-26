import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import TestPaper from '@/models/TestPaper';
import { getUserFromRequest } from '@/lib/auth';

async function requireAdmin(req) {
    const decoded = await getUserFromRequest(req);
    if (!decoded || decoded.role !== 'admin') return null;
    return decoded;
}

// GET /api/admin/tests/[id]/questions — list all questions for a test paper
export async function GET(req, props) {
    try {
        await connectDB();
        const params = await props.params;
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const test = await TestPaper.findById(params.id);
        if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 50;
        const skip = (page - 1) * limit;

        console.log(`[DEBUG GET Qs] testId=${params.id}, category=${test.category}, level=${test.level}`);

        const [questions, total] = await Promise.all([
            Question.find({ category: test.category, level: test.level })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Question.countDocuments({ category: test.category, level: test.level }),
        ]);

        console.log(`[DEBUG GET Qs] found total=${total}`);

        return NextResponse.json({ questions, total, page, pages: Math.ceil(total / limit) });
    } catch (e) {
        console.error('Questions GET error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST /api/admin/tests/[id]/questions — add single OR bulk questions
// Single: { text, options: [{text, isCorrect}] }
// Bulk:   { questions: [{text, options: [{text, isCorrect}]}] }
export async function POST(req, props) {
    try {
        await connectDB();
        const params = await props.params;
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const test = await TestPaper.findById(params.id);
        if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

        const body = await req.json();

        // Bulk import
        if (Array.isArray(body.questions)) {
            const docs = body.questions.map(q => ({
                category: test.category,
                level: test.level,
                text: q.text,
                options: q.options,
                active: true,
            }));
            const result = await Question.insertMany(docs, { ordered: false });
            return NextResponse.json({ success: true, added: result.length });
        }

        // Single question
        if (!body.text || !Array.isArray(body.options) || body.options.length !== 4) {
            return NextResponse.json({ error: 'text and exactly 4 options are required' }, { status: 400 });
        }
        const hasCorrect = body.options.filter(o => o.isCorrect).length === 1;
        if (!hasCorrect) {
            return NextResponse.json({ error: 'Exactly one option must be marked as correct' }, { status: 400 });
        }

        const q = await Question.create({
            category: test.category,
            level: test.level,
            text: body.text,
            options: body.options,
            active: true,
        });

        return NextResponse.json({ success: true, question: q }, { status: 201 });
    } catch (e) {
        console.error('Questions POST error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// DELETE /api/admin/tests/[id]/questions?questionId=xxx
export async function DELETE(req, props) {
    try {
        await connectDB();
        const params = await props.params;
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const questionId = searchParams.get('questionId');
        if (!questionId) return NextResponse.json({ error: 'questionId is required' }, { status: 400 });

        await Question.findByIdAndDelete(questionId);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Questions DELETE error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
