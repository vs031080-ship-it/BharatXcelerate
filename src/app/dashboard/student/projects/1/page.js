'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BarChart, Code, FileText, Link as LinkIcon, Github, Send, CheckCircle, AlertCircle, Download } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../project-detail.module.css';

const tabs = ['Overview', 'Resources', 'Submission'];

export default function ProjectDetailPage({ params }) {
    const [activeTab, setActiveTab] = useState('Overview');
    const [submissionStatus, setSubmissionStatus] = useState('pending'); // pending, submitted, graded

    const project = {
        id: 1,
        title: 'Build a Scalable E-Commerce API',
        domain: 'Backend Development',
        difficulty: 'Intermediate',
        points: 300,
        duration: '1 week',
        technologies: ['Node.js', 'Express', 'MongoDB', 'Redis'],
        description: 'Design and implement a RESTful API for a high-traffic e-commerce platform. You will handle user authentication, product management, shopping cart functionality, and order processing.',
        requirements: [
            'Implement JWT authentication for users and admins',
            'Create CRUD endpoints for products with pagination and filtering',
            'Implement a shopping cart using Redis for caching',
            'Handle concurrent order processing with database transactions',
            'Write unit tests for critical business logic'
        ],
        resources: [
            { type: 'doc', title: 'API Specification (Swagger)', url: '#' },
            { type: 'video', title: 'System Design: E-Commerce Architecture', url: '#' },
            { type: 'repo', title: 'Starter Code Repository', url: '#' }
        ]
    };

    return (
        <div className={styles.container}>
            {/* Back Link */}
            <Link href="/dashboard/student/projects" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to Projects
            </Link>

            {/* Header */}
            <div className={styles.header}>
                <div>
                    <div className={styles.badges}>
                        <span className={styles.badge}>{project.domain}</span>
                        <span className={`${styles.badge} ${styles.badgeDifficulty}`}>{project.difficulty}</span>
                    </div>
                    <h1>{project.title}</h1>
                    <div className={styles.meta}>
                        <span><Clock size={16} /> {project.duration}</span>
                        <span><BarChart size={16} /> {project.points} XP</span>
                        <span><Code size={16} /> {project.technologies.join(', ')}</span>
                    </div>
                </div>
                <div className={styles.statusBox}>
                    <span className={styles.statusLabel}>Status</span>
                    <div className={`${styles.statusBadge} ${styles.statusInProgress}`}>In Progress</div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                {tabs.map(tab => (
                    <button key={tab} className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className={styles.content}>
                {activeTab === 'Overview' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <section className={styles.section}>
                            <h3>Project Description</h3>
                            <p>{project.description}</p>
                        </section>
                        <section className={styles.section}>
                            <h3>Key Requirements</h3>
                            <ul className={styles.reqList}>
                                {project.requirements.map((req, i) => (
                                    <li key={i}><CheckCircle size={16} className={styles.checkIcon} /> {req}</li>
                                ))}
                            </ul>
                        </section>
                    </motion.div>
                )}

                {activeTab === 'Resources' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className={styles.resourceGrid}>
                            {project.resources.map((res, i) => (
                                <div key={i} className={styles.resourceCard}>
                                    <div className={styles.resIcon}>
                                        {res.type === 'doc' ? <FileText size={24} /> : res.type === 'repo' ? <Github size={24} /> : <AlertCircle size={24} />}
                                    </div>
                                    <div className={styles.resContent}>
                                        <h4>{res.title}</h4>
                                        <Link href={res.url} className={styles.resLink}>Access Resource <ArrowRight size={14} /></Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'Submission' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className={styles.submissionForm}>
                            <div className={styles.formGroup}>
                                <label><Github size={16} /> GitHub Repository URL</label>
                                <input type="url" placeholder="https://github.com/username/project-repo" />
                            </div>
                            <div className={styles.formGroup}>
                                <label><LinkIcon size={16} /> Live Demo URL (Optional)</label>
                                <input type="url" placeholder="https://my-project-demo.vercel.app" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Project Notes / README Summary</label>
                                <textarea rows={5} placeholder="Briefly describe your approach, trade-offs, and any innovative features you implemented..."></textarea>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={() => setSubmissionStatus('submitted')}>
                                <Send size={18} /> Submit Project
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
