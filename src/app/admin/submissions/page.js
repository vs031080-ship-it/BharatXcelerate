'use client';
import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from '../admin.module.css';
import Link from 'next/link';
import { Search, Eye, CheckCircle, XCircle, Github, FileText, Calendar, User, ExternalLink } from 'lucide-react';

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
                <h1>Submissions <span className={styles.bannerCount}>{submissions.length}</span></h1>
                <p>Review and grade project submissions from students.</p>
            </div>

            <div className={styles.pageContent}>
                {/* Filter Tabs */}
                <div className={styles.filterTabs}>
                    {[
                        { key: 'all', label: 'All Submissions', count: counts.all },
                        { key: 'started', label: 'In Progress', count: counts.started },
                        { key: 'submitted', label: 'Pending Review', count: counts.submitted },
                        { key: 'completed', label: 'Completed', count: counts.completed },
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

                {/* Search */}
                <div className={styles.filterBar}>
                    <div className={styles.searchInput}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search student or project..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Project</th>
                                <th>Submitted</th>
                                <th>Status</th>
                                <th>GitHub</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubmissions.length > 0 ? filteredSubmissions.map(submission => (
                                <tr key={submission._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D9488', fontWeight: 600, fontSize: '0.8125rem', flexShrink: 0 }}>
                                                {submission.student?.name?.charAt(0)?.toUpperCase() || <User size={16} />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500, color: '#0F172A' }}>{submission.student?.name || 'Unknown'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{submission.student?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 500, color: '#0F172A' }}>{submission.project?.title || 'Unknown Project'}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: '0.8125rem' }}>
                                            <Calendar size={14} />
                                            {new Date(submission.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>{getStatusBadge(submission.status)}</td>
                                    <td>
                                        <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.btnGhost} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                            <Github size={16} /> Repo <ExternalLink size={12} />
                                        </a>
                                    </td>
                                    <td>
                                        <div className={styles.btnGroup}>
                                            <Link href={`/admin/submissions/${submission._id}`} className={styles.btnOutline} title="View Details">
                                                <Eye size={16} />
                                            </Link>
                                            {submission.status === 'submitted' && (
                                                <>
                                                    <button className={styles.btnSuccess} onClick={() => handleStatusUpdate(submission._id, 'completed')} title="Approve Project" disabled={actionLoading}>
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button className={styles.btnDanger} onClick={() => handleStatusUpdate(submission._id, 'rejected')} title="Reject Project" disabled={actionLoading}>
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className={styles.empty}>
                                        <FileText size={48} />
                                        <h3>No submissions found</h3>
                                        <p>Students have not submitted any projects yet.</p>
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
