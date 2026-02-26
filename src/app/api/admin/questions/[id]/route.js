import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { getUserFromRequest } from '@/lib/auth';

async function requireAdmin(req) {
    const decoded = await getUserFromRequest(req);
    if (!decoded || decoded.role !== 'admin') return null;
    return decoded;
}

// PATCH /api/admin/questions/[id] — update question
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const question = await Question.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ question });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// DELETE /api/admin/questions/[id]
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await Question.findByIdAndDelete(params.id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
