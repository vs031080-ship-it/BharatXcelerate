import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
    try {
        await connectDB();

        // Optional: clear existing projects to avoid duplicates during dev
        // await Project.deleteMany({}); 

        const projects = [
            {
                title: 'AI-Powered Resume Screener',
                description: 'Build an AI tool that parses resumes and matches them with job descriptions using NLP.',
                domain: 'AI/ML',
                difficulty: 'Advanced',
                points: 500,
                image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
                skills: ['Python', 'NLP', 'React', 'FastAPI'],
                duration: '4 weeks',
                technologies: ['OpenAI API', 'Spacy', 'Next.js', 'PostgreSQL'],
                steps: [
                    { title: 'Project Setup & NLP Research', description: 'Initialize the project repository and research NLP libraries like Spacy or OpenAI.', points: 50 },
                    { title: 'Backend API Development', description: 'Create a FastAPI backend to accept resume files and parse text.', points: 100 },
                    { title: 'AI Matching Logic', description: 'Implement the logic to compare resume keywords with job descriptions.', points: 150 },
                    { title: 'Frontend Dashboard', description: 'Build a React dashboard for HR to upload resumes and view scores.', points: 100 },
                    { title: 'Final Testing & Deployment', description: 'Test the application with real resumes and deploy to Vercel/Render.', points: 100 }
                ]
            },
            {
                title: 'DeFi Crowdfunding Platform',
                description: 'Create a decentralized crowdfunding campaign manager using Smart Contracts.',
                domain: 'Blockchain',
                difficulty: 'Expert',
                points: 800,
                image: 'https://images.unsplash.com/photo-1621504450168-b8c493a74027?w=800&q=80',
                skills: ['Solidity', 'Web3.js', 'React', 'Hardhat'],
                duration: '6 weeks',
                technologies: ['Ethereum', 'Metamask', 'Infura', 'React'],
                steps: [
                    { title: 'Smart Contract Design', description: 'Design the Solidity contract for creating campaigns and pledging funds.', points: 150 },
                    { title: 'Contract Testing', description: 'Write unit tests using Hardhat to verify contract logic.', points: 100 },
                    { title: 'Frontend Integration', description: 'Connect the React frontend to the deployed contract using Web3.js.', points: 200 },
                    { title: 'Campaign Dashboard', description: 'Create UI for users to view campaigns and donate ETH.', points: 200 },
                    { title: 'Deployment to Testnet', description: 'Deploy the contract to Sepolia or Goerli testnet.', points: 150 }
                ]
            },
            {
                title: 'E-Commerce Microservices',
                description: 'Refactor a monolithic e-commerce backend into scalable microservices.',
                domain: 'Backend',
                difficulty: 'Advanced',
                points: 600,
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80',
                skills: ['Node.js', 'Docker', 'Kubernetes', 'RabbitMQ'],
                duration: '5 weeks',
                technologies: ['Express', 'MongoDB', 'Redis', 'Nginx'],
                steps: [
                    { title: 'Service Decomposition', description: 'Identify core domains (User, Product, Order) and plan service boundaries.', points: 100 },
                    { title: 'User & Auth Service', description: 'Implement the User service with JWT authentication.', points: 100 },
                    { title: 'Product Catalog Service', description: 'Create the Product service with caching using Redis.', points: 100 },
                    { title: 'Order & Inventory Service', description: 'Build the Order service handling transactions and inventory updates.', points: 150 },
                    { title: 'API Gateway & Orchestration', description: 'Set up an API Gateway to route requests to appropriate services.', points: 150 }
                ]
            },
            {
                title: 'Real-time Chat Application',
                description: 'Build a scalable real-time chat app like Slack or Discord.',
                domain: 'Full Stack',
                difficulty: 'Intermediate',
                points: 400,
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
                skills: ['Socket.io', 'React', 'Node.js', 'MongoDB'],
                duration: '3 weeks',
                technologies: ['WebSockets', 'Express', 'Mongoose', 'Tailwind'],
                steps: [
                    { title: 'WebSocket Server Setup', description: 'Initialize Node.js server with Socket.io for real-time communication.', points: 50 },
                    { title: 'User Authentication', description: 'Implement login/signup to identify chat users.', points: 50 },
                    { title: 'Chat Interface', description: 'Build the chat UI with message history and typing indicators.', points: 100 },
                    { title: 'Room Management', description: 'Allow users to join specific rooms or channels.', points: 100 },
                    { title: 'Media Sharing', description: 'Add functionality to share images or files in chat.', points: 100 }
                ]
            },
            {
                title: 'Personal Finance Tracker',
                description: 'A dashboard to track income, expenses, and visualize spending habits.',
                domain: 'Frontend',
                difficulty: 'Beginner',
                points: 300,
                image: 'https://images.unsplash.com/photo-1554224155-98406797170a?w=800&q=80',
                skills: ['React', 'Chart.js', 'Firebase'],
                duration: '2 weeks',
                technologies: ['React Context', 'Material UI', 'Plaid API'],
                steps: [
                    { title: 'UI Layout & Components', description: 'Design the layout using Material UI or Tailwind.', points: 50 },
                    { title: 'Input Forms', description: 'Create forms to add income and expense entries.', points: 50 },
                    { title: 'Data Visualization', description: 'Implement charts to show spending breakdown by category.', points: 100 },
                    { title: 'Budget Goals', description: 'Add feature to set monthly budget limits and progress.', points: 50 },
                    { title: 'Persistence', description: 'Save user data to local storage or Firebase Firestore.', points: 50 }
                ]
            },
            {
                title: 'Task Management API',
                description: 'A robust RESTful API for a task management tool like Jira.',
                domain: 'Backend',
                difficulty: 'Intermediate',
                points: 350,
                image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
                skills: ['Node.js', 'PostgreSQL', 'Sequelize'],
                duration: '2 weeks',
                technologies: ['Express', 'Jest', 'Swagger'],
                steps: [
                    { title: 'Database Schema Design', description: 'Design SQL schema for Users, Tasks, Projects, and Comments.', points: 50 },
                    { title: 'CRUD Endpoints', description: 'Implement API routes for creating, reading, updating and deleting tasks.', points: 100 },
                    { title: 'Filtering & Pagination', description: 'Add query parameters for filtering tasks by status and pagination.', points: 50 },
                    { title: 'Authentication Middleware', description: 'Secure the API using JWT middleware.', points: 50 },
                    { title: 'Documentation', description: 'Document the API using Swagger/OpenAPI.', points: 100 }
                ]
            },
            {
                title: 'Image Classification Model',
                description: 'Train a CNN model to classify images (e.g., Cats vs Dogs or CIFAR-10).',
                domain: 'Data Science',
                difficulty: 'Intermediate',
                points: 450,
                image: 'https://images.unsplash.com/photo-1633412803868-3932cf5c0c30?w=800&q=80',
                skills: ['Python', 'TensorFlow', 'Keras', 'NumPy'],
                duration: '3 weeks',
                technologies: ['Jupyter Notebook', 'Matplotlib', 'Pandas'],
                steps: [
                    { title: 'Data Preprocessing', description: 'Load dataset, normalize images, and split into train/test sets.', points: 100 },
                    { title: 'Model Architecture', description: 'Design a Convolutional Neural Network (CNN) structure.', points: 100 },
                    { title: 'Training & Tuning', description: 'Train the model and tune hyperparameters for accuracy.', points: 150 },
                    { title: 'Evaluation', description: 'Evaluate model performance using Confusion Matrix and F1 Score.', points: 50 },
                    { title: 'Inference Script', description: 'Write a script to classify new images using the trained model.', points: 50 }
                ]
            },
            {
                title: 'DevOps CI/CD Pipeline',
                description: 'Set up a complete CI/CD pipeline for a Node.js application.',
                domain: 'DevOps',
                difficulty: 'Advanced',
                points: 550,
                image: 'https://images.unsplash.com/photo-1667372393119-38f6344f978d?w=800&q=80',
                skills: ['GitHub Actions', 'Docker', 'AWS'],
                duration: '3 weeks',
                technologies: ['EC2', 'Docker Hub', 'Nginx'],
                steps: [
                    { title: 'Dockerization', description: 'Create a Dockerfile to containerize the Node.js app.', points: 100 },
                    { title: 'CI Workflow', description: 'Configure GitHub Actions to run tests on every push.', points: 100 },
                    { title: 'CD Workflow', description: 'Automate deployment to an AWS EC2 instance.', points: 150 },
                    { title: 'Monitoring', description: 'Set up basic monitoring/logging for the deployed container.', points: 100 },
                    { title: 'Optimization', description: 'Optimize Docker image size and build times.', points: 100 }
                ]
            },
            {
                title: 'Mobile Fitness App',
                description: 'A React Native app to track workouts and nutrition.',
                domain: 'Mobile',
                difficulty: 'Intermediate',
                points: 400,
                image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
                skills: ['React Native', 'Expo', 'Redux'],
                duration: '3 weeks',
                technologies: ['Expo Go', 'AsyncStorage', 'NativeWind'],
                steps: [
                    { title: 'App Navigation', description: 'Set up tab and stack navigation structure.', points: 50 },
                    { title: 'Workout Logger', description: 'Create screens to log exercises, sets, and reps.', points: 100 },
                    { title: 'Timer Component', description: 'Build a custom timer for rest intervals.', points: 50 },
                    { title: 'History View', description: 'Display past workouts in a list or calendar view.', points: 100 },
                    { title: 'Stats Screen', description: 'Visualize progress (e.g., max weight lifted over time).', points: 100 }
                ]
            },
            {
                title: 'Cybersecurity Penetration Test',
                description: 'Perform a vulnerability assessment on a dummy target application.',
                domain: 'Cybersecurity',
                difficulty: 'Advanced',
                points: 700,
                image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
                skills: ['Burp Suite', 'OWASP Top 10', 'Python'],
                duration: '3 weeks',
                technologies: ['Kali Linux', 'Nmap', 'SQLMap'],
                steps: [
                    { title: 'Reconnaissance', description: 'Gather information about the target (ports, services).', points: 100 },
                    { title: 'Vulnerability Scanning', description: 'Use automated scanners to find potential weaknesses.', points: 100 },
                    { title: 'Exploitation (Simulated)', description: 'Demonstrate how an SQL injection or XSS could be exploited.', points: 200 },
                    { title: 'Reporting', description: 'Write a detailed report of findings and remediation steps.', points: 200 },
                    { title: 'Patch Verification', description: 'Verify that applied fixes effectively mitigate the vulnerabilities.', points: 100 }
                ]
            }
        ];

        // Upsert projects based on title
        for (const p of projects) {
            await Project.findOneAndUpdate(
                { title: p.title },
                { ...p, status: 'active' },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        return NextResponse.json({ success: true, message: 'Seeded 10 diverse projects with steps' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
