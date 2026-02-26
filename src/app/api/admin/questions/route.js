import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import SkillCategory from '@/models/SkillCategory';
import { getUserFromRequest } from '@/lib/auth';

async function requireAdmin(req) {
    const decoded = await getUserFromRequest(req);
    if (!decoded || decoded.role !== 'admin') return null;
    return decoded;
}

// GET /api/admin/questions?category=<id>&level=<level>&page=1&limit=20
export async function GET(req) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const level = searchParams.get('level');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const filter = {};
        if (category) filter.category = category;
        if (level) filter.level = level;

        const total = await Question.countDocuments(filter);
        const questions = await Question.find(filter)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Also return pool sizes per skill+level for activation checks
        const poolStats = await Question.aggregate([
            { $match: { active: true } },
            { $group: { _id: { category: '$category', level: '$level' }, count: { $sum: 1 } } }
        ]);

        return NextResponse.json({ questions, total, page, poolStats });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST /api/admin/questions — add single question
export async function POST(req) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { category, level, text, options } = body;

        if (!category || !level || !text || !options || options.length !== 4) {
            return NextResponse.json({ error: 'category, level, text, and 4 options are required' }, { status: 400 });
        }

        const correctCount = options.filter(o => o.isCorrect).length;
        if (correctCount !== 1) {
            return NextResponse.json({ error: 'Exactly one option must be marked as correct' }, { status: 400 });
        }

        const question = await Question.create({ category, level, text, options });
        return NextResponse.json({ question }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
