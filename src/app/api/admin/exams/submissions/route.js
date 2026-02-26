import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExamSession from '@/models/ExamSession';
import User from '@/models/User';
import TestPaper from '@/models/TestPaper';
import SkillCategory from '@/models/SkillCategory';
import { getUserFromRequest } from '@/lib/auth';

async function requireAdmin(req) {
    const user = await getUserFromRequest(req);
    return user && user.role === 'admin';
}

export async function GET(req) {
    try {
        await connectDB();
        const isAdmin = await requireAdmin(req);
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        // Ensure models are registered to avoid missing schemas when populating
        if (!User || !TestPaper || !SkillCategory) {
            console.warn('Models not loaded');
        }

        // Fetch all exam sessions sorted by newest first
        const sessions = await ExamSession.find()
            .populate('student', 'name email avatar')
            .populate({
                path: 'testPaper',
                populate: { path: 'category', select: 'name slug' }
            })
            .sort({ createdAt: -1 })
            .lean(); // Faster for reading data

        return NextResponse.json({ sessions });
    } catch (e) {
        console.error('Error fetching exam submissions:', e);
        return NextResponse.json({ error: 'Server error fetching submissions' }, { status: 500 });
    }
}
