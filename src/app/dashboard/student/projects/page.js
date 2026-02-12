'use client';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, CheckCircle, BarChart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import styles from './projects.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const allProjects = [
    { id: 1, title: 'E-Commerce Platform', domain: 'Full Stack', difficulty: 'Intermediate', points: 300, status: 'In Progress', progress: 65, image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=100&h=100&fit=crop' },
    { id: 2, title: 'AI Resume Screener', domain: 'AI/ML', difficulty: 'Intermediate', points: 200, status: 'Not Started', progress: 0, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop' },
    { id: 3, title: 'DeFi Lending Protocol', domain: 'Blockchain', difficulty: 'Advanced', points: 350, status: 'Not Started', progress: 0, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop' },
    { id: 4, title: 'Task Manager API', domain: 'Backend', difficulty: 'Beginner', points: 100, status: 'Completed', progress: 100, image: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=100&h=100&fit=crop' },
    { id: 5, title: 'Portfolio Website', domain: 'Frontend', difficulty: 'Beginner', points: 150, status: 'Completed', progress: 100, image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100&h=100&fit=crop' },
];

export default function StudentProjectsPage() {
    const [filter, setFilter] = useState('All');

    const filteredProjects = filter === 'All' ? allProjects : allProjects.filter(p => p.status === filter);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>My Projects</h1>
                    <p>Manage your active work and view your submission history.</p>
                </div>
                <Link href="/projects" className="btn btn-primary">Browse New Projects <ArrowRight size={16} /></Link>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={18} />
                    <input type="text" placeholder="Search your projects..." />
                </div>
                <div className={styles.filters}>
                    {['All', 'In Progress', 'Completed', 'Not Started'].map(f => (
                        <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`} onClick={() => setFilter(f)}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.grid}>
                {filteredProjects.map((p, i) => (
                    <motion.div key={p.id} className={styles.card} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                        <div className={styles.cardHeader}>
                            <img src={p.image} alt={p.title} className={styles.img} />
                            <div className={styles.statusBadge} data-status={p.status}>{p.status}</div>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.meta}>
                                <span>{p.domain}</span>
                                <span>{p.difficulty}</span>
                            </div>
                            <h4>{p.title}</h4>
                            <div className={styles.progressSection}>
                                <div className={styles.progressBar}>
                                    <div style={{ width: `${p.progress}%` }}></div>
                                </div>
                                <span>{p.progress}%</span>
                            </div>
                            <div className={styles.pointsRow}>
                                <span className={styles.points}><BarChart size={14} /> {p.points} XP</span>
                                <Link href={`/dashboard/student/projects/${p.id}`} className={styles.actionLink}>
                                    {p.status === 'Completed' ? 'View Submission' : 'Continue Working'} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
