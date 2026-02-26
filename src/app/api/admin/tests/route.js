import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestPaper from '@/models/TestPaper';
import Question from '@/models/Question';
import SkillCategory from '@/models/SkillCategory';
import { getUserFromRequest } from '@/lib/auth';

async function requireAdmin(req) {
    const decoded = await getUserFromRequest(req);
    if (!decoded || decoded.role !== 'admin') return null;
    return decoded;
}

// GET /api/admin/tests — list all test papers with question counts
export async function GET(req) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const tests = await TestPaper.find().populate('category', 'name slug icon').sort({ createdAt: -1 });

        const testsWithPool = await Promise.all(tests.map(async (t) => {
            const questionCount = await Question.countDocuments({
                category: t.category._id,
                level: t.level,
            });
            return { ...t.toObject(), questionCount };
        }));

        return NextResponse.json({ tests: testsWithPool });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST /api/admin/tests — create a new test paper
// Body: { skillName, skillIcon?, level, duration?, questionsCount?, passingScore? }
export async function POST(req) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { skillName, skillIcon, level, duration, questionsCount, passingScore } = body;

        if (!skillName || !level) {
            return NextResponse.json({ error: 'skillName and level are required' }, { status: 400 });
        }

        // Auto-find or create SkillCategory from skill name
        const slug = skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        let category = await SkillCategory.findOne({ slug });
        if (!category) {
            category = await SkillCategory.create({
                name: skillName,
                slug,
                icon: skillIcon || '📚',
                active: true,
            });
        }

        // Check for duplicate
        const existing = await TestPaper.findOne({ category: category._id, level });
        if (existing) {
            return NextResponse.json({
                error: `A test for "${skillName} / ${level}" already exists`,
            }, { status: 409 });
        }

        const badgeLabel = `${skillName} Developer — ${level.charAt(0).toUpperCase() + level.slice(1)}`;

        const test = await TestPaper.create({
            category: category._id,
            level,
            badgeLabel,
            active: true,
            config: {
                duration: duration || 120,
                questionsCount: questionsCount || 50,
                totalMarks: 100,
                passingScore: passingScore || 40,
            },
        });
        await test.populate('category', 'name slug icon');
        return NextResponse.json({ test }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
