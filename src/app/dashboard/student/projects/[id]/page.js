'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Clock, Code, FileText, Link as LinkIcon,
    Github, Send, CheckCircle, AlertCircle, Loader, Target, Download,
    Zap, BookOpen, Video, Globe, Layers, Award, Sparkles, ExternalLink, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from '../project-detail.module.css';

/* Resource-type icon helper */
const resIcons = { doc: FileText, video: Video, repo: Github, other: Globe };
const resLabels = { doc: 'Documentation', video: 'Video Tutorial', repo: 'Repository', other: 'Resource' };

const difficultyColors = {
    Beginner: { bg: '#D1FAE5', color: '#065F46' },
    Intermediate: { bg: '#DBEAFE', color: '#1E40AF' },
    Advanced: { bg: '#FEF3C7', color: '#92400E' },
    Expert: { bg: '#FEE2E2', color: '#991B1B' },
};

export default function ProjectDetailPage() {
    const params = useParams();
    const [project, setProject] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accepting, setAccepting] = useState(false);
    const [toast, setToast] = useState('');

    const id = params?.id;

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const pRes = await fetch(`/api/admin/projects?id=${id}`, { headers: getAuthHeaders() });
                if (pRes.ok) {
                    const data = await pRes.json();
                    setProject(data.project);

                    const sRes = await fetch(`/api/student/submit?projectId=${id}`, { headers: getAuthHeaders() });
                    if (sRes.ok) {
                        const sData = await sRes.json();
                        if (sData.submission) {
                            setSubmission(sData.submission);
                            // Set active step
                            if (sData.submission.currentStep !== undefined) {
                                setActiveStep(sData.submission.currentStep);
                            }
                        }
                    }
                } else {
                    setError('Project not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load project data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    /* Step Submission */
    const [activeStep, setActiveStep] = useState(0);
    const [stepContent, setStepContent] = useState('');
    const [stepSubmitting, setStepSubmitting] = useState(false);

    const handleAccept = async () => {
        setAccepting(true);
        try {
            const res = await fetch('/api/student/submit', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ projectId: id, action: 'accept' }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubmission(data.submission);
                setToast('Project accepted! Get started.');
                setTimeout(() => setToast(''), 4000);
            } else {
                setToast(data.error || 'Failed to accept project');
                setTimeout(() => setToast(''), 4000);
            }
        } catch {
            setToast('Error accepting project');
            setTimeout(() => setToast(''), 4000);
        }
        setAccepting(false);
    };

    const handleStepSubmit = async (e, stepIndex) => {
        e.preventDefault();
        setStepSubmitting(true);

        // Get form data
        const formData = new FormData(e.target);
        const link = formData.get('link');
        const notes = formData.get('notes');
        const content = JSON.stringify({ link, notes });

        try {
            const res = await fetch('/api/student/submit', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    projectId: id,
                    action: 'submit_step',
                    stepIndex,
                    content
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubmission(data.submission);
                setToast('Step submitted for review!');
                setTimeout(() => setToast(''), 4000);
            } else {
                setToast(data.error || 'Submission failed');
                setTimeout(() => setToast(''), 4000);
            }
        } catch {
            setToast('Error submitting step');
            setTimeout(() => setToast(''), 4000);
        }
        setStepSubmitting(false);
    };

    /* Helpers */
    const getStatusInfo = () => {
        if (!submission) return { label: 'Available', class: styles.statusAvailable, desc: 'Review the project and accept to begin' };

        // Check overall status
        if (submission.status === 'completed') return { label: 'Completed', class: styles.statusGraded, desc: 'You have completed this project!' };

        // Calculate progress
        const totalSteps = project?.steps?.length || 0;
        const completed = submission.completedSteps?.length || 0;
        const progress = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0;

        return {
            label: 'In Progress',
            class: styles.statusAccepted,
            desc: `${progress}% Completed`,
            progress
        };
    };

    const statusInfo = project ? getStatusInfo() : {};
    const dc = project ? (difficultyColors[project.difficulty] || {}) : {};

    /* LOADING / ERROR states */
    if (loading) return <div className={styles.loading}><Loader className={styles.spinner} /> Loading project...</div>;
    if (error || !project) return (
        <div className={styles.errorContainer}>
            <AlertCircle size={48} color="#D92D20" />
            <h2>Project Not Found</h2>
            <Link href="/dashboard/student/explore" className={styles.backBtnLink}>
                <ArrowLeft size={16} /> Back to Explore
            </Link>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <CheckCircle size={16} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <Link href="/dashboard/student/explore" className={styles.backBtnLink}>
                <ArrowLeft size={16} /> Back to Explore
            </Link>

            {/* ======= HERO HEADER ======= */}
            <motion.div className={styles.heroHeader} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.heroLeft}>
                    <div className={styles.heroBreadcrumb}>
                        <span>Explore</span> <ArrowRight size={12} /> <span>{project.title}</span>
                    </div>
                    <h1>{project.title}</h1>
                    <div className={styles.heroBadges}>
                        <span className={styles.heroBadge}>{project.domain}</span>
                        <span className={styles.heroBadgeDiff} style={{ background: dc.bg, color: dc.color }}>
                            <Zap size={12} /> {project.difficulty}
                        </span>
                    </div>
                    <div className={styles.heroMeta}>
                        <span><Target size={14} /> +{project.points} XP</span>
                        {submission && (
                            <span className={styles.progressText}>
                                Progress: {statusInfo.progress}%
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.heroRight}>
                    <div className={styles.statusCard}>
                        <span className={styles.statusLabel}>Status</span>
                        <span className={`${styles.statusPill} ${statusInfo.class}`}>{statusInfo.label}</span>
                        <span className={styles.statusDesc}>{statusInfo.desc}</span>
                        {/* Progress Bar for Accepted Projects */}
                        {submission && (
                            <div className={styles.miniProgressBar}>
                                <div className={styles.miniProgressFill} style={{ width: `${statusInfo.progress}%` }} />
                            </div>
                        )}
                    </div>
                    {!submission && (
                        <button className={styles.acceptBtnLarge} onClick={handleAccept} disabled={accepting}>
                            {accepting ? <Loader size={18} className={styles.spinner} /> : <CheckCircle size={18} />}
                            {accepting ? 'Accepting...' : 'Accept Project'}
                        </button>
                    )}
                </div>
            </motion.div>

            {/* ======= CONTENT ======= */}
            <div className={styles.mainGrid}>
                {/* LEFT COLUMN */}
                <div className={styles.leftCol}>

                    {/* WORKSPACE VIEW (If Submitted/Accepted) */}
                    {submission ? (
                        <motion.div className={styles.workspace} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                            <div className={styles.workspaceHeader}>
                                <div className={styles.workspaceTitle}>
                                    <Code size={20} />
                                    <h3>Project Workspace</h3>
                                </div>
                                <div className={styles.workspaceProgress}>
                                    <span>{statusInfo.progress}% Complete</span>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${statusInfo.progress}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.stepperContainer}>
                                {project.steps && project.steps.map((step, index) => {
                                    // Determine step status
                                    const stepSub = submission.stepSubmissions?.find(s => s.stepIndex === index);
                                    const isCompleted = submission.completedSteps?.includes(index);
                                    const isPending = stepSub && stepSub.status === 'pending';
                                    const isLocked = index > (submission.currentStep || 0) && !isCompleted;
                                    const isActive = activeStep === index;

                                    // Parse content if JSON
                                    let subContent = { link: '', notes: '' };
                                    if (stepSub?.content) {
                                        try {
                                            const parsed = JSON.parse(stepSub.content);
                                            if (typeof parsed === 'object') subContent = parsed;
                                            else subContent = { notes: stepSub.content };
                                        } catch {
                                            subContent = { notes: stepSub.content };
                                        }
                                    }

                                    return (
                                        <div key={index} className={`${styles.stepItem} ${isActive ? styles.stepActive : ''} ${isLocked ? styles.stepLocked : ''} ${isCompleted ? styles.stepCompleted : ''}`}>
                                            {/* Vertical Line */}
                                            {index < project.steps.length - 1 && <div className={styles.stepLine} />}

                                            {/* Step Indicator */}
                                            <div
                                                className={styles.stepIndicator}
                                                onClick={() => !isLocked && setActiveStep(index)}
                                            >
                                                {isCompleted ? <CheckCircle size={18} /> :
                                                    isLocked ? <div className={styles.lockedDot} /> :
                                                        index + 1}
                                            </div>

                                            {/* Step Content */}
                                            <div className={styles.stepContentWrapper}>
                                                <div className={styles.stepHeaderRow} onClick={() => !isLocked && setActiveStep(index)}>
                                                    <div className={styles.stepTitleGroup}>
                                                        <h4>{step.title}</h4>
                                                        <span className={styles.stepPointsBadge}>+{step.points} XP</span>
                                                    </div>
                                                    <div className={styles.stepStatusBadge}>
                                                        {isCompleted && <span className={styles.badgeSuccess}>Completed</span>}
                                                        {isPending && <span className={styles.badgeWarning}>In Review</span>}
                                                        {isLocked && <span className={styles.badgeLocked}>Locked</span>}
                                                        <ArrowRight size={16} className={`${styles.stepArrow} ${isActive ? styles.rotate90 : ''}`} />
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {isActive && !isLocked && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className={styles.stepBody}
                                                        >
                                                            <p className={styles.stepDesc}>{step.description}</p>

                                                            {/* Submission Form / View */}
                                                            <div className={styles.submissionArea}>
                                                                {!isCompleted && !isPending ? (
                                                                    <form onSubmit={(e) => handleStepSubmit(e, index)} className={styles.stepForm}>
                                                                        <h5>Submit Your Work</h5>

                                                                        <div className={styles.formGroup}>
                                                                            <label>Project Link / GitHub Repo</label>
                                                                            <div className={styles.inputWrapper}>
                                                                                <LinkIcon size={16} />
                                                                                <input
                                                                                    type="url"
                                                                                    placeholder="https://github.com/username/repo"
                                                                                    required
                                                                                    className={styles.input}
                                                                                    name="link"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className={styles.formGroup}>
                                                                            <label>Implementation Notes</label>
                                                                            <textarea
                                                                                placeholder="Describe your approach, challenges faced, or key features..."
                                                                                required
                                                                                className={styles.textarea}
                                                                                rows={4}
                                                                                name="notes"
                                                                            />
                                                                        </div>

                                                                        <button type="submit" className={styles.submitBtn} disabled={stepSubmitting}>
                                                                            {stepSubmitting ? <Loader size={16} className={styles.spinner} /> : <Send size={16} />}
                                                                            {stepSubmitting ? 'Submitting...' : 'Submit Review'}
                                                                        </button>
                                                                    </form>
                                                                ) : (
                                                                    <div className={styles.submittedView}>
                                                                        <div className={styles.submittedField}>
                                                                            <span className={styles.fieldLabel}>Submission Link</span>
                                                                            {subContent.link ? (
                                                                                <a href={subContent.link} target="_blank" rel="noopener noreferrer" className={styles.linkDisplay}>
                                                                                    <ExternalLink size={14} /> {subContent.link}
                                                                                </a>
                                                                            ) : <span className={styles.textMuted}>No link provided</span>}
                                                                        </div>
                                                                        <div className={styles.submittedField}>
                                                                            <span className={styles.fieldLabel}>Notes</span>
                                                                            <p className={styles.notesDisplay}>{subContent.notes || 'No notes provided'}</p>
                                                                        </div>

                                                                        {isPending && (
                                                                            <div className={styles.pendingBanner}>
                                                                                <Clock size={18} />
                                                                                <div>
                                                                                    <strong>Under Review</strong>
                                                                                    <p>Your mentor will review your submission shortly.</p>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {stepSub?.feedback && (
                                                                            <div className={styles.feedbackBanner}>
                                                                                <strong>Mentor Feedback:</strong>
                                                                                <p>{stepSub.feedback}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        /* OVERVIEW VIEW (Not Accepted) */
                        <>
                            <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                                <div className={styles.cardHeader}>
                                    <BookOpen size={18} />
                                    <h3>Project Overview</h3>
                                </div>
                                <div className={styles.descriptionBody}>
                                    {project.description}
                                </div>
                            </motion.div>

                            {/* Show Steps Preview if not accepted */}
                            <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <div className={styles.cardHeader}>
                                    <Layers size={18} />
                                    <h3>Project Roadmap</h3>
                                    <span className={styles.countChip}>{project.steps?.length || 0} Steps</span>
                                </div>
                                <div className={styles.previewSteps}>
                                    {project.steps?.map((step, i) => (
                                        <div key={i} className={styles.previewStepRow}>
                                            <span className={styles.previewStepNum}>{i + 1}</span>
                                            <span>{step.title}</span>
                                            <span className={styles.previewStepPoints}>+{step.points} XP</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* RIGHT COLUMN — Sidebar */}
                <div className={styles.rightCol}>
                    <motion.div className={styles.sidebarCard}>
                        <h4>Project Details</h4>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}><Target size={14} /> Total XP</span>
                            <span className={styles.detailValue}>+{project.points}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}><Calendar size={14} /> Deadline</span>
                            <span className={styles.detailValue} style={{ color: '#ef4444', fontWeight: '600' }}>
                                {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible'}
                            </span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}><Layers size={14} /> Domain</span>
                            <span className={styles.detailValue}>{project.domain}</span>
                        </div>
                    </motion.div>

                    {/* Tech Stack */}
                    {project.technologies && project.technologies.length > 0 && (
                        <motion.div className={styles.sidebarCard}>
                            <h4><Code size={14} /> Tech Stack</h4>
                            <div className={styles.tagGrid}>
                                {project.technologies.map((tech, i) => (
                                    <span key={i} className={styles.techTag}>{tech}</span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {!submission && (
                        <motion.div className={styles.sidebarCTA}>
                            <Sparkles size={24} />
                            <h4>Ready to start?</h4>
                            <p>Accept this project to begin working on it and track your progress.</p>
                            <button className={styles.acceptBtnSidebar} onClick={handleAccept} disabled={accepting}>
                                {accepting ? <Loader size={16} className={styles.spinner} /> : <CheckCircle size={16} />}
                                {accepting ? 'Accepting...' : 'Accept Project'}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
