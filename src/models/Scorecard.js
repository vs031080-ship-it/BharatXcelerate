import mongoose from 'mongoose';

const TestResultSchema = new mongoose.Schema({
    testPaper: { type: mongoose.Schema.Types.ObjectId, ref: 'TestPaper', required: true },
    skill: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    badgeLabel: { type: String, default: '' },
    date: { type: Date, default: Date.now },
}, { _id: false });

const ScorecardSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    results: [TestResultSchema],
    overallAverage: { type: Number, default: 0 },
    earnedBadges: [{ label: String, date: { type: Date, default: Date.now } }],
}, { timestamps: true });

// Auto-calculate overallAverage before save
ScorecardSchema.pre('save', function () {
    if (this.results.length > 0) {
        const total = this.results.reduce((sum, r) => sum + r.score, 0);
        this.overallAverage = Math.round(total / this.results.length);
    } else {
        this.overallAverage = 0;
    }
});

// Force Model Reload for Next.js HMR
if (mongoose.models.Scorecard) {
    delete mongoose.models.Scorecard;
}
export default mongoose.model('Scorecard', ScorecardSchema);
