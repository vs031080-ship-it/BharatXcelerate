import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    type: { type: String, required: true }, // job, application, idea, like, shortlist
    message: { type: String, required: true },
    forRole: { type: String, required: true }, // student, company, investor
    forUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
