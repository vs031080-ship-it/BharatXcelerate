'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Award, Shield, Code, Zap, GitBranch, ExternalLink, Calendar, CheckCircle, Loader } from 'lucide-react';
import styles from './scorecard.module.css';
import { getAuthHeaders } from '@/context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

export default function ScorecardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/student/scorecard', { headers: getAuthHeaders() });
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setToast('Link copied to clipboard!');
        setTimeout(() => setToast(''), 3000);
    };

    const handleDownload = () => {
        window.print();
    };

    if (loading) return <div className={styles.loading}><Loader className={styles.spinner} /> Loading Scorecard...</div>;
    if (!data) return <div className={styles.error}>Failed to load scorecard</div>;

    const { user, stats, badges, recentProjects } = data;

    return (
        <div className={styles.container}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <CheckCircle size={18} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1>{user?.name || 'Student'}'s Scorecard <span className={styles.verifiedBadge}><Shield size={14} /> Verified</span></h1>
                    <p>Official proof-of-work report. Level {stats.level} Developer.</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.btnOutline} onClick={handleShare}><Share2 size={16} /> Share</button>
                    <button className={styles.btnPrimary} onClick={handleDownload}><Download size={16} /> Download PDF</button>
                </div>
            </div>

            {/* Main Score Display */}
            <div className={styles.mainScoreSection}>
                <div className={styles.scoreCircleWrapper}>
                    <svg viewBox="0 0 36 36" className={styles.circularChart}>
                        <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path
                            className={styles.circle}
                            strokeDasharray={`${Math.min(stats.xp / 20, 100)}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <div className={styles.scoreText}>
                        <span className={styles.scoreLabel}>Total XP</span>
                        <strong>{stats.xp}</strong>
                        <span className={styles.totalPoints}>Level {stats.level}</span>
                    </div>
                </div>

                <div className={styles.scoreMetrics}>
                    <div className={styles.metricCard}>
                        <div className={`${styles.metricIcon} ${styles.iconBlue}`}><CheckCircle size={20} /></div>
                        <div>
                            <h4>Projects Completed</h4>
                            <div className={styles.metricValue}>{stats.completedProjects}</div>
                        </div>
                    </div>
                    {/* Badges Preview */}
                    <div className={styles.badgesRow}>
                        {badges.map(badge => (
                            <div key={badge.id} className={styles.badgeItem} title={badge.description}>
                                <Award size={20} />
                                <span>{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Verified Projects List */}
            <div className={styles.projectsSection}>
                <h3>Verified Projects ({recentProjects.length})</h3>
                {recentProjects.length === 0 ? (
                    <p className={styles.emptyState}>No projects completed yet. Start working on projects to build your scorecard!</p>
                ) : (
                    <div className={styles.projectList}>
                        {recentProjects.map((p, i) => (
                            <motion.div key={p.id} className={styles.projectRow} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                                <div className={styles.projectInfo}>
                                    <h4>{p.title}</h4>
                                    <div className={styles.projectMeta}>
                                        <span>{p.domain}</span>
                                        <span className={styles.dot}>•</span>
                                        <span>{p.difficulty}</span>
                                        <span className={styles.dot}>•</span>
                                        <span className={styles.date}><Calendar size={12} /> {p.date}</span>
                                    </div>
                                </div>
                                <div className={styles.projectSkills}>
                                    {p.skills.map(s => <span key={s}>{s}</span>)}
                                </div>
                                <div className={styles.projectScore}>
                                    <strong>{p.score}</strong>
                                    <span>/100</span>
                                </div>
                                <button className={styles.viewBtn}><ExternalLink size={16} /></button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
