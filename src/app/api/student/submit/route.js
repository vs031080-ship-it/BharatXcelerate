import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Project from '@/models/Project';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(req) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Validate role - Only students can submit/accept projects
        if (user.role !== 'student') {
            return NextResponse.json({ error: 'Only students can accept or submit projects' }, { status: 403 });
        }

        const body = await req.json();
        const { projectId, action, stepIndex, content } = body;

        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Handle "accept project"
        if (action === 'accept') {
            const existing = await Submission.findOne({ student: user.userId, project: projectId });
            if (existing) {
                return NextResponse.json({ success: true, submission: existing, message: 'Already accepted' });
            }
            const submission = await Submission.create({
                student: user.userId,
                project: projectId,
                status: 'started',
                currentStep: 0,
                completedSteps: [],
                stepSubmissions: []
            });
            // Update user stats (projectsInProgress)
            await mongoose.model('User').findByIdAndUpdate(user.userId, { $inc: { projectsInProgress: 1 } });

            return NextResponse.json({ success: true, submission, message: 'Project accepted' });
        }

        // Handle "submit step"
        if (action === 'submit_step') {
            if (stepIndex === undefined || !content) {
                return NextResponse.json({ error: 'Missing step index or content' }, { status: 400 });
            }

            const submission = await Submission.findOne({ student: user.userId, project: projectId });
            if (!submission) {
                return NextResponse.json({ error: 'Project not started' }, { status: 400 });
            }

            // Check if this step is already submitted/approved
            const existingStepSub = submission.stepSubmissions.find(s => s.stepIndex === stepIndex);
            if (existingStepSub && existingStepSub.status === 'approved') {
                return NextResponse.json({ error: 'Step already approved' }, { status: 400 });
            }

            // Add or Update step submission
            if (existingStepSub) {
                existingStepSub.content = content;
                existingStepSub.status = 'pending';
                existingStepSub.submittedAt = new Date();
            } else {
                submission.stepSubmissions.push({
                    stepIndex,
                    content,
                    status: 'pending',
                    submittedAt: new Date()
                });
            }

            // OPTIONAL: Auto-approve for demo purposes? 
            // User requested: "when the admin excepts... then only percentage bar change".
            // So we keep it pending.

            await submission.save();
            return NextResponse.json({ success: true, submission, message: 'Step submitted for review' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req) {
    // Get submissions for a student or project
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Validate role
        if (user.role !== 'student') {
            return NextResponse.json({ error: 'Only students can access their submissions' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get('projectId');

        if (projectId) {
            // If checking specific project status
            const submission = await Submission.findOne({ student: user.userId, project: projectId });
            return NextResponse.json({ submission });
        }

        // List all student submissions
        const submissions = await Submission.find({ student: user.userId }).populate('project', 'title image');
        return NextResponse.json({ submissions });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
