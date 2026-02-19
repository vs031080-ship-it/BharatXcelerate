import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import Application from '@/models/Application';
import Notification from '@/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request, { params }) {
    try {
        const decoded = await getUserFromRequest(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const job = await Job.findById(id);
        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Check if already applied
        const existingApp = await Application.findOne({ jobId: id, userId: decoded.userId });
        if (existingApp) {
            return NextResponse.json({ error: 'Already applied' }, { status: 409 });
        }

        // Create application
        await Application.create({
            jobId: id,
            userId: decoded.userId,
            studentName: decoded.name,
        });

        // Update job applicants
        job.applicants.push(decoded.name);
        await job.save();

        // Notify company
        await Notification.create({
            type: 'application',
            message: `${decoded.name} applied to "${job.title}"`,
            forRole: 'company',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Apply error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const decoded = await getUserFromRequest(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        const job = await Job.findById(id);
        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Remove from job applicants
        job.applicants = job.applicants.filter(a => a !== decoded.name);
        await job.save();

        // Delete application record
        await Application.findOneAndDelete({ jobId: id, userId: decoded.userId });

        return NextResponse.json({ success: true, message: 'Application revoked' });
    } catch (error) {
        console.error('Revoke error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
