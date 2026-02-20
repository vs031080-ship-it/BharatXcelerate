import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    status: { type: String, enum: ['started', 'submitted', 'completed', 'rejected', 'accepted'], default: 'started' },

    // Step Tracking
    currentStep: { type: Number, default: 0 },
    completedSteps: [{ type: Number }], // Indices of approved steps

    // Step Submissions
    stepSubmissions: [{
        stepIndex: { type: Number, required: true },
        content: { type: String },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        feedback: { type: String },
        submittedAt: { type: Date, default: Date.now },
        marks: { type: Number, default: 0 }
    }],

    // Final/Overall details
    githubUrl: { type: String },
    description: { type: String },
    grade: { type: String },
    feedback: { type: String },
    totalScore: { type: Number, default: 0 },
}, { timestamps: true });

// Delete cached model to ensure latest schema is used (fixes hot-reload enum cache issue)
if (mongoose.models.Submission) {
    delete mongoose.models.Submission;
}

export default mongoose.model('Submission', SubmissionSchema);

