import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
    try {
        await connectDB();
        const { name, email, password, role } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine account status based on role
        // Students are auto-activated; company/investor need admin verification
        const status = role === 'student' ? 'active' : 'pending';

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            status,
        });

        // For pending accounts, don't issue a token — they can't login yet
        if (status === 'pending') {
            return NextResponse.json({
                success: true,
                pending: true,
                message: 'Your account has been submitted for verification. You will be able to log in once an admin approves your account.',
            });
        }

        // For students (active), issue token immediately
        const token = signToken({ userId: user._id, email: user.email, role: user.role, name: user.name });

        const response = NextResponse.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
            token,
        });

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
