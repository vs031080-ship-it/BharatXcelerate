import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    domain: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true },
    points: { type: Number, default: 100 },
    image: { type: String, default: '' },
    skills: [{ type: String }],
    // Extended details
    duration: { type: String, default: '1 week' },
    technologies: [{ type: String }],
    detailedDocument: { type: String, default: '' },
    requirements: [{ type: String }],
    resources: [{
        title: { type: String },
        type: { type: String, enum: ['doc', 'video', 'repo', 'other'], default: 'doc' },
        url: { type: String }
    }],
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
