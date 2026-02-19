import mongoose from 'mongoose';

const ShortlistSchema = new mongoose.Schema({
    candidateId: { type: Number, required: true },
    candidateName: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: '' },
    score: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    skills: [{ type: String }],
    location: { type: String, default: '' },
    status: { type: String, default: 'New' }, // New, Interview Scheduled, Offer Sent, Rejected
    image: { type: String, default: '' },
}, { timestamps: true });

ShortlistSchema.virtual('shortlistedDate').get(function () {
    return this.createdAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
});

ShortlistSchema.set('toJSON', { virtuals: true });
ShortlistSchema.set('toObject', { virtuals: true });

export default mongoose.models.Shortlist || mongoose.model('Shortlist', ShortlistSchema);
