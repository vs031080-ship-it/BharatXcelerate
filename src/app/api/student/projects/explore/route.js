import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Submission from '@/models/Submission';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        await connectDB();
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get IDs of projects user has already interacted with
        const userSubmissions = await Submission.find({ student: user.userId }).select('project');
        const submittedProjectIds = userSubmissions.map(sub => sub.project.toString());

        // 2. Fetch projects NOT in that list
        const projects = await Project.find({
            _id: { $nin: submittedProjectIds },
            status: { $ne: 'archived' }
        }).sort({ createdAt: -1 });

        return NextResponse.json({ projects });

    } catch (error) {
        console.error('Explore projects error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
