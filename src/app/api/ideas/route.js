import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Idea from '@/models/Idea';
import Notification from '@/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();
        const ideas = await Idea.find().sort({ createdAt: -1 }).lean();
        // Add createdAt formatted
        const formatted = ideas.map(idea => {
            const diff = Date.now() - new Date(idea.createdAt).getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            let createdAtFormatted = 'Just now';
            if (days === 1) createdAtFormatted = '1 day ago';
            else if (days > 1 && days < 7) createdAtFormatted = `${days} days ago`;
            else if (days >= 7 && days < 30) createdAtFormatted = `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
            else if (days >= 30) createdAtFormatted = `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
            return { ...idea, id: idea._id.toString(), createdAt: createdAtFormatted };
        });
        return NextResponse.json({ ideas: formatted });
    } catch (error) {
        console.error('Ideas GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const decoded = await getUserFromRequest(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const idea = await Idea.create({
            ...body,
            authorId: decoded.userId,
            author: body.author || decoded.name,
        });

        // Notify investors
        await Notification.create({
            type: 'idea',
            message: `New idea submitted: "${idea.title}" by ${idea.author}`,
            forRole: 'investor',
        });

        return NextResponse.json({ success: true, idea }, { status: 201 });
    } catch (error) {
        console.error('Ideas POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
