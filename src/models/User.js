import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'company', 'investor', 'admin'], required: true },
    status: { type: String, enum: ['active', 'pending', 'verified', 'rejected'], default: 'active' },
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    skills: [{ type: String }],
    avatar: { type: String, default: '' },
    banner: { type: String, default: '' },

    // ─── Stats (MCQ system-controlled — updated only by /api/student/exams/[sessionId]/submit)
    xp: { type: Number, default: 0 },               // NOT used — reserved for future gamification
    avgScore: { type: Number, default: 0 },         // mirrors Scorecard.overallAverage
    projectsCompleted: { type: Number, default: 0 },// NOT used — projects are optional enrichment
    projectsInProgress: { type: Number, default: 0 },// incremented on project accept, cosmetic only

    // ─── MCQ Assessment Badges (system-assigned only — NEVER user-editable)
    earnedBadges: [{ type: String }],               // populated from MCQ submit route only

    // Social links
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
    // Company-specific
    companyName: { type: String, default: '' },
    industry: { type: String, default: '' },
    // Investor-specific
    investorTitle: { type: String, default: '' },
    focusSectors: [{ type: String }],
    minCheckSize: { type: String, default: '' },
    maxCheckSize: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
