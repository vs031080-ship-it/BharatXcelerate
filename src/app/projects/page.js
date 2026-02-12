'use client';
import { Suspense, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Clock, BarChart3, Tag } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import styles from './projects.module.css';

const allProjects = [
    { id: 1, title: 'AI-Powered Resume Screener', domain: 'Artificial Intelligence', difficulty: 'Intermediate', duration: '4 weeks', description: 'Build an AI system that screens resumes using NLP and ranks candidates.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop' },
    { id: 2, title: 'E-Commerce Platform with React', domain: 'Web Development', difficulty: 'Beginner', duration: '3 weeks', description: 'Build a fully functional e-commerce storefront using React and REST APIs.', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=250&fit=crop' },
    { id: 3, title: 'Real-Time Stock Dashboard', domain: 'Data Science', difficulty: 'Advanced', duration: '5 weeks', description: 'Create a live stock analytics dashboard with chart visualizations.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop' },
    { id: 4, title: 'Cross-Platform Chat App', domain: 'Mobile Apps', difficulty: 'Intermediate', duration: '4 weeks', description: 'Develop a real-time messaging app using React Native and Firebase.', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=250&fit=crop' },
    { id: 5, title: 'Serverless API on AWS', domain: 'Cloud Computing', difficulty: 'Advanced', duration: '3 weeks', description: 'Deploy a production-ready serverless REST API using AWS Lambda.', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop' },
    { id: 6, title: 'Network Intrusion Detector', domain: 'Cybersecurity', difficulty: 'Advanced', duration: '6 weeks', description: 'Build a network traffic analysis tool to detect malicious patterns.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop' },
    { id: 7, title: 'NFT Marketplace DApp', domain: 'Blockchain', difficulty: 'Advanced', duration: '5 weeks', description: 'Create a decentralized marketplace for minting and trading NFTs.', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop' },
    { id: 8, title: 'Sentiment Analysis Engine', domain: 'Artificial Intelligence', difficulty: 'Intermediate', duration: '3 weeks', description: 'Analyze social media posts and reviews using NLP sentiment classification.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop' },
    { id: 9, title: 'Portfolio Website Builder', domain: 'Web Development', difficulty: 'Beginner', duration: '2 weeks', description: 'Create a drag-and-drop portfolio builder with customizable themes.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop' },
    { id: 10, title: 'Predictive Analytics Tool', domain: 'Data Science', difficulty: 'Advanced', duration: '6 weeks', description: 'Build a forecasting model for business KPIs using time-series analysis.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop' },
    { id: 11, title: 'Fitness Tracker App', domain: 'Mobile Apps', difficulty: 'Beginner', duration: '3 weeks', description: 'Build a mobile fitness tracking app with workout logging and progress charts.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop' },
    { id: 12, title: 'Smart Contract Auditor', domain: 'Blockchain', difficulty: 'Advanced', duration: '5 weeks', description: 'Develop a tool that audits Solidity smart contracts for vulnerabilities.', image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=250&fit=crop' },
    { id: 13, title: 'Chatbot with LLM Integration', domain: 'Artificial Intelligence', difficulty: 'Intermediate', duration: '4 weeks', description: 'Build a customer support chatbot powered by large language models.', image: 'https://images.unsplash.com/photo-1531746790095-e5088c852fbe?w=400&h=250&fit=crop' },
    { id: 14, title: 'Blog CMS with Next.js', domain: 'Web Development', difficulty: 'Intermediate', duration: '3 weeks', description: 'Create a content management system with markdown editing and SEO tools.', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop' },
    { id: 15, title: 'Customer Churn Prediction', domain: 'Data Science', difficulty: 'Intermediate', duration: '4 weeks', description: 'Build a ML model to predict customer churn using historical data.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop' },
    { id: 16, title: 'Food Delivery App UI', domain: 'Mobile Apps', difficulty: 'Beginner', duration: '2 weeks', description: 'Design and prototype a food delivery app with ordering and tracking UI.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop' },
    { id: 17, title: 'Kubernetes Cluster Setup', domain: 'Cloud Computing', difficulty: 'Advanced', duration: '4 weeks', description: 'Set up a production Kubernetes cluster with CI/CD pipeline integration.', image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop' },
    { id: 18, title: 'Password Manager App', domain: 'Cybersecurity', difficulty: 'Intermediate', duration: '3 weeks', description: 'Build a secure password vault with AES encryption and master key auth.', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop' },
    { id: 19, title: 'DeFi Lending Protocol', domain: 'Blockchain', difficulty: 'Advanced', duration: '6 weeks', description: 'Create a decentralized lending and borrowing protocol on Ethereum.', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=250&fit=crop' },
    { id: 20, title: 'Image Classification API', domain: 'Artificial Intelligence', difficulty: 'Beginner', duration: '2 weeks', description: 'Deploy a pre-trained image classification model as a REST API.', image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400&h=250&fit=crop' },
    { id: 21, title: 'Social Media Dashboard', domain: 'Web Development', difficulty: 'Intermediate', duration: '4 weeks', description: 'Build a dashboard aggregating analytics from multiple social platforms.', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop' },
    { id: 22, title: 'Recommendation Engine', domain: 'Data Science', difficulty: 'Advanced', duration: '5 weeks', description: 'Create a collaborative filtering recommendation system for products.', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=250&fit=crop' },
    { id: 23, title: 'AR Navigation App', domain: 'Mobile Apps', difficulty: 'Advanced', duration: '6 weeks', description: 'Build an augmented reality navigation app for indoor environments.', image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=250&fit=crop' },
    { id: 24, title: 'Multi-Cloud Deployment Tool', domain: 'Cloud Computing', difficulty: 'Intermediate', duration: '4 weeks', description: 'Build a tool that deploys apps across AWS, Azure, and GCP simultaneously.', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop' },
    { id: 25, title: 'Web Application Firewall', domain: 'Cybersecurity', difficulty: 'Advanced', duration: '5 weeks', description: 'Develop a WAF that detects and blocks SQL injection and XSS attacks.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=400&h=250&fit=crop' },
    { id: 26, title: 'Supply Chain Tracker on Blockchain', domain: 'Blockchain', difficulty: 'Intermediate', duration: '4 weeks', description: 'Track product supply chain journey using blockchain transparency.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop' },
    { id: 27, title: 'Voice Assistant with Python', domain: 'Artificial Intelligence', difficulty: 'Beginner', duration: '2 weeks', description: 'Create a voice-controlled assistant that can perform web searches and tasks.', image: 'https://images.unsplash.com/photo-1589254065878-42c014d074e0?w=400&h=250&fit=crop' },
    { id: 28, title: 'Real-Time Collaboration Editor', domain: 'Web Development', difficulty: 'Advanced', duration: '5 weeks', description: 'Build a Google Docs-like collaborative editor with real-time sync.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop' },
    { id: 29, title: 'A/B Testing Platform', domain: 'Data Science', difficulty: 'Intermediate', duration: '3 weeks', description: 'Create a statistical A/B testing framework with results dashboard.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop' },
    { id: 30, title: 'Expense Tracker Mobile App', domain: 'Mobile Apps', difficulty: 'Beginner', duration: '2 weeks', description: 'Track daily expenses with category breakdowns and monthly reports.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop' },
    { id: 31, title: 'Terraform Infrastructure Automation', domain: 'Cloud Computing', difficulty: 'Intermediate', duration: '3 weeks', description: 'Automate cloud infrastructure provisioning using Terraform modules.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop' },
    { id: 32, title: 'Vulnerability Scanner', domain: 'Cybersecurity', difficulty: 'Intermediate', duration: '3 weeks', description: 'Build a web vulnerability scanner that detects OWASP Top 10 issues.', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop' },
    { id: 33, title: 'Medical Image Analyzer', domain: 'Artificial Intelligence', difficulty: 'Advanced', duration: '6 weeks', description: 'Use deep learning to analyze X-ray images for anomaly detection.', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop' },
    { id: 34, title: 'Job Board Platform', domain: 'Web Development', difficulty: 'Intermediate', duration: '4 weeks', description: 'Create a full-stack job board with posting, search, and application features.', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop' },
    { id: 35, title: 'Fraud Detection System', domain: 'Data Science', difficulty: 'Advanced', duration: '5 weeks', description: 'Build a ML pipeline that detects fraudulent transactions in real-time.', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop' },
    { id: 36, title: 'Ride-Sharing App Prototype', domain: 'Mobile Apps', difficulty: 'Intermediate', duration: '5 weeks', description: 'Build a ride-sharing app with real-time location tracking and fare estimation.', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=250&fit=crop' },
    { id: 37, title: 'Serverless Data Pipeline', domain: 'Cloud Computing', difficulty: 'Advanced', duration: '4 weeks', description: 'Create an event-driven data processing pipeline using serverless functions.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop' },
    { id: 38, title: 'Email Phishing Detector', domain: 'Cybersecurity', difficulty: 'Beginner', duration: '2 weeks', description: 'Analyze email content to detect phishing attempts using ML classifiers.', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop' },
    { id: 39, title: 'DAO Governance Platform', domain: 'Blockchain', difficulty: 'Advanced', duration: '6 weeks', description: 'Build a decentralized governance system with proposal voting mechanisms.', image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=250&fit=crop' },
    { id: 40, title: 'Autonomous Drone Controller', domain: 'Artificial Intelligence', difficulty: 'Advanced', duration: '8 weeks', description: 'Program an autonomous drone navigation system using computer vision.', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=250&fit=crop' },
    { id: 41, title: 'Learning Management System', domain: 'Web Development', difficulty: 'Advanced', duration: '6 weeks', description: 'Build a full LMS with course creation, enrollment, and progress tracking.', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=250&fit=crop' },
    { id: 42, title: 'Natural Language SQL Query', domain: 'Data Science', difficulty: 'Intermediate', duration: '3 weeks', description: 'Convert natural language questions into SQL queries using NLP models.', image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop' },
    { id: 43, title: 'IoT Home Automation App', domain: 'Mobile Apps', difficulty: 'Intermediate', duration: '4 weeks', description: 'Control smart home devices from a mobile app with scheduling features.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop' },
    { id: 44, title: 'Cloud Cost Optimizer', domain: 'Cloud Computing', difficulty: 'Intermediate', duration: '3 weeks', description: 'Build a tool that analyzes cloud spending and suggests cost reductions.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop' },
    { id: 45, title: 'Zero Trust Network Architecture', domain: 'Cybersecurity', difficulty: 'Advanced', duration: '6 weeks', description: 'Design and implement a zero-trust security model for enterprise networks.', image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=250&fit=crop' },
    { id: 46, title: 'Token Launchpad Platform', domain: 'Blockchain', difficulty: 'Intermediate', duration: '4 weeks', description: 'Create a platform for launching and managing token sales and IDOs.', image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&h=250&fit=crop' },
    { id: 47, title: 'AI Content Generator', domain: 'Artificial Intelligence', difficulty: 'Intermediate', duration: '3 weeks', description: 'Build a content generation tool that creates blog posts and social media copy.', image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=250&fit=crop' },
    { id: 48, title: 'Video Streaming Platform', domain: 'Web Development', difficulty: 'Advanced', duration: '6 weeks', description: 'Build a YouTube-like video platform with upload, transcode, and streaming.', image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=250&fit=crop' },
    { id: 49, title: 'Geospatial Data Visualizer', domain: 'Data Science', difficulty: 'Intermediate', duration: '3 weeks', description: 'Create interactive maps and heatmaps from geospatial datasets.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop' },
    { id: 50, title: 'Mental Health Tracker App', domain: 'Mobile Apps', difficulty: 'Beginner', duration: '3 weeks', description: 'Build a mood tracking and journaling app with wellness insights.', image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=400&h=250&fit=crop' },
];

const domains = ['All', 'Artificial Intelligence', 'Web Development', 'Data Science', 'Mobile Apps', 'Cloud Computing', 'Cybersecurity', 'Blockchain'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const durations = ['All', '2 weeks', '3 weeks', '4 weeks', '5 weeks', '6+ weeks'];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.03 } }),
};

function ProjectsContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';

    const [search, setSearch] = useState('');
    const [domain, setDomain] = useState(initialCategory);
    const [difficulty, setDifficulty] = useState('All');
    const [duration, setDuration] = useState('All');

    const filtered = useMemo(() => {
        return allProjects.filter((p) => {
            const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
            const matchDomain = domain === 'All' || p.domain === domain;
            const matchDiff = difficulty === 'All' || p.difficulty === difficulty;
            const matchDur = duration === 'All' || (duration === '6+ weeks' ? parseInt(p.duration) >= 6 : p.duration === duration);
            return matchSearch && matchDomain && matchDiff && matchDur;
        });
    }, [search, domain, difficulty, duration]);

    return (
        <>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="section-label">Project Catalog</span>
                        <h1 className={styles.heroTitle}>Explore <span className="gradient-text">50+ Real-World Projects</span></h1>
                        <p className={styles.heroSub}>Pick a project, execute it, and build your proof-of-work portfolio. No prerequisites — just start.</p>
                        <div className={styles.searchBar}>
                            <Search size={20} className={styles.searchIcon} />
                            <input type="text" placeholder="Search projects by name or keyword..." value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchInput} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className={styles.content}>
                <div className={`container ${styles.contentGrid}`}>
                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        <div className={styles.filterGroup}>
                            <h4><Filter size={16} /> Domain</h4>
                            {domains.map((d) => (
                                <button key={d} className={`${styles.filterBtn} ${domain === d ? styles.filterActive : ''}`} onClick={() => setDomain(d)}>{d}</button>
                            ))}
                        </div>
                        <div className={styles.filterGroup}>
                            <h4><BarChart3 size={16} /> Difficulty</h4>
                            {difficulties.map((d) => (
                                <button key={d} className={`${styles.filterBtn} ${difficulty === d ? styles.filterActive : ''}`} onClick={() => setDifficulty(d)}>{d}</button>
                            ))}
                        </div>
                        <div className={styles.filterGroup}>
                            <h4><Clock size={16} /> Duration</h4>
                            {durations.map((d) => (
                                <button key={d} className={`${styles.filterBtn} ${duration === d ? styles.filterActive : ''}`} onClick={() => setDuration(d)}>{d}</button>
                            ))}
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className={styles.projectsArea}>
                        <p className={styles.resultCount}><strong>{filtered.length}</strong> projects found</p>
                        <div className={styles.projectGrid}>
                            {filtered.map((project, i) => (
                                <motion.div key={project.id} className={styles.projectCard} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} whileHover={{ y: -6 }}>
                                    <div className={styles.projectImage}>
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img src={project.image} alt={project.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                        </div>
                                        <span className={styles.difficulty}>{project.difficulty}</span>
                                    </div>
                                    <div className={styles.projectInfo}>
                                        <div className={styles.projectMeta}>
                                            <span className={styles.domainTag}><Tag size={12} /> {project.domain}</span>
                                            <span className={styles.durationTag}><Clock size={12} /> {project.duration}</span>
                                        </div>
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                        <Link href="/login" className="btn btn-primary btn-sm">Start Project <ArrowRight size={14} /></Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {filtered.length === 0 && (
                            <div className={styles.emptyState}>
                                <h3>No projects found</h3>
                                <p>Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProjectsContent />
        </Suspense>
    );
}
