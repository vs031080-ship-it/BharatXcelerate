import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    githubUrl: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['accepted_by_student', 'submitted', 'reviewed', 'accepted', 'rejected'], default: 'submitted' },
    grade: { type: String },
    feedback: { type: String },
}, { timestamps: true });

// Delete cached model to ensure latest schema is used (fixes hot-reload enum cache issue)
if (mongoose.models.Submission) {
    delete mongoose.models.Submission;
}

export default mongoose.model('Submission', SubmissionSchema);

