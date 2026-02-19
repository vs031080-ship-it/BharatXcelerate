import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true }, // Full-time, Internship, Contract
    location: { type: String, required: true },
    salary: { type: String, default: '' },
    company: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, default: '' },
    skills: [{ type: String }],
    applicants: [{ type: String }], // student names
    status: { type: String, default: 'active' },
}, { timestamps: true });

// Virtual for formatted date
JobSchema.virtual('postedDate').get(function () {
    return this.createdAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
});

JobSchema.set('toJSON', { virtuals: true });
JobSchema.set('toObject', { virtuals: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
