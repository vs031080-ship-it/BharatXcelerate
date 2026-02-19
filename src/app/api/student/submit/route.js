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

        const body = await req.json();
        const { projectId, githubUrl, description, action } = body;

        // Validate projectId is a valid MongoDB ObjectId
        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
        }

        // Handle "accept project" action
        if (action === 'accept') {
            const project = await Project.findById(projectId);
            if (!project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            }
            const existing = await Submission.findOne({ student: user.userId, project: projectId });
            if (existing) {
                return NextResponse.json({ success: true, submission: existing, message: 'Already accepted' });
            }
            const submission = await Submission.create({
                student: user.userId,
                project: projectId,
                githubUrl: 'pending',
                description: 'Project accepted — work in progress',
                status: 'accepted_by_student'
            });
            return NextResponse.json({ success: true, submission, message: 'Project accepted successfully' });
        }

        if (!githubUrl || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Check for existing submission?
        const existing = await Submission.findOne({ student: user.userId, project: projectId });
        if (existing) {
            // Update existing
            existing.githubUrl = githubUrl;
            existing.description = description;
            existing.status = 'submitted';
            await existing.save();
            return NextResponse.json({ success: true, submission: existing, message: 'Submission updated' });
        }

        const submission = await Submission.create({
            student: user.userId,
            project: projectId,
            githubUrl,
            description
        });

        return NextResponse.json({ success: true, submission, message: 'Project submitted successfully' });
    } catch (error) {
        console.error('Submission error:', error.message, error.stack);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req) {
    // Get submissions for a student or project
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
