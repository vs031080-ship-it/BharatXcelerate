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
