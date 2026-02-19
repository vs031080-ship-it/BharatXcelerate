'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FolderKanban, Briefcase, Lightbulb, Clock, CheckCircle, Shield, ArrowRight, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './admin.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                    setPending(data.recentPending || []);
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, []);

    const handleVerify = async (userId) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ userId, status: 'verified' }),
            });
            if (res.ok) {
                setPending(prev => prev.filter(u => u._id !== userId));
                setStats(prev => prev ? { ...prev, pendingVerifications: prev.pendingVerifications - 1 } : prev);
            }
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className={styles.loadingScreen}><div className={styles.loadingIcon}><Shield size={40} /></div><p>Loading dashboard...</p></div>;

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#0EA5E9', bg: '#F0F9FF' },
        { label: 'Pending', value: stats?.pendingVerifications || 0, icon: Clock, color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'Projects', value: stats?.totalProjects || 0, icon: FolderKanban, color: '#8B5CF6', bg: '#F5F3FF' },
        { label: 'Jobs', value: stats?.totalJobs || 0, icon: Briefcase, color: '#0D9488', bg: '#F0FDFA' },
    ];

    return (
        <div>
            {/* Gradient Header Banner — Upstream style */}
            <div className={styles.gradientBanner}>
                <div className={styles.bannerContent}>
                    <span className={styles.bannerBreadcrumb}>Admin · Overview</span>
                    <h1>Dashboard</h1>
                    <p>Overview of platform activity and pending actions.</p>
                </div>
            </div>

            <div className={styles.pageContent}>
                {/* Stat Cards — Upstream compact icon-left */}
                <div className={styles.statsGrid}>
                    {statCards.map((stat, i) => (
                        <motion.div key={stat.label} className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                            <div className={styles.statIcon} style={{ background: stat.bg, color: stat.color }}><stat.icon size={20} /></div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                            <TrendingUp size={14} className={styles.statTrend} />
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions Row — Notalx style */}
                <motion.div className={styles.quickActions} initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                    <Link href="/admin/projects" className={styles.quickActionCard}>
                        <FolderKanban size={20} />
                        <span>Manage Projects</span>
                        <ArrowRight size={14} />
                    </Link>
                    <Link href="/admin/users" className={styles.quickActionCard}>
                        <Users size={20} />
                        <span>Manage Users</span>
                        <ArrowRight size={14} />
                    </Link>
                    <Link href="/admin/submissions" className={styles.quickActionCard}>
                        <Star size={20} />
                        <span>Submissions</span>
                        <ArrowRight size={14} />
                    </Link>
                </motion.div>

                {/* Pending Verifications — Upstream Reports table */}
                <motion.div className={styles.tableCard} initial="hidden" animate="visible" variants={fadeUp} custom={5}>
                    <div className={styles.tableHeader}>
                        <h3>Pending Verifications <span className={styles.countBadge}>{pending.length}</span></h3>
                        <Link href="/admin/users" className={styles.btnGhost}>View All <ArrowRight size={14} /></Link>
                    </div>
                    {pending.length === 0 ? (
                        <div className={styles.empty}><CheckCircle size={32} /><h3>All clear</h3><p>No pending verifications at this time.</p></div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Registered</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pending.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div className={styles.userAvatar}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                                                <span className={styles.userName}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td className={styles.textSecondary}>{user.email}</td>
                                        <td><span className={`${styles.badge} ${user.role === 'company' ? styles.badgeCompany : user.role === 'investor' ? styles.badgeInvestor : styles.badgeStudent}`}>{user.role}</span></td>
                                        <td className={styles.textSecondary}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className={styles.btnGroup}>
                                                <button className={styles.btnSuccess} onClick={() => handleVerify(user._id)}>
                                                    <CheckCircle size={14} /> Verify
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
