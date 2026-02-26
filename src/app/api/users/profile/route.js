import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const decoded = await getUserFromRequest(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const decoded = await getUserFromRequest(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const updates = await request.json();

        // Prevent password/email changes from this endpoint
        delete updates.password;
        delete updates.email;
        delete updates.role;

        // ⛔ MCQ system-controlled fields — never allow client overwrite
        delete updates.earnedBadges;
        delete updates.avgScore;
        delete updates.skills;        // populated from earned MCQ badges only
        delete updates.xp;
        delete updates.projectsCompleted;
        delete updates.projectsInProgress;

        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { $set: updates },
            { new: true, select: '-password' }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Profile PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
