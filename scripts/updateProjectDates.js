const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split(/\r?\n/);
const mongoUriLine = lines.find(line => line.startsWith('MONGODB_URI='));
const mongoUri = mongoUriLine.substring('MONGODB_URI='.length).trim().replace(/^["']|["']$/g, '');

const ProjectSchema = new mongoose.Schema({
    deadline: Date,
    startDate: Date,
    status: String
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function updateDates() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const projects = await Project.find({});
        console.log(`Found ${projects.length} projects`);

        for (const project of projects) {
            // Random day between 20 and 28 for Feb 2026, or 1 and 30 for March 2026
            const month = Math.random() > 0.5 ? 1 : 2; // 1 = Feb, 2 = March (0-indexed)
            let day;
            if (month === 1) {
                day = Math.floor(Math.random() * (28 - 20 + 1)) + 20; // 20-28 Feb
            } else {
                day = Math.floor(Math.random() * 30) + 1; // 1-30 March
            }

            const deadline = new Date(2026, month, day);
            const startDate = new Date(deadline);
            startDate.setDate(deadline.getDate() - 7);

            await Project.findByIdAndUpdate(project._id, {
                deadline,
                startDate,
                status: 'active'
            });
            console.log(`Updated project: ${project._id} with deadline ${deadline.toDateString()}`);
        }

        console.log('All projects updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating projects:', error);
        process.exit(1);
    }
}

updateDates();
