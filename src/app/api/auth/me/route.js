import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const decoded = await getUserFromRequest(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                bio: user.bio,
                location: user.location,
                skills: user.skills,
                github: user.github,
                linkedin: user.linkedin,
                education: user.education,
                avatar: user.avatar,
                banner: user.banner,
                companyName: user.companyName,
                industry: user.industry,
                investorTitle: user.investorTitle,
                focusSectors: user.focusSectors,
            },
        });
    } catch (error) {
        console.error('Auth/me error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
