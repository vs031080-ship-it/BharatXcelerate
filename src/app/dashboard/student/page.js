'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FolderKanban, Target, Zap, ArrowRight, BookOpen, Trophy, TrendingUp, Star, ChevronRight, ChevronLeft, MoreHorizontal, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';
import styles from './student.module.css';

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const firstName = user?.name?.split(' ')[0] || 'Student';
    const [activeProjects, setActiveProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

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

    // Calculate Dynamic Domain Stats
    const domainMap = {};
    activeProjects.forEach(p => {
        if (!domainMap[p.domain]) {
            domainMap[p.domain] = { totalProgress: 0, count: 0 };
        }
        domainMap[p.domain].totalProgress += (p.progress || 0);
        domainMap[p.domain].count += 1;
    });

    const domainStats = Object.keys(domainMap).reduce((acc, domain) => {
        acc[domain] = Math.round(domainMap[domain].totalProgress / domainMap[domain].count);
        return acc;
    }, {});

    // If no projects, show default empty state or nothing
    if (Object.keys(domainStats).length === 0) {
        // Optional: Default/Empty state if needed, or leave empty to show nothing
    }

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
                        <Link href="/dashboard/student/scorecard" className={styles.cardAction}>View Reports</Link>
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
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className={styles.navBtn} onClick={prevMonth}><ChevronLeft size={16} /></button>
                            <button className={styles.navBtn} onClick={nextMonth}><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div className={styles.calendarWidget}>
                        <div className={styles.calendarHeader} style={{ justifyContent: 'center', marginBottom: '12px' }}>
                            <span style={{ fontWeight: 600 }}>
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <div className={styles.calendarGrid}>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <div key={i} className={styles.dayLabel}>{d}</div>
                            ))}

                            {(() => {
                                const year = currentDate.getFullYear();
                                const month = currentDate.getMonth();
                                const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
                                const daysInMonth = new Date(year, month + 1, 0).getDate();

                                // Adjust for Monday start (Mon=0, Sun=6)
                                const startOffset = firstDay === 0 ? 6 : firstDay - 1;

                                const days = [];
                                for (let i = 0; i < startOffset; i++) {
                                    days.push(<div key={`empty-${i}`} className={styles.dayCell}></div>);
                                }

                                for (let d = 1; d <= daysInMonth; d++) {
                                    const dateObj = new Date(year, month, d);
                                    const isToday = new Date().toDateString() === dateObj.toDateString();

                                    // Check projects
                                    const relevantProject = activeProjects.find(p => {
                                        if (!p.deadline) return false;
                                        const dd = new Date(p.deadline);
                                        return dd.getDate() === d && dd.getMonth() === month && dd.getFullYear() === year;
                                    });

                                    // Determine dot color based on displayStatus
                                    let dotClass = '';
                                    if (relevantProject) {
                                        const status = relevantProject.displayStatus;
                                        if (status === 'accepted') {
                                            dotClass = styles.dotGreen;
                                        } else if (status === 'pending') {
                                            dotClass = styles.dotYellow;
                                        } else {
                                            dotClass = styles.dotRed; // active, upcoming, or rejected
                                        }
                                    }

                                    days.push(
                                        <div
                                            key={d}
                                            className={`${styles.dayCell} ${isToday ? styles.dayActive : ''}`}
                                            onClick={() => {
                                                if (relevantProject) router.push(`/dashboard/student/projects/${relevantProject.id}`);
                                            }}
                                            style={relevantProject ? { cursor: 'pointer', background: isToday ? '' : '#f8fafc' } : {}}
                                            title={relevantProject ? `${relevantProject.title} (${relevantProject.status})` : ''}
                                        >
                                            {d}
                                            {dotClass && <div className={dotClass}></div>}
                                        </div>
                                    );
                                }
                                return days;
                            })()}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#64748b', marginTop: '12px', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}></div> Upcoming/Rejected
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308' }}></div> Pending
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></div> Accepted
                            </div>
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
        </div >
    );
}
