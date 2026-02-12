'use client';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, TrendingUp, Award, ArrowRight, Play, Star } from 'lucide-react';
import Link from 'next/link';
import styles from './student.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const stats = [
    { label: 'Projects Completed', value: '3', icon: CheckCircle, color: 'Green' },
    { label: 'Skills Verified', value: '8', icon: Award, color: 'Purple' },
    { label: 'Scorecard Rating', value: '850', icon: Star, color: 'Yellow' },
    { label: 'Profile Views', value: '142', icon: TrendingUp, color: 'Blue' },
];

const inProgress = [
    { id: 1, title: 'E-Commerce Platform', difficulty: 'Beginner', progress: 65, daysLeft: 4, image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=100&h=100&fit=crop' },
];

const recommended = [
    { id: 2, title: 'AI Resume Screener', domain: 'AI/ML', difficulty: 'Intermediate', points: 200 },
    { id: 3, title: 'DeFi Lending App', domain: 'Blockchain', difficulty: 'Advanced', points: 350 },
];

export default function StudentDashboard() {
    return (
        <div className={styles.container}>
            {/* Welcome Banner */}
            <motion.div className={styles.welcomeBanner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1>Welcome back, Arjun! 👋</h1>
                    <p>You&apos;re 2 projects away from reaching <strong>Gold Tier</strong>. Keep building!</p>
                </div>
                <Link href="/projects" className="btn btn-white">Explore Projects <ArrowRight size={16} /></Link>
            </motion.div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((stat, i) => (
                    <motion.div key={stat.label} className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <h3 className={styles.statValue}>{stat.value}</h3>
                        </div>
                        <div className={`${styles.statIcon} ${styles[`icon${stat.color}`]}`}><stat.icon size={24} /></div>
                    </motion.div>
                ))}
            </div>

            <div className={styles.dashboardGrid}>
                {/* Main Column */}
                <div className={styles.mainCol}>
                    {/* Active Projects */}
                    <motion.div className={styles.section} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                        <div className={styles.sectionHeader}>
                            <h3>Active Projects</h3>
                            <Link href="/dashboard/student/projects" className={styles.link}>View All</Link>
                        </div>
                        {inProgress.map((p) => (
                            <div key={p.id} className={styles.activeProjectCard}>
                                <img src={p.image} alt={p.title} className={styles.projectImg} />
                                <div className={styles.projectContent}>
                                    <div className={styles.projectHeader}>
                                        <h4>{p.title}</h4>
                                        <span className={styles.difficulty}>{p.difficulty}</span>
                                    </div>
                                    <div className={styles.progressBar}><div style={{ width: `${p.progress}%` }}></div></div>
                                    <div className={styles.projectFooter}>
                                        <span>{p.progress}% Complete</span>
                                        <span className={styles.daysLeft}><Clock size={14} /> {p.daysLeft} days left</span>
                                    </div>
                                </div>
                                <button className={styles.resumeBtn}><Play size={18} /></button>
                            </div>
                        ))}
                    </motion.div>

                    {/* Recommended */}
                    <motion.div className={styles.section} initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                        <div className={styles.sectionHeader}>
                            <h3>Recommended for You</h3>
                        </div>
                        <div className={styles.recGrid}>
                            {recommended.map((p) => (
                                <div key={p.id} className={styles.recCard}>
                                    <div className={styles.recInfo}>
                                        <h4>{p.title}</h4>
                                        <span>{p.domain} • {p.difficulty}</span>
                                    </div>
                                    <div className={styles.pointsBadge}>+{p.points} XP</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Column */}
                <div className={styles.sideCol}>
                    <motion.div className={styles.scorecardWidget} initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                        <h3>My Scorecard</h3>
                        <div className={styles.scoreCircle}>
                            <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className={styles.circle} strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className={styles.scoreText}>
                                <strong>850</strong>
                                <span>/1000</span>
                            </div>
                        </div>
                        <div className={styles.scoreDetails}>
                            <div className={styles.scoreRow}><span>Execution</span><div className={styles.bar}><div style={{ width: '90%' }}></div></div></div>
                            <div className={styles.scoreRow}><span>Code Quality</span><div className={styles.bar}><div style={{ width: '80%' }}></div></div></div>
                            <div className={styles.scoreRow}><span>Speed</span><div className={styles.bar}><div style={{ width: '85%' }}></div></div></div>
                        </div>
                        <Link href="/dashboard/student/scorecard" className="btn btn-outline" style={{ width: '100%' }}>View Full Report</Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
