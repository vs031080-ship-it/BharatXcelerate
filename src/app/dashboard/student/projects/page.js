'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Target, Zap, ArrowRight, Loader,
    CheckCircle, AlertCircle, BookOpen, Layers
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './projects.module.css';

export default function MyProjectsPage() {
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/student/projects/active', { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    setAllProjects(data.projects || []);
                }
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filter projects based on tab
    const filteredProjects = allProjects.filter(item => {
        if (activeTab === 'active') {
            return item.status !== 'completed' && item.status !== 'archived';
        }
        return item.status === 'completed';
    });

    if (loading) return (
        <div className={styles.loading}>
            <Loader className={styles.spinner} size={24} /> Loading your projects...
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Banner */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1>My Projects</h1>
                <p>Track your progress, continue where you left off, and review your completed achievements.</p>
            </motion.div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'active' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    In Progress ({allProjects.filter(p => p.status !== 'completed').length})
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'completed' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed ({allProjects.filter(p => p.status === 'completed').length})
                </button>
            </div>

            {/* Content Grid */}
            <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((item) => (
                        <motion.div
                            key={item.id}
                            className={styles.card}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.domainBadge}>{item.domain}</span>
                                {item.status === 'completed' ? (
                                    <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>Completed</span>
                                ) : (
                                    <span className={`${styles.statusBadge} ${styles.statusStarted}`}>
                                        Step {(item.currentStep || 0) + 1}
                                    </span>
                                )}
                            </div>

                            <Link href={`/dashboard/student/projects/${item.id}`} style={{ textDecoration: 'none' }}>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                            </Link>

                            <div className={styles.cardMeta}>
                                <div className={styles.metaItem}>
                                    <Target size={14} /> <span>+{item.points} XP</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <Zap size={14} /> <span>{item.difficulty}</span>
                                </div>
                            </div>

                            <div className={styles.progressContainer}>
                                <div className={styles.progressLabel}>
                                    <span>Progress</span>
                                    <span>{item.progress}%</span>
                                </div>
                                <div className={styles.progressBarBg}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            </div>

                            <Link href={`/dashboard/student/projects/${item.id}`} className={styles.actionBtn}>
                                {item.status === 'completed' ? 'View Certificate' : 'Continue Working'}
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <motion.div className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className={styles.emptyIcon}>
                        {activeTab === 'active' ? <Layers size={48} /> : <CheckCircle size={48} />}
                    </div>
                    <h3>
                        {activeTab === 'active'
                            ? "No active projects"
                            : "No completed projects yet"}
                    </h3>
                    <p>
                        {activeTab === 'active'
                            ? "Explore the project library to find your next challenge!"
                            : "Complete projects to earn XP and build your portfolio."}
                    </p>
                    {activeTab === 'active' && (
                        <Link href="/dashboard/student/explore" className={styles.browseBtn}>
                            Browse Projects <ArrowRight size={16} />
                        </Link>
                    )}
                </motion.div>
            )}
        </div>
    );
}
