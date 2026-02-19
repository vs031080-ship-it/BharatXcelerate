import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import Notification from '@/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();
        const jobs = await Job.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('Jobs GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const decoded = await getUserFromRequest(request);
        if (!decoded || decoded.role !== 'company') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();
        const body = await request.json();

        const job = await Job.create({
            ...body,
            companyId: decoded.userId,
            company: body.company || decoded.name,
        });

        // Notify students
        await Notification.create({
            type: 'job',
            message: `New job posted: ${job.title} at ${job.company}`,
            forRole: 'student',
        });

        return NextResponse.json({ success: true, job }, { status: 201 });
    } catch (error) {
        console.error('Jobs POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
