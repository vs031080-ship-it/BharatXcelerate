import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
    try {
        await connectDB();
        const { email, password, role } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check role matches if provided (skip for admin login)
        if (role && user.role !== 'admin' && user.role !== role) {
            return NextResponse.json({ error: `This account is registered as a ${user.role}, not ${role}` }, { status: 403 });
        }

        // Check account status — block pending/rejected accounts
        if (user.status === 'pending') {
            return NextResponse.json({ error: 'Your account is under verification. Please wait for admin approval.' }, { status: 403 });
        }
        if (user.status === 'rejected') {
            return NextResponse.json({ error: 'Your account application was not approved. Please contact support.' }, { status: 403 });
        }

        // Generate JWT
        const token = signToken({ userId: user._id, email: user.email, role: user.role, name: user.name });

        const response = NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
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
                focusSectors: user.focusSectors
            },
            token,
        });

        response.cookies.set('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
