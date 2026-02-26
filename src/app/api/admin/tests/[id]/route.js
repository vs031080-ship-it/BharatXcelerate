import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestPaper from '@/models/TestPaper';
import Question from '@/models/Question';
import { getUserFromRequest } from '@/lib/auth';

const MIN_POOL = 100;

async function requireAdmin(req) {
    const decoded = await getUserFromRequest(req);
    if (!decoded || decoded.role !== 'admin') return null;
    return decoded;
}

// PATCH /api/admin/tests/[id] — update or activate/deactivate test paper
export async function PATCH(req, props) {
    try {
        await connectDB();
        const params = await props.params;
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();

        // If trying to activate, verify pool size
        if (body.active === true) {
            const current = await TestPaper.findById(params.id);
            if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

            const poolCount = await Question.countDocuments({
                category: current.category,
                level: current.level,
                active: true,
            });

            if (poolCount < MIN_POOL) {
                return NextResponse.json({
                    error: `Cannot activate: needs at least ${MIN_POOL} active questions. Currently ${poolCount}.`
                }, { status: 400 });
            }
        }

        const test = await TestPaper.findByIdAndUpdate(params.id, body, { new: true }).populate('category', 'name slug');
        if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ test });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// DELETE /api/admin/tests/[id]
export async function DELETE(req, props) {
    try {
        await connectDB();
        const params = await props.params;
        if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await TestPaper.findByIdAndDelete(params.id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
