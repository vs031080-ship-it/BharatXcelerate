import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Scorecard from '@/models/Scorecard';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        await connectDB();
        const decoded = await getUserFromRequest(req);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const scorecard = await Scorecard.findOne({ student: decoded.userId })
            .populate('results.testPaper', 'badgeLabel config level');

        const results = scorecard?.results || [];
        const earnedBadges = scorecard?.earnedBadges || [];
        const overallAverage = scorecard?.overallAverage || 0;

        // Group results by skill for display
        const bySkill = {};
        results.forEach(r => {
            if (!bySkill[r.skill]) bySkill[r.skill] = [];
            bySkill[r.skill].push({
                level: r.level,
                score: r.score,
                passed: r.passed,
                badgeLabel: r.badgeLabel,
                date: r.date,
            });
        });

        return NextResponse.json({
            user,
            overallAverage,
            totalTests: results.length,
            passedTests: results.filter(r => r.passed).length,
            earnedBadges,
            bySkill,
            results,
        });

    } catch (error) {
        console.error('Scorecard API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
