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
    headerBanner: { type: String, default: '' },

    // Student-specific fields for reference design
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    occupation: { type: String, default: '' },
    fatherName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    religion: { type: String, default: '' },
    admissionDate: { type: String, default: '' },
    class: { type: String, default: '' },
    roll: { type: String, default: '' },
    studentId: { type: String, default: '' },
    civilStatus: { type: String, default: '' },
    subject: { type: String, default: '' },
    address: { type: String, default: '' },

    // Gamification & Stats
    xp: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    projectsInProgress: { type: Number, default: 0 },
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
