import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Job from '@/models/Job';
import Idea from '@/models/Idea';
import Shortlist from '@/models/Shortlist';
import Notification from '@/models/Notification';

export async function POST() {
    try {
        await connectDB();

        // --- Seed Users ---
        // --- 1. Ensure Admin User Exists ---
        const adminEmail = 'admin@bharatxcelerate.com';
        let adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            const adminPassword = await bcrypt.hash('admin123', 10);
            adminUser = await User.create({
                name: 'BharatXcelerate Admin', email: adminEmail, password: adminPassword, role: 'admin', status: 'active',
            });
            console.log('Admin user created');
        }

        // --- 2. Check if Seed Data Exists (User: student@test.com) ---
        const seedUser = await User.findOne({ email: 'student@test.com' });
        if (seedUser) {
            return NextResponse.json({ message: 'Seed data already exists (Admin ensured)', users: await User.countDocuments() });
        }

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Removed Admin creation from here as it's done above

        const student = await User.create({
            name: 'Arjun Sharma', email: 'student@test.com', password: hashedPassword, role: 'student', status: 'active',
            phone: '+91 98765 43210', bio: 'Full-stack developer passionate about AI and blockchain.',
            location: 'New Delhi, India', skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
        });

        const company = await User.create({
            name: 'TechNova Solutions', email: 'company@test.com', password: hashedPassword, role: 'company', status: 'verified',
            companyName: 'TechNova Solutions', industry: 'Technology',
            location: 'Mumbai, India', bio: 'Building the future of enterprise software.',
        });

        const investor = await User.create({
            name: 'Priya Kapoor', email: 'investor@test.com', password: hashedPassword, role: 'investor', status: 'verified',
            investorTitle: 'Angel Investor & Venture Partner',
            location: 'Bangalore, India', bio: 'Early-stage investor focused on deep tech and SaaS.',
            focusSectors: ['AI/ML', 'SaaS', 'FinTech', 'EdTech'],
        });

        // --- Seed Jobs ---
        const jobs = await Job.insertMany([
            { title: 'Senior Full Stack Developer', type: 'Full-time', location: 'Mumbai', salary: '₹18-25 LPA', company: 'TechNova Solutions', companyId: company._id, description: 'Build scalable enterprise applications using React, Node.js, and AWS. Lead a team of 3 junior developers.', skills: ['React', 'Node.js', 'AWS', 'PostgreSQL'], applicants: [] },
            { title: 'Data Science Intern', type: 'Internship', location: 'Remote', salary: '₹25,000/month', company: 'TechNova Solutions', companyId: company._id, description: 'Work on ML models for customer behavior prediction.', skills: ['Python', 'TensorFlow', 'SQL', 'Pandas'], applicants: [] },
            { title: 'Blockchain Developer', type: 'Contract', location: 'Bangalore', salary: '₹12-18 LPA', company: 'TechNova Solutions', companyId: company._id, description: 'Develop and audit smart contracts on Ethereum.', skills: ['Solidity', 'Web3.js', 'Rust', 'React'], applicants: [] },
            { title: 'UI/UX Designer', type: 'Full-time', location: 'Delhi', salary: '₹10-15 LPA', company: 'DesignHub India', companyId: company._id, description: 'Design intuitive user interfaces for SaaS products.', skills: ['Figma', 'Prototyping', 'User Research'], applicants: [] },
            { title: 'DevOps Engineer', type: 'Full-time', location: 'Pune', salary: '₹15-22 LPA', company: 'CloudScale Tech', companyId: company._id, description: 'Manage CI/CD pipelines and Kubernetes clusters.', skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'], applicants: [] },
            { title: 'AI/ML Research Intern', type: 'Internship', location: 'Bangalore', salary: '₹30,000/month', company: 'DeepMind Labs', companyId: company._id, description: 'Research novel NLP models and contribute to open-source.', skills: ['Python', 'PyTorch', 'NLP', 'Transformers'], applicants: [] },
        ]);

        // --- Seed Ideas ---
        const ideas = await Idea.insertMany([
            { title: 'AI-Powered Career Counselor', category: 'AI/ML', stage: 'Prototype', description: 'An intelligent chatbot for personalized career guidance using NLP.', tags: ['NLP', 'Career', 'Machine Learning'], author: 'Arjun Sharma', authorId: student._id, teamSize: 3, likes: [investor._id.toString()] },
            { title: 'GreenChain — Carbon Credit NFTs', category: 'Blockchain', stage: 'Idea', description: 'Tokenize carbon credits as NFTs for transparent trading.', tags: ['Web3', 'Sustainability', 'DeFi'], author: 'Arjun Sharma', authorId: student._id, teamSize: 2, likes: [] },
            { title: 'MedTrack — Patient Compliance App', category: 'HealthTech', stage: 'MVP', description: 'Gamified mobile app helping patients stick to medication schedules.', tags: ['Mobile', 'Gamification', 'Healthcare'], author: 'Arjun Sharma', authorId: student._id, teamSize: 4, likes: [investor._id.toString()] },
            { title: 'FarmSense IoT Dashboard', category: 'AgriTech', stage: 'Idea', description: 'Real-time soil and weather monitoring for small-scale farmers.', tags: ['IoT', 'Dashboard', 'Agriculture'], author: 'Arjun Sharma', authorId: student._id, teamSize: 1, likes: [] },
            { title: 'SkillSwap — Peer Learning', category: 'EdTech', stage: 'Prototype', description: 'Platform where students barter skills powered by a credit system.', tags: ['P2P', 'Education', 'Marketplace'], author: 'Arjun Sharma', authorId: student._id, teamSize: 3, likes: [] },
        ]);

        // --- Seed Shortlist ---
        await Shortlist.insertMany([
            { candidateId: 1, candidateName: 'Rahul Desai', companyId: company._id, role: 'Full Stack Developer', score: 920, projects: 12, skills: ['React', 'Node.js', 'AWS'], location: 'Mumbai', status: 'Interview Scheduled', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
            { candidateId: 2, candidateName: 'Ananya Singh', companyId: company._id, role: 'Data Scientist', score: 890, projects: 8, skills: ['Python', 'TensorFlow', 'SQL'], location: 'Bangalore', status: 'New', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
            { candidateId: 3, candidateName: 'Vikram Mehta', companyId: company._id, role: 'Blockchain Dev', score: 850, projects: 6, skills: ['Solidity', 'Web3.js', 'Rust'], location: 'Remote', status: 'Offer Sent', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        ]);

        // --- Seed Notifications ---
        await Notification.insertMany([
            { type: 'shortlist', message: 'TechNova Solutions viewed your profile', forRole: 'student' },
            { type: 'idea', message: 'Your idea "AI Career Counselor" received a new like', forRole: 'student' },
            { type: 'application', message: 'New application received for Senior Full Stack Developer', forRole: 'company' },
            { type: 'idea', message: 'New idea submitted: "AI-Powered Career Counselor"', forRole: 'investor' },
        ]);

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully!',
            credentials: {
                admin: { email: 'admin@bharatxcelerate.com', password: 'admin123' },
                student: { email: 'student@test.com', password: 'password123' },
                company: { email: 'company@test.com', password: 'password123' },
                investor: { email: 'investor@test.com', password: 'password123' },
            },
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    return POST();
}
