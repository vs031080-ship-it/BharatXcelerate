import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Project from '@/models/Project';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const submissions = await Submission.find({})
            .populate('student', 'name email avatar role')
            .populate('project', 'title domain difficulty points duration technologies skills description requirements resources image')
            .sort({ createdAt: -1 });

        return NextResponse.json({ submissions });
    } catch (error) {
        console.error('Fetch submissions error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        const { id, status, grade, feedback } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const submission = await Submission.findByIdAndUpdate(
            id,
            { status, grade, feedback },
            { new: true }
        ).populate('student', 'name email').populate('project', 'title');

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, submission });
    } catch (error) {
        console.error('Update submission error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
