import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SkillCategory from '@/models/SkillCategory';
import { getUserFromRequest } from '@/lib/auth';

async function requireAdmin(req) {
    const decoded = await getUserFromRequest(req);
    if (!decoded || decoded.role !== 'admin') return null;
    return decoded;
}

// PATCH /api/admin/skills/[id] — update a category
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const category = await SkillCategory.findByIdAndUpdate(params.id, body, { new: true });
        if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ category });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// DELETE /api/admin/skills/[id]
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await SkillCategory.findByIdAndDelete(params.id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
