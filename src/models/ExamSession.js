import mongoose from 'mongoose';

// Questions stored in the session (without isCorrect — stripped at enrollment)
const SessionQuestionSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    text: { type: String, required: true },
    options: [{ text: String }], // just text — NO isCorrect
}, { _id: false });

const AnswerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOptionIndex: { type: Number, default: -1 }, // -1 = unanswered
}, { _id: false });

const ExamSessionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testPaper: { type: mongoose.Schema.Types.ObjectId, ref: 'TestPaper', required: true },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date }, // set on submission
    status: { type: String, enum: ['in-progress', 'submitted', 'timeout'], default: 'in-progress' },
    questions: [SessionQuestionSchema], // randomly picked 50, NO correct answers
    answers: [AnswerSchema],
    score: { type: Number, default: null }, // calculated after submission
    passed: { type: Boolean, default: null },
}, { timestamps: true });

// Enforce one attempt per student per test paper
ExamSessionSchema.index({ student: 1, testPaper: 1 }, { unique: true });

export default mongoose.models.ExamSession || mongoose.model('ExamSession', ExamSessionSchema);
