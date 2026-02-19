import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    stage: { type: String, default: 'Idea' }, // Idea, Prototype, MVP
    description: { type: String, default: '' },
    tags: [{ type: String }],
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    teamSize: { type: Number, default: 1 },
    likes: [{ type: String }], // investor IDs
}, { timestamps: true });

IdeaSchema.virtual('createdAtFormatted').get(function () {
    const diff = Date.now() - this.createdAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Just now';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
});

IdeaSchema.set('toJSON', { virtuals: true });
IdeaSchema.set('toObject', { virtuals: true });

export default mongoose.models.Idea || mongoose.model('Idea', IdeaSchema);
