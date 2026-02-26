import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Scorecard from '@/models/Scorecard';
import { getUserFromRequest } from '@/lib/auth';

/**
 * GET /api/company/talent?skill=Python&level=intermediate&minScore=50&search=rahul
 * Returns students with MCQ-based scorecard data for company filtering.
 */
export async function GET(req) {
    try {
        await connectDB();
        const decoded = await getUserFromRequest(req);
        if (!decoded || (decoded.role !== 'company' && decoded.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const skill = searchParams.get('skill') || '';
        const level = searchParams.get('level') || '';
        const minScore = parseInt(searchParams.get('minScore') || '0');
        const search = searchParams.get('search') || '';

        // Get all student users
        const userFilter = { role: 'student' };
        if (search) {
            userFilter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { skills: { $regex: search, $options: 'i' } },
            ];
        }

        const students = await User.find(userFilter)
            .select('_id name email avatar location skills earnedBadges avgScore bio')
            .limit(50);

        const studentIds = students.map(s => s._id);

        // Fetch scorecards for matched students
        let scorecardFilter = { student: { $in: studentIds } };
        if (skill || minScore > 0) {
            scorecardFilter['results'] = { $elemMatch: {} };
            if (skill) scorecardFilter['results']['$elemMatch'].skill = { $regex: skill, $options: 'i' };
            if (level) scorecardFilter['results']['$elemMatch'].level = level;
            if (minScore > 0) scorecardFilter['results']['$elemMatch'].score = { $gte: minScore };
        }

        const scorecards = await Scorecard.find(scorecardFilter);
        const scorecardMap = {};
        scorecards.forEach(sc => { scorecardMap[sc.student.toString()] = sc; });

        // Build response — filter out students with no scorecard if skill/level/minScore were applied
        let results = students
            .map(student => {
                const sc = scorecardMap[student._id.toString()];
                if ((skill || minScore > 0 || level) && !sc) return null;

                const skillResults = sc?.results || [];
                const filteredResults = skillResults.filter(r => {
                    if (skill && !r.skill.toLowerCase().includes(skill.toLowerCase())) return false;
                    if (level && r.level !== level) return false;
                    if (minScore > 0 && r.score < minScore) return false;
                    return true;
                });

                // If filters applied but no matching results, exclude candidate
                if ((skill || level || minScore > 0) && filteredResults.length === 0) return null;

                return {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    avatar: student.avatar,
                    location: student.location || 'India',
                    bio: student.bio,
                    overallAverage: sc?.overallAverage || 0,
                    earnedBadges: sc?.earnedBadges?.map(b => b.label) || [],
                    skillScores: filteredResults.length > 0 ? filteredResults : (sc?.results || []),
                    skills: student.skills || [],
                };
            })
            .filter(Boolean);

        // Sort by overallAverage descending
        results.sort((a, b) => b.overallAverage - a.overallAverage);

        return NextResponse.json({ candidates: results });
    } catch (e) {
        console.error('Talent search error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
