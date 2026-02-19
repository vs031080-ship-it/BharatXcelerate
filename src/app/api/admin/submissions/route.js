import Notification from '@/models/Notification';
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

        const submission = await Submission.findById(id)
            .populate('student', 'name email avatar role')
            .populate('project');

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        if (stepIndex !== undefined) {
            const stepSub = submission.stepSubmissions.find(s => s.stepIndex === stepIndex);

            if (!stepSub) {
                return NextResponse.json({ error: 'Cannot review a step that has not been submitted' }, { status: 400 });
            }

            if (stepStatus) stepSub.status = stepStatus;
            if (stepFeedback !== undefined) stepSub.feedback = stepFeedback;

            // Update completedSteps/Submission Status
            if (stepStatus === 'approved') {
                if (!submission.completedSteps.includes(stepIndex)) {
                    submission.completedSteps.push(stepIndex);
                }
            } else if (stepStatus === 'rejected') {
                if (!stepFeedback || stepFeedback.trim().length < 5) {
                    return NextResponse.json({ error: 'Feedback is mandatory when rejecting a step' }, { status: 400 });
                }
                submission.completedSteps = submission.completedSteps.filter(i => i !== stepIndex);
                submission.status = 'rejected';

                await Notification.create({
                    type: 'project_rejected',
                    message: `Step ${stepIndex + 1} of project "${submission.project?.title}" was rejected. Please check feedback.`,
                    forRole: 'student',
                    forUserId: submission.student,
                });
            }

            const maxCompleted = submission.completedSteps.length > 0 ? Math.max(...submission.completedSteps) : -1;
            submission.currentStep = maxCompleted + 1;

            if (submission.project && submission.project.steps && submission.completedSteps.length >= submission.project.steps.length) {
                submission.status = 'completed';
            }
        } else {
            // Handle Global update
            if (status === 'accepted') {
                if (!grade) {
                    return NextResponse.json({ error: 'Grade is mandatory to accept and complete project' }, { status: 400 });
                }
                if (!feedback || feedback.trim().length < 10) {
                    return NextResponse.json({ error: 'Detailed feedback (min 10 chars) is mandatory for final project review' }, { status: 400 });
                }
            }

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
