'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, User, CheckCircle, Clock, Check, XCircle, Calendar } from 'lucide-react';
import styles from '../admin.module.css';

export default function ExamResultsPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/admin/exams/submissions');
            if (res.ok) {
                const data = await res.json();
                setSessions(data.sessions || []);
            }
        } catch (e) { console.error('Error fetching exam results:', e); }
        setLoading(false);
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const filteredSessions = sessions.filter(s => {
        const matchesFilter = filter === 'all' || s.status === filter;
        const searchL = search.toLowerCase();
        const matchesSearch =
            s.student?.name?.toLowerCase().includes(searchL) ||
            s.student?.email?.toLowerCase().includes(searchL) ||
            s.testPaper?.category?.name?.toLowerCase().includes(searchL);
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'in-progress': return <span className={`${styles.badge} ${styles.badgeInfo}`}>In Progress</span>;
            case 'submitted': return <span className={`${styles.badge} ${styles.badgeVerified}`}>Submitted</span>;
            case 'timeout': return <span className={`${styles.badge} ${styles.badgeRejected}`}>Time Expired</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    return (
        <div>
            {/* Gradient Header Banner */}
            <div className={styles.gradientBanner}>
                <div className={styles.bannerContent}>
                    <span className={styles.bannerBreadcrumb}>Admin Dashboard</span>
                    <h1>Exam Results <span className={styles.bannerCount}>{sessions.length}</span></h1>
                    <p>View all MCQ exam sessions and scores from your students.</p>
                </div>
            </div>

            <div className={styles.pageContent}>
                <div className={styles.card} style={{ padding: '12px 20px', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                        <div className={styles.filterTabs} style={{ margin: 0, border: 'none', marginBottom: 0 }}>
                            <button className={`${styles.filterTab} ${filter === 'all' ? styles.filterTabActive : ''}`} onClick={() => setFilter('all')}>All</button>
                            <button className={`${styles.filterTab} ${filter === 'in-progress' ? styles.filterTabActive : ''}`} onClick={() => setFilter('in-progress')}>In Progress</button>
                            <button className={`${styles.filterTab} ${filter === 'submitted' ? styles.filterTabActive : ''}`} onClick={() => setFilter('submitted')}>Submitted manually</button>
                            <button className={`${styles.filterTab} ${filter === 'timeout' ? styles.filterTabActive : ''}`} onClick={() => setFilter('timeout')}>Time Expired</button>
                        </div>
                        <div className={styles.searchInput} style={{ width: 300 }}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search student or skill..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.tableCard}>
                    {loading ? (
                        <div className={styles.empty}><div className={styles.spinner} style={{ margin: '0 auto' }} /><p>Loading exam results...</p></div>
                    ) : filteredSessions.length === 0 ? (
                        <div className={styles.empty}>
                            <FileText size={48} style={{ color: '#cbd5e1', marginBottom: 16 }} />
                            <h3 style={{ color: '#475569' }}>No results found</h3>
                            <p style={{ color: '#94a3b8' }}>Try adjusting your filters or wait for students to take exams.</p>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Exam Details</th>
                                    <th>Started At</th>
                                    <th>Status</th>
                                    <th>Score</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSessions.map(session => (
                                    <tr key={session._id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div className={styles.userAvatar}>
                                                    {session.student?.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className={styles.userName}>{session.student?.name || 'Unknown User'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{session.student?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 500, color: '#0f172a' }}>{session.testPaper?.category?.name || 'Unknown Skill'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'capitalize' }}>
                                                Level: {session.testPaper?.level} · Target: {session.testPaper?.config?.passingScore}%
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#475569' }}>
                                                <Calendar size={14} />
                                                {new Date(session.startTime).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(session.status)}</td>
                                        <td>
                                            {session.status !== 'in-progress' ? (
                                                <div>
                                                    <div style={{ fontWeight: 600, color: session.passed ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        {session.passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                                        {session.score !== undefined ? `${session.score}/100` : 'N/A'}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{session.passed ? 'Passed 🎉' : 'Failed'}</div>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>Taking exam...</span>
                                            )}
                                        </td>
                                        <td>
                                            {session.status !== 'in-progress' && (
                                                <button
                                                    onClick={() => window.location.href = `/dashboard/admin/exam-results/${session._id}/report`}
                                                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, color: '#334155', cursor: 'pointer' }}
                                                >
                                                    View Report
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
