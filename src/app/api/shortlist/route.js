import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ShortlistModel from '@/models/Shortlist';
import Notification from '@/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();
        const shortlist = await ShortlistModel.find().sort({ createdAt: -1 }).lean();
        const formatted = shortlist.map(s => ({ ...s, id: s._id.toString() }));
        return NextResponse.json({ shortlist: formatted });
    } catch (error) {
        console.error('Shortlist GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const decoded = await getUserFromRequest(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        // Check duplicate
        const exists = await ShortlistModel.findOne({ candidateId: body.candidateId, companyId: decoded.userId });
        if (exists) {
            return NextResponse.json({ error: 'Already shortlisted' }, { status: 409 });
        }

        const entry = await ShortlistModel.create({
            ...body,
            companyId: decoded.userId,
        });

        // Notify student
        await Notification.create({
            type: 'shortlist',
            message: 'You have been shortlisted by a company!',
            forRole: 'student',
        });

        return NextResponse.json({ success: true, entry }, { status: 201 });
    } catch (error) {
        console.error('Shortlist POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }
        await ShortlistModel.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Shortlist DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const { id, status } = await request.json();
        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
        }
        await ShortlistModel.findByIdAndUpdate(id, { status });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Shortlist PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
