'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Target, Zap, ArrowRight, BookOpen, Trophy, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';
import styles from './student.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };

const difficultyColors = {
    Beginner: { bg: '#D1FAE5', color: '#065F46' },
    Intermediate: { bg: '#DBEAFE', color: '#1E40AF' },
    Advanced: { bg: '#FEF3C7', color: '#92400E' },
    Expert: { bg: '#FEE2E2', color: '#991B1B' },
};

const sampleProjects = [
    { id: 1, title: 'E-Commerce Platform', domain: 'Full Stack', difficulty: 'Intermediate', points: 300, progress: 65 },
    { id: 2, title: 'AI Resume Screener', domain: 'AI/ML', difficulty: 'Intermediate', points: 200, progress: 40 },
    { id: 3, title: 'Task Manager API', domain: 'Backend', difficulty: 'Beginner', points: 100, progress: 90 },
];

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const firstName = user?.name?.split(' ')[0] || 'Student';
    const [acceptedCount, setAcceptedCount] = useState(0);

    useEffect(() => {
        const fetchAccepted = async () => {
            try {
                const res = await fetch('/api/student/submit', { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    setAcceptedCount((data.submissions || []).length);
                }
            } catch { /* ignore */ }
        };
        fetchAccepted();
    }, []);

    const totalXP = sampleProjects.reduce((acc, p) => acc + Math.round(p.points * p.progress / 100), 0);

    return (
        <div className={styles.container}>
            {/* Welcome Banner — Upstream style */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.bannerContent}>
                    <span className={styles.bannerBreadcrumb}>Student · Dashboard</span>
                    <h1>Welcome back, {firstName} 👋</h1>
                    <p>Track your projects, build your portfolio, and earn XP.</p>
                </div>
                <Link href="/dashboard/student/explore" className={styles.exploreBtnLarge}>
                    <FolderKanban size={18} /> Explore Projects
                </Link>
            </motion.div>

            {/* Stats — Compact icon-left */}
            <div className={styles.statsGrid}>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <div className={styles.statIcon} style={{ background: '#F0F9FF', color: '#0EA5E9' }}><FolderKanban size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{acceptedCount || sampleProjects.length}</span>
                        <span className={styles.statLabel}>Active Projects</span>
                    </div>
                    <TrendingUp size={14} className={styles.statTrend} />
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    <div className={styles.statIcon} style={{ background: '#F0FDFA', color: '#0D9488' }}><Target size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{totalXP}</span>
                        <span className={styles.statLabel}>Total XP Earned</span>
                    </div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <div className={styles.statIcon} style={{ background: '#FEF3C7', color: '#F59E0B' }}><Trophy size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{sampleProjects.filter(p => p.progress >= 80).length}</span>
                        <span className={styles.statLabel}>Near Completion</span>
                    </div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                    <div className={styles.statIcon} style={{ background: '#F5F3FF', color: '#8B5CF6' }}><Star size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>4.2</span>
                        <span className={styles.statLabel}>Avg. Score</span>
                    </div>
                </motion.div>
            </div>

            {/* Active Projects — Horizontal cards like Upstream Events list */}
            <motion.div className={styles.section} initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                <div className={styles.sectionHeader}>
                    <h2>Active Projects</h2>
                    <Link href="/dashboard/student/explore" className={styles.viewAll}>Explore More <ArrowRight size={14} /></Link>
                </div>
                <div className={styles.projectList}>
                    {sampleProjects.map((project, i) => {
                        const dc = difficultyColors[project.difficulty] || {};
                        return (
                            <motion.div key={project.id} className={styles.projectCard} variants={fadeUp} custom={i + 5}>
                                <div className={styles.projectAvatar} style={{ background: dc.bg, color: dc.color }}>
                                    {project.title.charAt(0)}
                                </div>
                                <div className={styles.projectInfo}>
                                    <h4>{project.title}</h4>
                                    <div className={styles.projectMeta}>
                                        <span className={styles.domainBadge}>{project.domain}</span>
                                        <span className={styles.diffBadge} style={{ background: dc.bg, color: dc.color }}>
                                            <Zap size={10} /> {project.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.projectProgress}>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${project.progress}%` }} />
                                    </div>
                                    <span className={styles.progressLabel}>{project.progress}%</span>
                                </div>
                                <div className={styles.projectXP}>
                                    <strong>+{project.points}</strong>
                                    <span>XP</span>
                                </div>
                                <Link href={`/dashboard/student/projects/${project.id}`} className={styles.projectViewBtn}>
                                    <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Recommended Actions */}
            <motion.div className={styles.quickActions} initial="hidden" animate="visible" variants={fadeUp} custom={8}>
                <Link href="/dashboard/student/explore" className={styles.quickActionCard}>
                    <FolderKanban size={20} />
                    <span>Browse Projects</span>
                    <ArrowRight size={14} />
                </Link>
                <Link href="/dashboard/student/idea-lab" className={styles.quickActionCard}>
                    <BookOpen size={20} />
                    <span>Idea Lab</span>
                    <ArrowRight size={14} />
                </Link>
                <Link href="/dashboard/student/profile" className={styles.quickActionCard}>
                    <Trophy size={20} />
                    <span>My Profile</span>
                    <ArrowRight size={14} />
                </Link>
            </motion.div>
        </div>
    );
}
