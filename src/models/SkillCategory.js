import mongoose from 'mongoose';

const SkillCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' }, // icon name or url
    active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.SkillCategory || mongoose.model('SkillCategory', SkillCategorySchema);
