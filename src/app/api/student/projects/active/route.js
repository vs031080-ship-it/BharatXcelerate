import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Project from '@/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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
            status: { $in: ['started', 'submitted', 'rejected', 'accepted', 'completed'] } // Include accepted and completed as valid active/history states
        }).populate('project');

        // Transform data for dashboard

        // Transform data for dashboard
        const activeProjects = submissions.map(sub => {
            const project = sub.project;
            if (!project) return null;

            const totalSteps = project.steps?.length || 0;
            const completedSteps = sub.completedSteps?.length || 0;
            const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

            // Determine display status for calendar
            let displayStatus = 'upcoming'; // Default (Red)

            if (sub.status === 'completed') {
                displayStatus = 'accepted'; // Green
            } else if (sub.status === 'submitted' || sub.status === 'rejected') {
                // Check if any step is rejected
                const hasRejected = sub.stepSubmissions?.some(s => s.status === 'rejected');
                const isPending = sub.stepSubmissions?.some(s => s.status === 'pending');

                if (hasRejected || sub.status === 'rejected') displayStatus = 'rejected'; // Red
                else if (isPending) displayStatus = 'pending'; // Yellow
                else displayStatus = 'accepted'; // Green
            } else if (sub.status === 'started') {
                displayStatus = 'upcoming'; // Red
            }

            return {
                id: project._id.toString(),
                title: project.title,
                domain: project.domain,
                difficulty: project.difficulty,
                points: project.points,
                progress: progress,
                submissionId: sub._id.toString(),
                status: sub.status,
                displayStatus, // New field for UI logic
                currentStep: sub.currentStep,
                deadline: project.deadline,
                startDate: project.startDate
            };
        }).filter(Boolean);

        return NextResponse.json({ projects: activeProjects });

    } catch (error) {
        console.error('Active projects error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
