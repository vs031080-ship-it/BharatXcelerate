'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Award, Shield, CheckCircle, Calendar, Star, Zap, Rocket, User } from 'lucide-react';
import styles from './scorecard.module.css';
import { getAuthHeaders } from '@/context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

// Icon map for dynamic badges
const IconMap = {
    'Rocket': Rocket,
    'Zap': Zap,
    'Star': Star,
    'User': User,
    'Shield': Shield
};

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

    if (loading) return (
        <div className={styles.loading}>
            <div className={styles.spinner}><Zap size={24} /></div>
            <span>Loading Scorecard...</span>
        </div>
    );

    if (!data) return <div className={styles.error}>Failed to load scorecard</div>;

    const { user, stats, badges, recentProjects } = data;
    const levelParams = {
        current: stats?.xp || 0,
        next: (Math.floor((stats?.xp || 0) / 500) + 1) * 500
    };
    const progressPercent = Math.min((levelParams.current / levelParams.next) * 100, 100);

    return (
        <div className={styles.container}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                        <CheckCircle size={16} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.headerInfo}>
                    <h1>
                        {user?.name || 'Student'}'s Scorecard
                        <span className={styles.verifiedBadge}><Shield size={14} /> Verified</span>
                    </h1>
                    <p>Official proof-of-work report • {user?.email}</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.btnOutline} onClick={handleShare}>
                        <Share2 size={16} /> Share
                    </button>
                    <button className={styles.btnPrimary} onClick={handleDownload}>
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </motion.div>

            {/* Main Score Grid */}
            <div className={styles.mainScoreSection}>
                {/* Radial Score */}
                <motion.div
                    className={styles.scoreCard}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className={styles.circularWrapper}>
                        <svg viewBox="0 0 36 36" className={styles.circularChart}>
                            <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path
                                className={styles.circle}
                                strokeDasharray={`${progressPercent}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className={styles.scoreContent}>
                            <span className={styles.scoreValue}>{stats.xp}</span>
                            <span className={styles.scoreLabel}>Total XP</span>
                        </div>
                    </div>
                    <span className={styles.levelBadge}>Level {stats.level} Developer</span>
                </motion.div>

                {/* Metrics & Badges */}
                <div className={styles.metricsGrid}>
                    <div className={styles.statsRow}>
                        <motion.div className={styles.statItem} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <div className={`${styles.statIcon} ${styles.iconBlue}`}><CheckCircle size={24} /></div>
                            <div className={styles.statInfo}>
                                <h4>Projects Completed</h4>
                                <strong>{stats.completedProjects}</strong>
                            </div>
                        </motion.div>
                        <motion.div className={styles.statItem} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <div className={`${styles.statIcon} ${styles.iconPurple}`}><Award size={24} /></div>
                            <div className={styles.statInfo}>
                                <h4>Badges Earned</h4>
                                <strong>{badges.length}</strong>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div className={styles.badgesCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <h3>Top Achievements</h3>
                        <div className={styles.badgesContainer}>
                            {badges.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Complete projects to earn badges!</p>
                            ) : (
                                badges.map(badge => {
                                    const Icon = IconMap[badge.icon] || Award;
                                    return (
                                        <div key={badge.id} className={styles.badgeItem} title={badge.description}>
                                            <div className={styles.badgeIcon}><Icon size={20} /></div>
                                            <span className={styles.badgeName}>{badge.name}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Verified Projects List */}
            <div className={styles.projectsSection}>
                <div className={styles.sectionTitle}>
                    <h3>Verified Projects</h3>
                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '400' }}>Showing {recentProjects.length} completed</span>
                </div>

                {recentProjects.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div style={{ background: '#f1f5f9', padding: '24px', borderRadius: '50%', marginBottom: '16px' }}><Rocket size={32} color="#94a3b8" /></div>
                        <p>No verified projects yet</p>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Start a project to build your proof-of-work.</span>
                    </div>
                ) : (
                    <div className={styles.projectList}>
                        {recentProjects.map((p, i) => (
                            <motion.div
                                key={p.id}
                                className={styles.projectCard}
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                                custom={i}
                            >
                                <div className={styles.projectIcon}>
                                    {p.domain === 'Web Dev' ? <Code size={24} /> : <Zap size={24} />}
                                </div>
                                <div className={styles.projectInfo}>
                                    <h4>{p.title}</h4>
                                    <div className={styles.projectMeta}>
                                        <span>{p.domain}</span>
                                        <span className={styles.dot}></span>
                                        <span>{p.difficulty}</span>
                                        <span className={styles.dot}></span>
                                        <span className={styles.date}><Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {p.date}</span>
                                    </div>
                                    {p.skills && p.skills.length > 0 && (
                                        <div className={styles.projectSkills}>
                                            {p.skills.slice(0, 4).map(s => <span key={s} className={styles.skillTag}>{s}</span>)}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.projectScore}>
                                    <span className={styles.scoreNum}>{p.score}</span>
                                    <span className={styles.scoreCaption}>Score</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
