import mongoose from 'mongoose';

const TestPaperSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillCategory', required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    badgeLabel: { type: String, required: true, trim: true }, // e.g. "Python Developer - Intermediate"
    config: {
        duration: { type: Number, default: 120 }, // in minutes
        questionsCount: { type: Number, default: 50 },
        totalMarks: { type: Number, default: 100 },
        passingScore: { type: Number, default: 40 }, // out of 100
    },
    active: { type: Boolean, default: false },
}, { timestamps: true });

// Only one test paper per category+level combination
TestPaperSchema.index({ category: 1, level: 1 }, { unique: true });

export default mongoose.models.TestPaper || mongoose.model('TestPaper', TestPaperSchema);
