import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

// GET — List users with optional filters
export async function GET(request) {
    try {
        const authUser = await getUserFromRequest(request);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        await connectDB();

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const status = searchParams.get('status');

        const query = { role: { $ne: 'admin' } };
        if (role) query.role = role;
        if (status) query.status = status;

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Admin users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT — Update user status (verify/reject)
export async function PUT(request) {
    try {
        const authUser = await getUserFromRequest(request);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        await connectDB();

        const { userId, status } = await request.json();
        if (!userId || !status) {
            return NextResponse.json({ error: 'userId and status required' }, { status: 400 });
        }
        if (!['active', 'verified', 'rejected', 'pending'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Admin update user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
