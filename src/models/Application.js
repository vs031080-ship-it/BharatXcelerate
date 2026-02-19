import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    studentName: { type: String, required: true },
    status: { type: String, default: 'Applied' }, // Applied, Reviewed, Shortlisted, Rejected
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
