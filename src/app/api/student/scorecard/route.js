import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Submission from '@/models/Submission';
import Project from '@/models/Project'; // Required for population
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        await connectDB();
        const decoded = await getUserFromRequest(req);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate stats
        // We need to populate project to get title, domain, etc.
        const completedSubmissions = await Submission.find({
            student: decoded.userId,
            status: 'completed'
        }).populate('project').limit(10);

        const completedCount = await Submission.countDocuments({
            student: decoded.userId,
            status: 'completed'
        });

        const recentProjects = completedSubmissions.map(sub => {
            if (!sub.project) return null;
            return {
                id: sub.project._id,
                title: sub.project.title,
                domain: sub.project.domain,
                difficulty: sub.project.difficulty,
                score: sub.totalScore || 0,
                date: sub.updatedAt ? new Date(sub.updatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
                skills: sub.project.skills || []
            };
        }).filter(p => p !== null);

        // Derive badges
        const badges = [];
        if (completedCount >= 1) badges.push({ id: 'first-project', name: 'First Project', icon: 'Rocket', description: 'Completed your first project' });
        if (completedCount >= 5) badges.push({ id: '5-projects', name: 'High Flyer', icon: 'Zap', description: 'Completed 5 projects' });
        if ((user.xp || 0) >= 1000) badges.push({ id: 'xp-1000', name: 'XP Master', icon: 'Star', description: 'Earned 1000+ XP' });

        // Add some default badges for demo if none
        if (badges.length === 0) {
            badges.push({ id: 'new-recruit', name: 'New Recruit', icon: 'User', description: 'Joined the platform' });
        }

        return NextResponse.json({
            user,
            stats: {
                xp: user.xp || 0,
                completedProjects: completedCount,
                level: Math.floor((user.xp || 0) / 500) + 1,
            },
            badges,
            recentProjects
        });

    } catch (error) {
        console.error('Scorecard API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
