import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Idea from '@/models/Idea';
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
        const idea = await Idea.findById(id);
        if (!idea) {
            return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
        }

        const investorId = decoded.userId;
        const alreadyLiked = idea.likes.includes(investorId);

        if (alreadyLiked) {
            idea.likes = idea.likes.filter(l => l !== investorId);
        } else {
            idea.likes.push(investorId);
            // Notify student
            await Notification.create({
                type: 'like',
                message: `An investor liked your idea "${idea.title}"`,
                forRole: 'student',
            });
        }

        await idea.save();

        return NextResponse.json({ success: true, likes: idea.likes });
    } catch (error) {
        console.error('Like error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
