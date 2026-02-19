import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const decoded = await getUserFromRequest(request);
        await connectDB();

        let query = {};
        if (decoded?.role) {
            query.forRole = decoded.role;
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50).lean();
        const formatted = notifications.map(n => ({
            ...n,
            id: n._id.toString(),
            timestamp: n.createdAt.getTime(),
        }));

        return NextResponse.json({ notifications: formatted });
    } catch (error) {
        console.error('Notifications GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const { id, markAll, role } = await request.json();

        if (markAll && role) {
            await Notification.updateMany({ forRole: role }, { read: true });
        } else if (id) {
            await Notification.findByIdAndUpdate(id, { read: true });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Notifications PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
