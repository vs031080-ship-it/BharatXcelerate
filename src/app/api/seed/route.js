import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Project from '@/models/Project';
import Submission from '@/models/Submission';
import Job from '@/models/Job';
import Idea from '@/models/Idea';
import Shortlist from '@/models/Shortlist';
import Notification from '@/models/Notification';

export async function POST() {
    try {
        await connectDB();

        // 1. Ensure Admin User Exists
        const adminEmail = 'admin@bharatxcelerate.com';
        let adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            const adminPassword = await bcrypt.hash('admin123', 10);
            adminUser = await User.create({
                name: 'BharatXcelerate Admin', email: adminEmail, password: adminPassword, role: 'admin', status: 'active',
            });
            console.log('Admin user created');
        }

        // 2. Clear Collections (Requested: remove demo data)
        await Project.deleteMany({});
        await Submission.deleteMany({});
        await Job.deleteMany({});
        await Idea.deleteMany({});
        console.log('Cleared Projects, Submissions, Jobs, and Ideas');

        // 3. Ensure Seed Student and Company exist
        const hashedPassword = await bcrypt.hash('password123', 10);

        let student = await User.findOne({ email: 'student@test.com' });
        if (!student) {
            student = await User.create({
                name: 'Arjun Sharma', email: 'student@test.com', password: hashedPassword, role: 'student', status: 'active',
                phone: '+91 98765 43210', bio: 'Full-stack developer passionate about AI and blockchain.',
                location: 'New Delhi, India', skills: ['React', 'Node.js', 'Python'],
                xp: 1250, avgScore: 92, projectsCompleted: 1, projectsInProgress: 1
            });
        }

        let company = await User.findOne({ email: 'company@test.com' });
        if (!company) {
            company = await User.create({
                name: 'TechNova Solutions', email: 'company@test.com', password: hashedPassword, role: 'company', status: 'verified',
                companyName: 'TechNova Solutions', industry: 'Technology', location: 'Mumbai, India'
            });
        }

        // 4. Seed Realistic Projects with Steps
        const projects = await Project.insertMany([
            {
                title: 'AI-Powered Career Counselor',
                description: 'Build an intelligent chatbot that analyzes resumes and suggests career paths using NLP.',
                domain: 'AI/ML',
                difficulty: 'Advanced',
                points: 500,
                companyId: company._id,
                skills: ['Python', 'NLP', 'React', 'FastAPI'],
                steps: [
                    { title: 'Data Collection & Preprocessing', description: 'Collect resume datasets and clean the text data using NLTK or SpaCy.', points: 100 },
                    { title: 'Model Training', description: 'Fine-tune a BERT model on the career dataset to classify profiles.', points: 200 },
                    { title: 'API Development', description: 'Create a FastAPI endpoint to serve the model predictions.', points: 100 },
                    { title: 'Frontend Integration', description: 'Build a React chat interface to interact with the bot.', points: 100 }
                ]
            },
            {
                title: 'Decentralized Voting System',
                description: 'A secure, transparent voting application running on the Ethereum blockchain.',
                domain: 'Blockchain',
                difficulty: 'Intermediate',
                points: 400,
                companyId: company._id,
                skills: ['Solidity', 'React', 'Web3.js'],
                steps: [
                    { title: 'Smart Contract Development', description: 'Write the voting logic in Solidity ensuring security and transparency.', points: 150 },
                    { title: 'Testing & Deployment', description: 'Test contracts using Hardhat and deploy to a testnet (Sepolia/Goerli).', points: 100 },
                    { title: 'Frontend Integration', description: 'Connect the React frontend to the blockchain using Web3.js or Ethers.js.', points: 150 }
                ]
            },
            {
                title: 'E-commerce Recommendation Engine',
                description: 'Personalized product recommendations based on user browsing history.',
                domain: 'Data Science',
                difficulty: 'Intermediate',
                points: 300,
                companyId: company._id,
                skills: ['Python', 'Pandas', 'Scikit-learn'],
                steps: [
                    { title: 'Exploratory Data Analysis', description: 'Analyze user behavior data to identify patterns.', points: 100 },
                    { title: 'Algorithm Implementation', description: 'Implement Collaborative Filtering using Scikit-learn.', points: 100 },
                    { title: 'Evaluation & Optimization', description: 'Measure performance using RMSE and optimize hyperparameters.', points: 100 }
                ]
            }
        ]);

        // 5. Create a active submission for the Student
        const votingProject = projects.find(p => p.title === 'Decentralized Voting System');
        if (votingProject && student) {
            await Submission.create({
                student: student._id,
                project: votingProject._id,
                status: 'started',
                currentStep: 1, // Working on step 1 (index 1)
                completedSteps: [0], // Step 0 approved
                stepSubmissions: [
                    { stepIndex: 0, content: 'https://github.com/arjun/voting-contract', status: 'approved', marks: 150, submittedAt: new Date() }
                ],
                totalScore: 150
            });
        }

        // 6. Ensure some Jobs and Ideas exist (if not already seeded)
        // We'll trust the previous logic or re-seed if empty, but for now this is enough for the student portal request.

        return NextResponse.json({
            success: true,
            message: 'Database seeded with fresh projects and steps!',
            projects: projects.length
        });

    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    return POST();
}
