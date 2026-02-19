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
            .populate('project', 'title domain difficulty points duration technologies skills description requirements resources image steps')
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
        const { id, status, grade, feedback, stepIndex, stepStatus, stepFeedback } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
        }

        const submission = await Submission.findById(id).populate('project');

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        // Handle Step-specific update
        if (stepIndex !== undefined) {
            const stepSub = submission.stepSubmissions.find(s => s.stepIndex === stepIndex);

            if (!stepSub) {
                // Create if not exists (though usually it should exist if student submitted)
                // But admin might want to approve a step even if student hasn't 'submitted' it efficiently?
                // No, usually student submits.
                // If not found, we can create one or error. Let's error or create if we want to force-pass.
                // For now, let's assume it exists or we add it.
                submission.stepSubmissions.push({
                    stepIndex,
                    status: stepStatus,
                    feedback: stepFeedback,
                    submittedAt: new Date()
                });
            } else {
                if (stepStatus) stepSub.status = stepStatus;
                if (stepFeedback !== undefined) stepSub.feedback = stepFeedback;
            }

            // Update completedSteps and currentStep
            if (stepStatus === 'approved') {
                if (!submission.completedSteps.includes(stepIndex)) {
                    submission.completedSteps.push(stepIndex);
                }
            } else if (stepStatus === 'rejected') {
                submission.completedSteps = submission.completedSteps.filter(i => i !== stepIndex);
            }

            // Recalculate current step (next available step)
            const maxCompleted = submission.completedSteps.length > 0 ? Math.max(...submission.completedSteps) : -1;
            submission.currentStep = maxCompleted + 1;

            // Check if project is fully completed
            if (submission.project && submission.project.steps && submission.completedSteps.length >= submission.project.steps.length) {
                submission.status = 'completed';
            }
        }
        // Handle Global update
        else {
            if (status) submission.status = status;
            if (grade !== undefined) submission.grade = grade;
            if (feedback !== undefined) submission.feedback = feedback;
        }

        await submission.save();

        return NextResponse.json({ success: true, submission });
    } catch (error) {
        console.error('Update submission error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
