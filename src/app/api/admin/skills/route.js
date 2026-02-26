import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SkillCategory from '@/models/SkillCategory';
import { getUserFromRequest } from '@/lib/auth';

async function requireAdmin(req) {
    const decoded = await getUserFromRequest(req);
    if (!decoded || decoded.role !== 'admin') return null;
    return decoded;
}

// GET /api/admin/skills — list all categories
export async function GET(req) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const categories = await SkillCategory.find().sort({ createdAt: -1 });
        return NextResponse.json({ categories });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST /api/admin/skills — create a new skill category
export async function POST(req) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { name, slug, description, icon } = body;
        if (!name || !slug) return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });

        const existing = await SkillCategory.findOne({ slug });
        if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });

        const category = await SkillCategory.create({ name, slug, description, icon });
        return NextResponse.json({ category }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
