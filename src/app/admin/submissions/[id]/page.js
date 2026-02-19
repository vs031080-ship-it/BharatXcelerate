'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './detail.module.css';
import {
    ArrowLeft, User, Mail, Calendar, Clock, Zap, Target, BookOpen,
    Github, ExternalLink, CheckCircle, XCircle, FileText, Code, Star,
    Award, Send, AlertCircle, Loader2
} from 'lucide-react';

export default function SubmissionDetailPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const res = await fetch('/api/admin/submissions', { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    const found = data.submissions.find(s => s._id === id);
                    if (found) {
                        setSubmission(found);
                        setGrade(found.grade || '');
                        setFeedback(found.feedback || '');
                    }
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchSubmission();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/submissions', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ id: submission._id, status: newStatus, grade, feedback }),
            });
            if (res.ok) {
                const data = await res.json();
                setSubmission(data.submission);
                setToast(`Submission ${newStatus === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
                setTimeout(() => setToast(''), 4000);
            }
        } catch (e) { console.error(e); }
        setActionLoading(false);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'accepted_by_student': return { label: 'Student Accepted', cls: styles.statusAccepted, icon: <CheckCircle size={14} /> };
            case 'submitted': return { label: 'Pending Review', cls: styles.statusPending, icon: <Send size={14} /> };
            case 'accepted': return { label: 'Graded — Accepted', cls: styles.statusGraded, icon: <Award size={14} /> };
            case 'rejected': return { label: 'Rejected', cls: styles.statusRejected, icon: <XCircle size={14} /> };
            default: return { label: status, cls: '', icon: null };
        }
    };

    const getDifficultyColor = (d) => {
        if (d === 'Easy') return '#22C55E';
        if (d === 'Medium') return '#F59E0B';
        if (d === 'Hard') return '#EF4444';
        return '#0D9488';
    };

    if (loading) return (
        <div className={styles.loadingScreen}>
            <Loader2 size={36} className={styles.spin} />
            <p>Loading submission details...</p>
        </div>
    );

    if (!submission) return (
        <div className={styles.loadingScreen}>
            <AlertCircle size={36} />
            <p>Submission not found.</p>
            <Link href="/admin/submissions" className={styles.backLink}>← Back to Submissions</Link>
        </div>
    );

    const project = submission.project;
    const student = submission.student;
    const statusInfo = getStatusInfo(submission.status);

    return (
        <div className={styles.container}>
            {/* Toast */}
            {toast && <div className={styles.toast}>{toast}</div>}

            {/* Hero Header */}
            <div className={styles.hero}>
                <Link href="/admin/submissions" className={styles.backBtn}>
                    <ArrowLeft size={16} /> Back to Submissions
                </Link>
                <div className={styles.heroContent}>
                    <div className={styles.heroLeft}>
                        <h1>{project?.title || 'Unknown Project'}</h1>
                        <div className={styles.heroMeta}>
                            {project?.domain && <span className={styles.heroBadge}><Target size={13} /> {project.domain}</span>}
                            {project?.difficulty && (
                                <span className={styles.heroBadge} style={{ color: getDifficultyColor(project.difficulty), borderColor: getDifficultyColor(project.difficulty) }}>
                                    <Star size={13} /> {project.difficulty}
                                </span>
                            )}
                            {project?.points && <span className={styles.heroBadge}><Zap size={13} /> {project.points} XP</span>}
                            {project?.duration && <span className={styles.heroBadge}><Clock size={13} /> {project.duration}</span>}
                        </div>
                    </div>
                    <div className={styles.heroRight}>
                        <span className={`${styles.statusBadge} ${statusInfo.cls}`}>
                            {statusInfo.icon} {statusInfo.label}
                        </span>
                        <span className={styles.dateLine}>
                            <Calendar size={13} /> {new Date(submission.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content — Two Column */}
            <div className={styles.layout}>
                {/* Left Column */}
                <div className={styles.leftCol}>
                    {/* Student Info Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <User size={18} /> Student Information
                        </div>
                        <div className={styles.studentRow}>
                            <div className={styles.avatar}>
                                {student?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className={styles.studentInfo}>
                                <h3>{student?.name || 'Unknown Student'}</h3>
                                <span><Mail size={13} /> {student?.email || '—'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Project Overview */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <BookOpen size={18} /> Project Overview
                        </div>
                        <p className={styles.description}>{project?.description || 'No description available.'}</p>
                    </div>

                    {/* Requirements */}
                    {project?.requirements?.length > 0 && (
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <CheckCircle size={18} /> Project Requirements
                            </div>
                            <ol className={styles.reqList}>
                                {project.requirements.map((r, i) => <li key={i}>{r}</li>)}
                            </ol>
                        </div>
                    )}

                    {/* Student Submission */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Send size={18} /> Student Submission
                        </div>
                        <div className={styles.submissionContent}>
                            <div className={styles.fieldRow}>
                                <label>GitHub Repository</label>
                                {submission.githubUrl && submission.githubUrl !== 'pending' ? (
                                    <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                                        <Github size={15} /> {submission.githubUrl} <ExternalLink size={12} />
                                    </a>
                                ) : (
                                    <span className={styles.pendingText}>Not submitted yet</span>
                                )}
                            </div>
                            <div className={styles.fieldRow}>
                                <label>Student Notes / Approach</label>
                                <div className={styles.notesBox}>{submission.description || '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Grading Section */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Award size={18} /> Grade & Feedback
                        </div>
                        <div className={styles.gradingForm}>
                            <div className={styles.fieldRow}>
                                <label htmlFor="grade">Grade</label>
                                <input
                                    id="grade"
                                    type="text"
                                    value={grade}
                                    onChange={e => setGrade(e.target.value)}
                                    className={styles.input}
                                    placeholder="e.g. A+, 95/100, Excellent"
                                    disabled={submission.status === 'accepted_by_student'}
                                />
                            </div>
                            <div className={styles.fieldRow}>
                                <label htmlFor="feedback">Feedback</label>
                                <textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                    className={styles.textarea}
                                    rows={4}
                                    placeholder="Write feedback for the student..."
                                    disabled={submission.status === 'accepted_by_student'}
                                />
                            </div>
                            {(submission.status === 'submitted' || submission.status === 'accepted_by_student') && (
                                <div className={styles.actionRow}>
                                    {submission.status === 'submitted' && (
                                        <>
                                            <button className={styles.acceptBtn} onClick={() => handleStatusUpdate('accepted')} disabled={actionLoading}>
                                                {actionLoading ? <Loader2 size={16} className={styles.spin} /> : <CheckCircle size={16} />}
                                                Accept & Grade
                                            </button>
                                            <button className={styles.rejectBtn} onClick={() => handleStatusUpdate('rejected')} disabled={actionLoading}>
                                                <XCircle size={16} /> Reject
                                            </button>
                                        </>
                                    )}
                                    {submission.status === 'accepted_by_student' && (
                                        <p className={styles.waitingNote}>
                                            <AlertCircle size={14} /> Student has accepted the project but hasn&apos;t submitted work yet.
                                        </p>
                                    )}
                                </div>
                            )}
                            {(submission.status === 'accepted' || submission.status === 'rejected') && (
                                <div className={styles.resultBox}>
                                    <span className={`${styles.resultBadge} ${submission.status === 'accepted' ? styles.resultAccepted : styles.resultRejected}`}>
                                        {submission.status === 'accepted' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                        {submission.status === 'accepted' ? 'Accepted' : 'Rejected'}
                                    </span>
                                    {submission.grade && <div><strong>Grade:</strong> {submission.grade}</div>}
                                    {submission.feedback && <div className={styles.feedbackText}><strong>Feedback:</strong> {submission.feedback}</div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column — Sidebar */}
                <div className={styles.rightCol}>
                    {/* Quick Stats */}
                    <div className={styles.sideCard}>
                        <h4>Quick Stats</h4>
                        <div className={styles.statRow}><Zap size={14} /> <span>XP Points</span> <strong>{project?.points || 100}</strong></div>
                        <div className={styles.statRow}><Clock size={14} /> <span>Duration</span> <strong>{project?.duration || '—'}</strong></div>
                        <div className={styles.statRow}><Target size={14} /> <span>Domain</span> <strong>{project?.domain || '—'}</strong></div>
                        <div className={styles.statRow}>
                            <Star size={14} />
                            <span>Difficulty</span>
                            <strong style={{ color: getDifficultyColor(project?.difficulty) }}>{project?.difficulty || '—'}</strong>
                        </div>
                    </div>

                    {/* Technologies */}
                    {project?.technologies?.length > 0 && (
                        <div className={styles.sideCard}>
                            <h4><Code size={15} /> Tech Stack</h4>
                            <div className={styles.tagGrid}>
                                {project.technologies.map((t, i) => <span key={i} className={styles.tag}>{t}</span>)}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {project?.skills?.length > 0 && (
                        <div className={styles.sideCard}>
                            <h4><BookOpen size={15} /> Skills</h4>
                            <div className={styles.tagGrid}>
                                {project.skills.map((s, i) => <span key={i} className={styles.skillTag}>{s}</span>)}
                            </div>
                        </div>
                    )}

                    {/* Resources */}
                    {project?.resources?.length > 0 && (
                        <div className={styles.sideCard}>
                            <h4><FileText size={15} /> Resources</h4>
                            <div className={styles.resourceList}>
                                {project.resources.map((r, i) => (
                                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                                        <ExternalLink size={12} /> {r.label || r.url}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className={styles.sideCard}>
                        <h4><Calendar size={15} /> Timeline</h4>
                        <div className={styles.timeline}>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineDot} />
                                <div>
                                    <strong>Accepted</strong>
                                    <span>{new Date(submission.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                            {submission.status !== 'accepted_by_student' && (
                                <div className={styles.timelineItem}>
                                    <div className={`${styles.timelineDot} ${styles.timelineDotActive}`} />
                                    <div>
                                        <strong>{submission.status === 'submitted' ? 'Submitted' : submission.status === 'accepted' ? 'Graded' : 'Updated'}</strong>
                                        <span>{new Date(submission.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
