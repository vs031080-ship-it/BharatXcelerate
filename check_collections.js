import mongoose from 'mongoose';
import connectDB from './src/lib/mongodb.js';

// Define minimal schemas to count documents
const UserSchema = new mongoose.Schema({});
const ProjectSchema = new mongoose.Schema({});
const SubmissionSchema = new mongoose.Schema({});
const JobSchema = new mongoose.Schema({});
const IdeaSchema = new mongoose.Schema({});
const NotificationSchema = new mongoose.Schema({});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
const Idea = mongoose.models.Idea || mongoose.model('Idea', IdeaSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

async function checkCollections() {
    try {
        await connectDB();

        const usersCount = await User.countDocuments();
        const projectsCount = await Project.countDocuments();
        const submissionsCount = await Submission.countDocuments();
        const jobsCount = await Job.countDocuments();
        const ideasCount = await Idea.countDocuments();
        const notificationsCount = await Notification.countDocuments();

        console.log('--- MongoDB Atlas Collections Sync Status ---');
        console.log(`Users: ${usersCount}`);
        console.log(`Projects: ${projectsCount}`);
        console.log(`Submissions: ${submissionsCount}`);
        console.log(`Jobs: ${jobsCount}`);
        console.log(`Ideas: ${ideasCount}`);
        console.log(`Notifications: ${notificationsCount}`);
        console.log('-------------------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error checking collections:', error);
        process.exit(1);
    }
}

checkCollections();
