'use client';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, TrendingUp, Award, ArrowRight, Play, Star, ArrowUpRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import styles from './student.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };

const stats = [
    { label: 'Projects Completed', value: '3', change: '+1 this month', trend: 'up', icon: CheckCircle },
    { label: 'Skills Verified', value: '8', change: '+2 this month', trend: 'up', icon: Award },
    { label: 'Scorecard Rating', value: '850', change: '/1000', trend: 'neutral', icon: Star },
    { label: 'Profile Views', value: '142', change: '+23% vs last week', trend: 'up', icon: TrendingUp },
];

const inProgress = [
    { id: 1, title: 'E-Commerce Platform', difficulty: 'Beginner', progress: 65, daysLeft: 4, domain: 'Full Stack' },
];

const recommended = [
    { id: 2, title: 'AI Resume Screener', domain: 'AI/ML', difficulty: 'Intermediate', points: 200 },
    { id: 3, title: 'DeFi Lending App', domain: 'Blockchain', difficulty: 'Advanced', points: 350 },
];

export default function StudentDashboard() {
    return (
        <div className={styles.container}>
            {/* Page Header */}
            <motion.div className={styles.pageHeader} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1>Welcome back, Arjun</h1>
                    <p>You&apos;re 2 projects away from reaching <strong>Gold Tier</strong>. Keep building!</p>
                </div>
                <Link href="/dashboard/student/explore" className={styles.headerAction}>
                    Explore Projects <ArrowRight size={16} />
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((stat, i) => (
                    <motion.div key={stat.label} className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                        <div className={styles.statTop}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <div className={styles.statIconWrap}><stat.icon size={18} /></div>
                        </div>
                        <h3 className={styles.statValue}>{stat.value}</h3>
                        <span className={`${styles.statChange} ${stat.trend === 'up' ? styles.trendUp : ''}`}>
                            {stat.trend === 'up' && <ArrowUpRight size={12} />}
                            {stat.change}
                        </span>
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
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Difficulty</th>
                                        <th>Progress</th>
                                        <th>Deadline</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inProgress.map((p) => (
                                        <tr key={p.id}>
                                            <td>
                                                <div className={styles.projectNameCell}>
                                                    <strong>{p.title}</strong>
                                                    <span>{p.domain}</span>
                                                </div>
                                            </td>
                                            <td><span className={styles.difficultyBadge}>{p.difficulty}</span></td>
                                            <td>
                                                <div className={styles.progressCell}>
                                                    <div className={styles.progressBar}><div style={{ width: `${p.progress}%` }}></div></div>
                                                    <span>{p.progress}%</span>
                                                </div>
                                            </td>
                                            <td><span className={styles.daysLeft}><Clock size={13} /> {p.daysLeft} days</span></td>
                                            <td><button className={styles.resumeBtn}><Play size={14} /> Resume</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                                        <span>{p.domain} · {p.difficulty}</span>
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
                        <Link href="/dashboard/student/scorecard" className={styles.widgetAction}>View Full Report <ArrowRight size={14} /></Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
