import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Project from '@/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        await connectDB();
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch active submissions
        const submissions = await Submission.find({
            student: user.userId,
            status: { $in: ['started', 'submitted'] } // Not 'completed'
        }).populate('project');

        // Transform data for dashboard
        const activeProjects = submissions.map(sub => {
            const project = sub.project;
            if (!project) return null;

            const totalSteps = project.steps?.length || 0;
            const completedSteps = sub.completedSteps?.length || 0;
            const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

            return {
                id: project._id.toString(),
                title: project.title,
                domain: project.domain,
                difficulty: project.difficulty,
                points: project.points,
                progress: progress,
                submissionId: sub._id.toString(),
                status: sub.status,
                currentStep: sub.currentStep
            };
        }).filter(Boolean);

        return NextResponse.json({ projects: activeProjects });

    } catch (error) {
        console.error('Active projects error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
