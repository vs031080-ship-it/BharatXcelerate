'use client';
import { motion } from 'framer-motion';
import { Share2, Download, Award, Shield, Code, Zap, GitBranch, ExternalLink, Calendar } from 'lucide-react';
import styles from './scorecard.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const projects = [
    { id: 1, title: 'E-Commerce API', domain: 'Backend', difficulty: 'Intermediate', score: 92, date: 'Feb 10, 2026', skills: ['Node.js', 'Express', 'MongoDB'] },
    { id: 2, title: 'Portfolio Website', domain: 'Frontend', difficulty: 'Beginner', score: 98, date: 'Jan 25, 2026', skills: ['React', 'CSS', 'Framer Motion'] },
    { id: 3, title: 'Task Manager', domain: 'Full Stack', difficulty: 'Intermediate', score: 88, date: 'Jan 10, 2026', skills: ['Next.js', 'PostgreSQL', 'Prisma'] },
];

export default function ScorecardPage() {
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1>My Scorecard <span className={styles.verifiedBadge}><Shield size={14} /> Verified</span></h1>
                    <p>Your official proof-of-work report. Share this with recruiters.</p>
                </div>
                <div className={styles.actions}>
                    <button className="btn btn-outline"><Share2 size={16} /> Share</button>
                    <button className="btn btn-primary"><Download size={16} /> Download PDF</button>
                </div>
            </div>

            {/* Main Score Display */}
            <div className={styles.mainScoreSection}>
                <div className={styles.scoreCircleWrapper}>
                    <svg viewBox="0 0 36 36" className={styles.circularChart}>
                        <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={styles.circle} strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className={styles.scoreText}>
                        <span className={styles.scoreLabel}>Global Rank</span>
                        <strong>Top 5%</strong>
                        <span className={styles.totalPoints}>850 XP</span>
                    </div>
                </div>

                <div className={styles.scoreMetrics}>
                    <div className={styles.metricCard}>
                        <div className={`${styles.metricIcon} ${styles.iconBlue}`}><Code size={20} /></div>
                        <div><h4>Code Quality</h4><div className={styles.bar}><div style={{ width: '92%' }}></div></div><span>92/100</span></div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={`${styles.metricIcon} ${styles.iconPurple}`}><Zap size={20} /></div>
                        <div><h4>Execution Speed</h4><div className={styles.bar}><div style={{ width: '85%' }}></div></div><span>85/100</span></div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={`${styles.metricIcon} ${styles.iconGreen}`}><GitBranch size={20} /></div>
                        <div><h4>Complexity</h4><div className={styles.bar}><div style={{ width: '78%' }}></div></div><span>78/100</span></div>
                    </div>
                </div>
            </div>

            {/* Verified Projects List */}
            <div className={styles.projectsSection}>
                <h3>Verified Projects ({projects.length})</h3>
                <div className={styles.projectList}>
                    {projects.map((p, i) => (
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
            </div>
        </div>
    );
}
