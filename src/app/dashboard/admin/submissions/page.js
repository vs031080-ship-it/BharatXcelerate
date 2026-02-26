'use client';
import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from '../admin.module.css';
import Link from 'next/link';
import { Search, Eye, CheckCircle, XCircle, Github, FileText, Calendar, User, ExternalLink, Send, Clock } from 'lucide-react';

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [grade, setGrade] = useState('');
    const [score, setScore] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/admin/submissions', { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error('Failed to fetch submissions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!confirm(`Are you sure you want to mark this submission as ${status}?`)) return;
        setActionLoading(true);
        try {
            const body = { id, status };
            if (status === 'completed') {
                body.grade = grade;
                body.totalScore = score;
            }

            const res = await fetch('/api/admin/submissions', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });
            if (res.ok) {
                const data = await res.json();
                setSubmissions(prev => prev.map(s => s._id === id ? data.submission : s));
                setSelectedSubmission(data.submission);
            }
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            setActionLoading(false);
        }
    };

    // Reset grading fields when modal opens
    useEffect(() => {
        if (selectedSubmission) {
            setGrade(selectedSubmission.grade || '');
            setScore(selectedSubmission.totalScore || '');
        }
    }, [selectedSubmission]);

    const filteredSubmissions = submissions.filter(s => {
        const matchesFilter = filter === 'all' || s.status === filter;
        const matchesSearch = s.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.project?.title?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'started': return <span className={`${styles.badge} ${styles.badgeInfo}`}>In Progress</span>;
            case 'submitted': return <span className={`${styles.badge} ${styles.badgePending}`}>Pending Review</span>;
            case 'completed': return <span className={`${styles.badge} ${styles.badgeVerified}`}>Completed</span>;
            case 'rejected': return <span className={`${styles.badge} ${styles.badgeRejected}`}>Rejected</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    const counts = {
        all: submissions.length,
        started: submissions.filter(s => s.status === 'started').length,
        submitted: submissions.filter(s => s.status === 'submitted').length,
        completed: submissions.filter(s => s.status === 'completed').length,
        rejected: submissions.filter(s => s.status === 'rejected').length,
    };

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.loadingIcon}><FileText size={40} /></div>
                <p>Loading submissions...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Gradient Header Banner */}
            <div className={styles.gradientBanner}>
                <div className={styles.bannerContent}>
                    <span className={styles.bannerBreadcrumb}>Admin Dashboard</span>
                    <h1>Submissions Review <span className={styles.bannerCount}>{submissions.length}</span></h1>
                    <p>Review, grade, and provide feedback on student project submissions.</p>
                </div>
            </div>

            <div className={styles.pageContent}>
                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#F0FDFA', color: '#0D9488' }}><Send size={20} /></div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Pending Review</span>
                            <span className={styles.statValue}>{counts.submitted}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#2563EB' }}><CheckCircle size={20} /></div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Completed</span>
                            <span className={styles.statValue}>{counts.completed}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#FFF7ED', color: '#EA580C' }}><Clock size={20} /></div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>In Progress</span>
                            <span className={styles.statValue}>{counts.started}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}><XCircle size={20} /></div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Rejected</span>
                            <span className={styles.statValue}>{counts.rejected}</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className={styles.card} style={{ padding: '12px 20px', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                        <div className={styles.filterTabs} style={{ margin: 0, border: 'none' }}>
                            {[
                                { key: 'all', label: 'All', count: counts.all },
                                { key: 'submitted', label: 'Pending', count: counts.submitted },
                                { key: 'started', label: 'Started', count: counts.started },
                                { key: 'completed', label: 'Done', count: counts.completed },
                                { key: 'rejected', label: 'Rejected', count: counts.rejected },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    className={`${styles.filterTab} ${filter === tab.key ? styles.filterTabActive : ''}`}
                                    onClick={() => setFilter(tab.key)}
                                >
                                    {tab.label}
                                    <span className={styles.tabCount}>{tab.count}</span>
                                </button>
                            ))}
                        </div>

                        <div className={styles.searchInput} style={{ width: 300 }}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search student or project..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Project & Progress</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th>Performance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubmissions.length > 0 ? filteredSubmissions.map(submission => {
                                const totalSteps = submission.project?.steps?.length || 0;
                                const completedSteps = submission.completedSteps?.length || 0;
                                const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

                                return (
                                    <tr key={submission._id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div className={styles.userAvatar}>
                                                    {submission.student?.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className={styles.userName}>{submission.student?.name || 'Unknown'}</div>
                                                    <div className={styles.textSecondary} style={{ fontSize: '0.75rem' }}>{submission.student?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 500, color: '#0F172A', marginBottom: 6 }}>{submission.project?.title || 'Unknown Project'}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, maxWidth: 120 }}>
                                                    <div style={{ height: '100%', background: '#0D9488', borderRadius: 3, width: `${progress}%` }} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>{progress}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: '0.8125rem' }}>
                                                <Calendar size={14} />
                                                {new Date(submission.updatedAt || submission.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(submission.status)}</td>
                                        <td>
                                            {submission.status === 'completed' ? (
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{submission.grade}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#059669' }}>Score: {submission.totalScore}</div>
                                                </div>
                                            ) : (
                                                <span className={styles.textSecondary} style={{ fontSize: '0.75rem' }}>Pending Grading</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.btnGroup}>
                                                <Link href={`/dashboard/admin/submissions/${submission._id}`} className={styles.btnOutline} title="View Details">
                                                    <Eye size={16} /> Review
                                                </Link>
                                                {submission.status === 'submitted' && (
                                                    <Link href={`/dashboard/admin/submissions/${submission._id}`} className={styles.btnSuccess} style={{ padding: '6px 8px' }}>
                                                        <CheckCircle size={16} />
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className={styles.empty}>
                                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                            <FileText size={48} style={{ color: '#CBD5E1', marginBottom: 16 }} />
                                            <h3 style={{ color: '#475569', marginBottom: 8 }}>No submissions found</h3>
                                            <p style={{ color: '#94A3B8' }}>Try adjusting your filters or wait for students to submit.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedSubmission && (
                <div className={styles.modalOverlay} onClick={() => setSelectedSubmission(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Submission Details</h2>
                            <button className={styles.closeBtn} onClick={() => setSelectedSubmission(null)}>&#x2715;</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Student</label>
                                    <div className={styles.input} style={{ background: '#F8FAFC' }}>{selectedSubmission.student?.name} ({selectedSubmission.student?.email})</div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Project</label>
                                    <div className={styles.input} style={{ background: '#F8FAFC' }}>{selectedSubmission.project?.title}</div>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>GitHub Repository</label>
                                <a href={selectedSubmission.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.input} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0EA5E9', textDecoration: 'none', background: '#F8FAFC' }}>
                                    <Github size={16} /> {selectedSubmission.githubUrl} <ExternalLink size={14} />
                                </a>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description / Approach</label>
                                <div className={styles.textarea} style={{ background: '#F8FAFC', minHeight: 120, whiteSpace: 'pre-wrap' }}>
                                    {selectedSubmission.description}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <div>{getStatusBadge(selectedSubmission.status)}</div>
                            </div>

                            {selectedSubmission.status === 'submitted' && (
                                <div className={styles.gradingSection} style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #E2E8F0' }}>
                                    <h3>Grading</h3>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>Grade <span className={styles.req}>*</span></label>
                                            <input
                                                type="text"
                                                placeholder="e.g. A, B+, 9/10"
                                                value={grade}
                                                onChange={(e) => setGrade(e.target.value)}
                                                className={styles.input}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Total Score <span className={styles.req}>*</span></label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 85"
                                                value={score}
                                                onChange={(e) => setScore(e.target.value)}
                                                className={styles.input}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.formActions}>
                            {selectedSubmission.status === 'submitted' && (
                                <>
                                    <button
                                        className={styles.btnSuccess}
                                        onClick={() => { handleStatusUpdate(selectedSubmission._id, 'completed'); setSelectedSubmission(null); }}
                                        disabled={!grade || !score}
                                        title={(!grade || !score) ? "Grade and Score are required" : "Approve Project"}
                                    >
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                    <button className={styles.btnDanger} onClick={() => { handleStatusUpdate(selectedSubmission._id, 'rejected'); setSelectedSubmission(null); }}>
                                        <XCircle size={16} /> Reject
                                    </button>
                                </>
                            )}
                            <button className={styles.btnOutline} onClick={() => setSelectedSubmission(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
