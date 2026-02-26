import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { getUserFromRequest } from '@/lib/auth';

// GET — List all projects or single project
export async function GET(request) {
    try {
        await connectDB();
        const authUser = await getUserFromRequest(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        // Students can see active projects; admins see all
        const baseQuery = authUser?.role === 'admin' ? {} : { status: 'active' };

        if (id) {
            const project = await Project.findOne({ _id: id, ...baseQuery }).lean();
            if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            return NextResponse.json({ project });
        }

        const projects = await Project.find(baseQuery).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Projects error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST — Create project (admin only)
export async function POST(request) {
    try {
        const authUser = await getUserFromRequest(request);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        await connectDB();

        const body = await request.json();
        const { title, description, domain, difficulty, points, image, skills, duration, technologies, requirements, resources, startDate, deadline } = body;

        if (!title || !description || !domain || !difficulty) {
            return NextResponse.json({ error: 'Title, description, domain, and difficulty are required' }, { status: 400 });
        }

        const project = await Project.create({
            title, description, domain, difficulty,
            points: points || 100,
            image: image || '',
            skills: skills || [],
            duration: duration || '1 week',
            technologies: technologies || [],
            detailedDocument: body.detailedDocument || '',
            requirements: requirements || [],
            resources: resources || [],
            startDate,
            deadline,
            status: 'active',
            createdBy: authUser.userId,
        });

        return NextResponse.json({ success: true, project }, { status: 201 });
    } catch (error) {
        console.error('Create project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT — Update project (admin only)
export async function PUT(request) {
    try {
        const authUser = await getUserFromRequest(request);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        await connectDB();

        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
        }

        const project = await Project.findByIdAndUpdate(id, updates, { new: true });
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error('Update project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE — Delete project (admin only)
export async function DELETE(request) {
    try {
        const authUser = await getUserFromRequest(request);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
        }

        await Project.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete project error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
