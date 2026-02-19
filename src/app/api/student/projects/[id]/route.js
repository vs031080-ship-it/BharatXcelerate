import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Submission from '@/models/Submission';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        const project = await Project.findById(id).populate('companyId', 'name companyName avatar');
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Check for existing submission
        const submission = await Submission.findOne({
            student: user.userId,
            project: id
        });

        return NextResponse.json({
            project,
            submission // null if not active
        });

    } catch (error) {
        console.error('Project detail error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
