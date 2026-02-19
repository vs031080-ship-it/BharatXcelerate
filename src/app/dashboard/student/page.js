'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Target, Zap, ArrowRight, BookOpen, Trophy, TrendingUp, Star, ChevronRight, MoreHorizontal, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';
import styles from './student.module.css';

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const firstName = user?.name?.split(' ')[0] || 'Student';
    const [activeProjects, setActiveProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/student/projects/active', { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    setActiveProjects(data.projects || []);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Stats
    const totalXP = user?.xp || 0;
    const avgScore = user?.avgScore || 0;

    // Calculate Overall Progress
    const totalProgress = activeProjects.reduce((acc, curr) => acc + (curr.progress || 0), 0);
    const overallProgress = activeProjects.length > 0 ? Math.round(totalProgress / activeProjects.length) : 0;

    // Domain Stats (Mock calculation based on active projects)
    const domainStats = {
        'Web Dev': 75,
        'Data Science': 40,
        'AI/ML': 20,
        'Blockchain': 10
    };

    return (
        <div className={styles.container}>
            {/* Welcome Banner */}
            <motion.div
                className={styles.banner}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className={styles.bannerLeft}>
                    <span className={styles.bannerBreadcrumb}>
                        {mounted ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Welcome'}
                    </span>
                    <h1>Welcome, {firstName}!</h1>
                    <p>You have {activeProjects.filter(p => p.progress < 100).length} pending projects this week. Keep up the momentum!</p>
                </div>
                <div className={styles.bannerRight}>
                    <div className={styles.radialContainer}>
                        <div className={styles.radialInner}>
                            <span className={styles.radialValue}>{totalXP}</span>
                            <span className={styles.radialLabel}>Total XP</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Middle Section: Progress + Calendar */}
            <div className={styles.middleSection}>
                {/* Progress Card */}
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>My Progress</h3>
                        <button className={styles.cardAction}>View Reports</button>
                    </div>

                    <div className={styles.progressContainer}>
                        <div className={styles.circularChart} style={{ background: `conic-gradient(#06b6d4 0%, #06b6d4 ${overallProgress}%, #f1f5f9 ${overallProgress}%, #f1f5f9 100%)` }}>
                            <div className={styles.circularInner}>
                                <span className={styles.circularValue}>{overallProgress}%</span>
                                <span className={styles.circularLabel}>Overall</span>
                            </div>
                        </div>

                        <div className={styles.domainStats}>
                            {Object.entries(domainStats).map(([label, value]) => (
                                <div key={label} className={styles.statRow}>
                                    <span className={styles.statLabel}>{label}</span>
                                    <div className={styles.statBarBg}>
                                        <div className={styles.statBarFill} style={{ width: `${value}%`, background: value > 60 ? '#0ea5e9' : '#94a3b8' }} />
                                    </div>
                                    <span className={styles.statPercent}>{value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Calendar Card */}
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>My Calendar</h3>
                        <button className={styles.cardAction}>+ Add</button>
                    </div>

                    <div className={styles.calendarWidget}>
                        <div className={styles.calendarGrid}>
                            <div className={styles.dayLabel}>Mon</div>
                            <div className={styles.dayLabel}>Tue</div>
                            <div className={styles.dayLabel}>Wed</div>
                            <div className={styles.dayLabel}>Thu</div>
                            <div className={styles.dayLabel}>Fri</div>
                            <div className={styles.dayLabel}>Sat</div>
                            <div className={styles.dayLabel}>Sun</div>

                            {/* Mock Days */}
                            <div className={styles.dayCell}>28</div>
                            <div className={styles.dayCell}>29</div>
                            <div className={styles.dayCell}>30</div>
                            <div className={styles.dayCell}>1</div>
                            <div className={styles.dayCell}>2</div>
                            <div className={styles.dayCell}>3</div>
                            <div className={styles.dayCell}>4</div>
                            <div className={styles.dayCell}>5</div>
                            <div className={`${styles.dayCell} ${styles.dayActive}`}>6</div>
                            <div className={styles.dayCell}>7</div>
                            <div className={`${styles.dayCell} ${styles.dayPending}`}>8</div>
                            <div className={styles.dayCell}>9</div>
                            <div className={styles.dayCell}>10</div>
                            <div className={styles.dayCell}>11</div>
                        </div>
                        <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} color="#f97316" />
                            <strong>Upcoming:</strong>
                            <span style={{ color: '#64748b' }}>Project Submission (Feb 8)</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Section: Pending Worksheets (Active Projects) */}
            <div className={styles.bottomSection}>
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Pending Projects</h3>
                        <Link href="/dashboard/student/projects" className={styles.btnViewAll}>View All</Link>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Project Title</th>
                                    <th>Domain</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>Loading projects...</td></tr>
                                ) : activeProjects.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>No active projects. Start exploring!</td></tr>
                                ) : (
                                    activeProjects.slice(0, 3).map(project => (
                                        <tr key={project.id}>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className={styles.projectTitle}>{project.title}</span>
                                                    <span className={styles.projectSub}>{project.difficulty} • {project.points} XP</span>
                                                </div>
                                            </td>
                                            <td style={{ color: '#64748b', fontSize: '0.875rem' }}>{project.domain}</td>
                                            <td><span className={styles.statusBadge}>In Progress</span></td>
                                            <td>
                                                <Link href={`/dashboard/student/projects/${project.id}`} className={styles.btnStart}>
                                                    Continue
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Recent Submissions / Recommended */}
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Recommended for you</h3>
                        <Link href="/dashboard/student/explore" className={styles.btnViewAll}>Explore</Link>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Project Title</th>
                                    <th>Domain</th>
                                    <th>XP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mock Recommendations */}
                                <tr>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className={styles.projectTitle}>AI Chatbot Assistant</span>
                                            <span className={styles.projectSub}>Intermediate</span>
                                        </div>
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>AI/ML</td>
                                    <td style={{ fontWeight: '600', color: '#0f172a' }}>+500 XP</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className={styles.projectTitle}>E-Commerce API</span>
                                            <span className={styles.projectSub}>Advanced</span>
                                        </div>
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>Backend</td>
                                    <td style={{ fontWeight: '600', color: '#0f172a' }}>+800 XP</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className={styles.projectTitle}>Portfolio Website</span>
                                            <span className={styles.projectSub}>Beginner</span>
                                        </div>
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>Frontend</td>
                                    <td style={{ fontWeight: '600', color: '#0f172a' }}>+300 XP</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
