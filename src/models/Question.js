import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false },
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillCategory', required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    text: { type: String, required: true, trim: true },
    options: {
        type: [OptionSchema],
        required: true,
        validate: {
            validator: (opts) => opts.length === 4 && opts.filter(o => o.isCorrect).length === 1,
            message: 'A question must have exactly 4 options with exactly 1 correct answer.',
        },
    },
    active: { type: Boolean, default: true },
}, { timestamps: true });

// Index to efficiently query questions by category+level for random selection
QuestionSchema.index({ category: 1, level: 1, active: 1 });

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
