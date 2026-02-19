import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Project from '@/models/Project';
import Job from '@/models/Job';
import Idea from '@/models/Idea';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const authUser = await getUserFromRequest(request);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        await connectDB();

        const [totalUsers, students, companies, investors, pendingUsers, totalProjects, totalJobs, totalIdeas] = await Promise.all([
            User.countDocuments({ role: { $ne: 'admin' } }),
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'company' }),
            User.countDocuments({ role: 'investor' }),
            User.countDocuments({ status: 'pending' }),
            Project.countDocuments(),
            Job.countDocuments(),
            Idea.countDocuments(),
        ]);

        // Recent pending accounts
        const recentPending = await User.find({ status: 'pending' })
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return NextResponse.json({
            stats: {
                totalUsers, students, companies, investors,
                pendingVerifications: pendingUsers,
                totalProjects, totalJobs, totalIdeas,
            },
            recentPending,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
