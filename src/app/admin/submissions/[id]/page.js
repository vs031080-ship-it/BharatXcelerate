'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './detail.module.css';
import {
    ArrowLeft, User, Mail, Calendar, Clock, Zap, Target, BookOpen,
    Github, ExternalLink, CheckCircle, XCircle, FileText, Code, Star,
    Award, Send, AlertCircle, Loader2, ListChecks
} from 'lucide-react';

export default function SubmissionDetailPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [grade, setGrade] = useState('');
    const [totalScore, setTotalScore] = useState('');
    const [feedback, setFeedback] = useState('');
    const [toast, setToast] = useState('');
    const [stepFeedbacks, setStepFeedbacks] = useState({});

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
                        setTotalScore(found.totalScore !== undefined ? found.totalScore.toString() : '');
                        setFeedback(found.feedback || '');
                    }
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchSubmission();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        if (newStatus === 'accepted') {
            if (!grade.trim()) {
                setToast('Grade is mandatory for final project acceptance.');
                setTimeout(() => setToast(''), 3000);
                return;
            }
            if (totalScore === '' || isNaN(totalScore)) {
                setToast('Valid Total Score is mandatory for final acceptance.');
                setTimeout(() => setToast(''), 3000);
                return;
            }
            if (!feedback.trim() || feedback.trim().length < 10) {
                setToast('Detailed feedback (min 10 chars) is mandatory for final acceptance.');
                setTimeout(() => setToast(''), 3000);
                return;
            }
        }

        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/submissions', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ id: submission._id, status: newStatus, grade, totalScore: Number(totalScore), feedback }),
            });
            if (res.ok) {
                const data = await res.json();
                setSubmission(data.submission);
                setToast(`Submission ${newStatus === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
                setTimeout(() => setToast(''), 4000);
            } else {
                const err = await res.json();
                setToast(err.error || 'Failed to update status');
                setTimeout(() => setToast(''), 4000);
            }
        } catch (e) { console.error(e); }
        setActionLoading(false);
    };

    const handleStepAction = async (stepIndex, status) => {
        const feedback = stepFeedbacks[stepIndex] || '';
        const isLastStep = project?.steps && stepIndex === project.steps.length - 1;

        if (status === 'rejected' && (!feedback || feedback.trim().length < 5)) {
            setToast('Feedback is mandatory when rejecting a step.');
            setTimeout(() => setToast(''), 3000);
            return;
        }

        // Final Step Approval Validation
        if (status === 'approved' && isLastStep) {
            if (!grade.trim()) {
                setToast('Grade is mandatory for final project acceptance.');
                setTimeout(() => setToast(''), 3000);
                return;
            }
            if (totalScore === '' || isNaN(totalScore)) {
                setToast('Valid Total Score is mandatory for final acceptance.');
                setTimeout(() => setToast(''), 3000);
                return;
            }
            const finalFeedback = stepFeedbacks[stepIndex] || '';
            if (!finalFeedback.trim() || finalFeedback.trim().length < 10) {
                setToast('Detailed feedback (min 10 chars) is mandatory for final acceptance.');
                setTimeout(() => setToast(''), 3000);
                return;
            }
        }

        setActionLoading(true);
        try {
            const payload = {
                id: submission._id,
                stepIndex,
                stepStatus: status,
                stepFeedback: feedback
            };

            // If approving final step, include grading details
            if (status === 'approved' && isLastStep) {
                payload.grade = grade;
                payload.totalScore = Number(totalScore);
                payload.finalFeedback = feedback; // Ensure the step feedback is also treated as final feedback
            }

            const res = await fetch('/api/admin/submissions', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const data = await res.json();
                setSubmission(data.submission);
                setToast(`Step ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
                setTimeout(() => setToast(''), 3000);
            } else {
                const err = await res.json();
                setToast(err.error || 'Failed to update status');
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

                    {/* Step-by-Step Review */}
                    {project?.steps?.length > 0 && (
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <ListChecks size={18} /> Detailed Verification Workflow
                            </div>
                            <div className={styles.stepsList}>
                                {project.steps.map((step, i) => {
                                    const sub = submission.stepSubmissions?.find(s => s.stepIndex === i);
                                    const isApproved = sub?.status === 'approved';
                                    const isRejected = sub?.status === 'rejected';
                                    const isPending = sub?.status === 'pending';

                                    const isLastStep = project.steps && i === project.steps.length - 1;

                                    return (
                                        <div key={i} className={`${styles.stepReviewItem} ${isApproved ? styles.stepReviewItemApproved : ''} ${isRejected ? styles.stepReviewItemRejected : ''}`}>
                                            <div className={styles.stepHeader}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: isApproved ? '#DEF7ED' : isRejected ? '#FEE2E2' : '#F1F5F9', border: '1px solid', borderColor: isApproved ? '#10B981' : isRejected ? '#EF4444' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: isApproved ? '#10B981' : isRejected ? '#EF4444' : '#64748B' }}>
                                                        {isApproved ? <CheckCircle size={14} /> : isRejected ? <XCircle size={14} /> : i + 1}
                                                    </div>
                                                    <h4>{step.title}</h4>
                                                </div>
                                                <span className={styles.stepPoints}>{step.points} XP</span>
                                            </div>
                                            <p className={styles.stepDesc}>{step.description}</p>

                                            <div className={styles.submissionBox}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                                    <strong>Student Submission</strong>
                                                    {sub?.submittedAt && <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{new Date(sub.submittedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
                                                </div>

                                                {sub ? (
                                                    (() => {
                                                        let content = { link: '', notes: '' };
                                                        try {
                                                            const parsed = JSON.parse(sub.content);
                                                            if (typeof parsed === 'object') content = parsed;
                                                            else content = { notes: sub.content };
                                                        } catch {
                                                            content = { notes: sub.content };
                                                        }

                                                        return (
                                                            <div className={styles.contentStructured}>
                                                                {content.link && (
                                                                    <div style={{ marginBottom: 12 }}>
                                                                        <a href={content.link} target="_blank" rel="noopener noreferrer" className={styles.githubLink} style={{ width: '100%' }}>
                                                                            <ExternalLink size={14} /> View Work Reference
                                                                        </a>
                                                                    </div>
                                                                )}

                                                                <div className={styles.notesBox} style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1' }}>
                                                                    {content.notes || 'No notes provided by student.'}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()
                                                ) : (
                                                    <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #E2E8F0', borderRadius: 8 }}>
                                                        <Clock size={24} style={{ color: '#CBD5E1', marginBottom: 8 }} />
                                                        <p className={styles.textMuted} style={{ margin: 0 }}>Step submission pending from student</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Review Controls - Hide for last step to force global grading */}
                                            {!isLastStep && sub && (
                                                <div className={styles.reviewControls}>
                                                    <div className={styles.fieldRow}>
                                                        <label>Assessor Feedback</label>
                                                        <textarea
                                                            placeholder="Points of improvement or approval notes..."
                                                            value={stepFeedbacks[i] !== undefined ? stepFeedbacks[i] : (sub?.feedback || '')}
                                                            onChange={e => setStepFeedbacks(prev => ({ ...prev, [i]: e.target.value }))}
                                                            disabled={isApproved || actionLoading}
                                                            rows={2}
                                                            className={styles.textarea}
                                                            style={{ minHeight: 70 }}
                                                        />
                                                    </div>
                                                    <div className={styles.buttons}>
                                                        {!isApproved && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStepAction(i, 'approved')}
                                                                    disabled={actionLoading || !sub}
                                                                    className={styles.acceptBtn}
                                                                    style={{ flex: 1, height: 40 }}
                                                                >
                                                                    <CheckCircle size={14} /> Approve Step
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStepAction(i, 'rejected')}
                                                                    disabled={actionLoading || !sub}
                                                                    className={styles.rejectBtn}
                                                                    style={{ flex: 1, height: 40 }}
                                                                >
                                                                    <XCircle size={14} /> Reject with Feedback
                                                                </button>
                                                            </>
                                                        )}
                                                        {isApproved && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontSize: '0.875rem', fontWeight: 600, padding: '8px 12px', background: '#DCFCE7', borderRadius: 8, width: '100%' }}>
                                                                <CheckCircle size={16} /> Step Approved & XP Awarded
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {isLastStep && (
                                                <div className={styles.waitingNote} style={{ background: '#FFF7ED', color: '#C2410C', borderColor: '#FFEDD5', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                                    <AlertCircle size={18} style={{ marginTop: 2 }} />
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>Final Step Verification</div>
                                                        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>This is the final milestone. Please use the Grading Dashboard below to synthesize the overall project performance.</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className={styles.card} style={{ border: '2px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
                        <div className={styles.cardHeader} style={{ background: '#F8FAFC', margin: '-24px -24px 20px -24px', padding: '16px 24px', borderRadius: '14px 14px 0 0', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Award size={18} style={{ color: '#0D9488' }} />
                                <span style={{ fontWeight: 700 }}>Grading & Final Assessment</span>
                            </div>
                            {submission.status === 'accepted' && (
                                <span className={styles.badgeVerified}>Certified</span>
                            )}
                        </div>

                        <div className={styles.gradingForm}>
                            <div className={styles.submissionContent} style={{ padding: '0 0 20px 0', borderBottom: '1px solid #F1F5F9' }}>
                                <div className={styles.fieldRow}>
                                    <label>Overall Submission Artifact</label>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {submission.githubUrl && submission.githubUrl !== 'pending' ? (
                                            <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink} style={{ flex: 1, padding: '12px', background: '#F0F9FF', border: '1px solid #B9E6FE' }}>
                                                <Github size={16} /> {submission.githubUrl}
                                            </a>
                                        ) : (
                                            <div style={{ flex: 1, padding: '12px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', color: '#94A3B8', fontSize: '0.875rem' }}>
                                                No final artifact link submitted yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.fieldRow} style={{ marginTop: 15 }}>
                                    <label>Student Summary & Impact</label>
                                    <div className={styles.notesBox} style={{ background: '#F9FAFB', border: '1px dashed #E5E7EB', color: '#475569' }}>
                                        {submission.description || 'No final notes provided.'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className={styles.fieldRow}>
                                    <label>Letter Grade / Certification</label>
                                    <input
                                        type="text"
                                        value={grade}
                                        onChange={e => setGrade(e.target.value)}
                                        className={styles.input}
                                        style={{ height: 46, fontSize: '1rem', fontWeight: 600 }}
                                        placeholder="e.g. Platinum, A+, Distinction"
                                        disabled={submission.status === 'accepted' || actionLoading}
                                    />
                                </div>
                                <div className={styles.fieldRow}>
                                    <label>Quantitative Score (0-100)</label>
                                    <input
                                        type="number"
                                        value={totalScore}
                                        onChange={e => setTotalScore(e.target.value)}
                                        className={styles.input}
                                        style={{ height: 46, fontSize: '1rem', fontWeight: 600 }}
                                        placeholder="e.g. 98"
                                        disabled={submission.status === 'accepted' || actionLoading}
                                    />
                                </div>
                            </div>

                            <div className={styles.fieldRow}>
                                <label>Executive Feedback & Next Steps</label>
                                <textarea
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                    className={styles.textarea}
                                    rows={5}
                                    placeholder="Provide a comprehensive summary of the student's work and areas for professional growth..."
                                    disabled={submission.status === 'accepted' || actionLoading}
                                />
                            </div>

                            {(submission.status === 'submitted' || submission.status === 'accepted_by_student') && (
                                <div className={styles.actionRow} style={{ paddingTop: 10 }}>
                                    {submission.status === 'submitted' && (
                                        <>
                                            <button
                                                className={styles.acceptBtn}
                                                onClick={() => handleStatusUpdate('accepted')}
                                                disabled={actionLoading}
                                                style={{ padding: '12px 32px', fontSize: '0.95rem' }}
                                            >
                                                {actionLoading ? <Loader2 size={18} className={styles.spin} /> : <CheckCircle size={18} />}
                                                Finalize & Issue Certification
                                            </button>
                                            <button
                                                className={styles.rejectBtn}
                                                onClick={() => handleStatusUpdate('rejected')}
                                                disabled={actionLoading}
                                                style={{ padding: '12px 24px' }}
                                            >
                                                <XCircle size={18} /> Request Re-submission
                                            </button>
                                        </>
                                    )}
                                    {submission.status === 'accepted_by_student' && (
                                        <div className={styles.waitingNote} style={{ width: '100%', justifyContent: 'center' }}>
                                            <AlertCircle size={16} /> Waiting for Student Final Submission
                                        </div>
                                    )}
                                </div>
                            )}

                            {submission.status === 'accepted' && (
                                <div className={styles.resultBox} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <span className={styles.resultAccepted} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                                            <Award size={14} /> Project Certified
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 500 }}>Graded on {new Date(submission.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div style={{ padding: 12, background: '#FFFFFF', borderRadius: 10, border: '1px solid #DCFCE7' }}>
                                            <label style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginBottom: 4 }}>GRADE</label>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>{submission.grade}</div>
                                        </div>
                                        <div style={{ padding: 12, background: '#FFFFFF', borderRadius: 10, border: '1px solid #DCFCE7' }}>
                                            <label style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginBottom: 4 }}>SCORE</label>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>{submission.totalScore}%</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 12, padding: 12, background: '#FFFFFF', borderRadius: 10, border: '1px solid #DCFCE7' }}>
                                        <label style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginBottom: 4 }}>FEEDBACK</label>
                                        <p className={styles.feedbackText} style={{ margin: 0 }}>{submission.feedback}</p>
                                    </div>
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
