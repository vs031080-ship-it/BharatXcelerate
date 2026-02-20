'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Clock, Code, FileText, Link as LinkIcon,
    Github, Send, CheckCircle, AlertCircle, Loader, Target, Download,
    Zap, BookOpen, Video, Globe, Layers, Award, Sparkles, ExternalLink, Calendar,
    XCircle, SendHorizontal
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

    /* Final Submission */
    const [showFinalModal, setShowFinalModal] = useState(false);
    const [finalGithubUrl, setFinalGithubUrl] = useState('');
    const [finalNotes, setFinalNotes] = useState('');
    const [finalSubmitting, setFinalSubmitting] = useState(false);

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
        const formData = new FormData(e.target);
        const link = formData.get('link');
        const notes = formData.get('notes');

        if (!link || !notes) {
            setToast('Please complete all fields');
            setTimeout(() => setToast(''), 3000);
            return;
        }

        setStepSubmitting(true);
        try {
            const res = await fetch('/api/student/submit', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    projectId: id,
                    stepIndex,
                    content: JSON.stringify({ link, notes }),
                    action: 'submit_step'
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setSubmission(data.submission);
                setToast('Step submitted for review!');
                setTimeout(() => setToast(''), 3000);
                setActiveStep(stepIndex);
            } else {
                const err = await res.json();
                setToast(err.error || 'Submission failed');
                setTimeout(() => setToast(''), 3000);
            }
        } catch (e) {
            console.error(e);
            setToast('Network error');
            setTimeout(() => setToast(''), 3000);
        } finally {
            setStepSubmitting(false);
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (!finalGithubUrl || !finalNotes) {
            toast.error("Please fill in all fields");
            return;
        }

        setFinalSubmitting(true);
        try {
            // First submit the final step
            const stepRes = await fetch('/api/student/submit', {
                method: 'POST',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: project._id,
                    stepIndex: project.steps.length - 1,
                    content: JSON.stringify({ link: finalGithubUrl, notes: finalNotes }),
                    action: 'submit_step'
                })
            });

            if (!stepRes.ok) throw new Error("Failed to submit final step");

            // Then mark as complete (which sets status to submitted for review)
            const completeRes = await fetch('/api/student/submit', {
                method: 'POST',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: project._id,
                    action: 'complete',
                    githubUrl: finalGithubUrl,
                    description: finalNotes
                })
            });

            if (completeRes.ok) {
                toast.success("Project submitted successfully!");
                setShowFinalModal(false);
                fetchProject();
            } else {
                throw new Error("Failed to complete project");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Submission failed");
        } finally {
            setFinalSubmitting(false);
        }
    };





    /* Helpers */
    const getStatusInfo = () => {
        if (!submission) return { label: 'Available', class: styles.statusAvailable, desc: 'Review the project and accept to begin' };

        // Check overall status
        if (submission.status === 'completed') return { label: 'Completed', class: styles.statusGraded, desc: 'You have completed this project!' };
        if (submission.status === 'rejected') return { label: 'Rejected', class: styles.statusRejected, desc: 'Review feedback and re-submit' };

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
                                    const isRejected = stepSub && stepSub.status === 'rejected';
                                    const isPending = stepSub && stepSub.status === 'pending';
                                    const isLocked = index > (submission.currentStep || 0) && !isCompleted && !isRejected;
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

                                    const isLastStep = index === project.steps.length - 1;

                                    return (
                                        <div key={index} className={`${styles.stepItem} ${isActive ? styles.stepActive : ''} ${isLocked ? styles.stepLocked : ''} ${isCompleted ? styles.stepCompleted : ''} ${isRejected ? styles.stepRejected : ''}`}>
                                            {/* Vertical Line */}
                                            {index < project.steps.length - 1 && <div className={styles.stepLine} />}

                                            {/* Step Indicator */}
                                            <div
                                                className={styles.stepIndicator}
                                                onClick={() => !isLocked && setActiveStep(index)}
                                            >
                                                {isCompleted ? <CheckCircle size={18} /> :
                                                    isRejected ? <XCircle size={18} /> :
                                                        isLocked ? <div className={styles.lockedDot} /> :
                                                            index + 1}
                                            </div>

                                            {/* Step Content */}
                                            <div className={styles.stepContentWrapper}>
                                                <div className={styles.stepHeaderRow} onClick={() => !isLocked && setActiveStep(index)}>
                                                    <div className={styles.stepTitleGroup}>
                                                        <h4>{step.title} {isLastStep && <span className={styles.finalBadge}><Sparkles size={12} /> Final Step</span>}</h4>
                                                        <span className={styles.stepPointsBadge}>+{step.points} XP</span>
                                                    </div>
                                                    <div className={styles.stepStatusBadge}>
                                                        {isCompleted && <span className={styles.badgeSuccess}>Completed</span>}
                                                        {isRejected && <span className={styles.badgeRejected}>Rejected</span>}
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
                                                            <div className={`${styles.submissionArea} ${isLastStep ? styles.finalSubmissionArea : ''}`}>
                                                                {isRejected && stepSub?.feedback && (
                                                                    <div className={`${styles.feedbackBanner} ${styles.rejectedFeedback}`}>
                                                                        <div className={styles.feedbackBannerHeader}>
                                                                            <AlertCircle size={18} />
                                                                            <strong>Rejection Feedback:</strong>
                                                                        </div>
                                                                        <p>{stepSub.feedback}</p>
                                                                    </div>
                                                                )}

                                                                {!isCompleted && !isPending ? (
                                                                    <>
                                                                        {isLastStep ? (
                                                                            <div className={styles.finalStepCta}>
                                                                                <div className={styles.finalStepInfo}>
                                                                                    <h4><Sparkles size={18} /> Ready to Submit?</h4>
                                                                                    <p>You&apos;ve reached the final milestone! Submit your project for review.</p>
                                                                                </div>
                                                                                <button
                                                                                    className={styles.finalSubmitBtnLarge}
                                                                                    onClick={() => setShowFinalModal(true)}
                                                                                >
                                                                                    Submit Final Project <ArrowRight size={18} />
                                                                                </button>
                                                                            </div>
                                                                        ) : (
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
                                                                                    {stepSubmitting ? <Loader size={16} className={styles.spinner} /> : <SendHorizontal size={16} />}
                                                                                    {stepSubmitting ? 'Submitting...' : isRejected ? 'Re-submit Work' : 'Submit Review'}
                                                                                </button>
                                                                            </form>
                                                                        )}
                                                                    </>
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


            {/* Final Submission Modal */}
            <AnimatePresence>
                {showFinalModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowFinalModal(false)}>
                        <motion.div
                            className={styles.modal}
                            onClick={e => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className={styles.modalHeader}>
                                <div className={styles.modalTitle}>
                                    <Award size={24} color="#0EA5E9" />
                                    <h2>Final Project Submission</h2>
                                </div>
                                <button className={styles.closeBtn} onClick={() => setShowFinalModal(false)}>
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleFinalSubmit} className={styles.modalForm}>
                                <div className={styles.modalBody}>
                                    <p className={styles.modalDesc}>
                                        Congratulations on completing all the steps! To finalize your project, please provide the main repository URL and a brief summary of your work.
                                    </p>

                                    <div className={styles.formGroup}>
                                        <label>Final GitHub Repository URL <span className={styles.req}>*</span></label>
                                        <div className={styles.inputWrapper}>
                                            <Github size={18} />
                                            <input
                                                type="url"
                                                placeholder="https://github.com/username/final-project-repo"
                                                value={finalGithubUrl}
                                                onChange={(e) => setFinalGithubUrl(e.target.value)}
                                                required
                                                className={styles.input}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Project Summary & Comments <span className={styles.req}>*</span></label>
                                        <textarea
                                            placeholder="Describe your final implementation, technologies used, and any challenges you overcame..."
                                            value={finalNotes}
                                            onChange={(e) => setFinalNotes(e.target.value)}
                                            required
                                            className={styles.textarea}
                                            rows={6}
                                        />
                                    </div>
                                </div>

                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.btnGhost} onClick={() => setShowFinalModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.btnPrimary} disabled={finalSubmitting}>
                                        {finalSubmitting ? <Loader size={18} className={styles.spinner} /> : <Sparkles size={18} />}
                                        {finalSubmitting ? 'Submitting...' : 'Submit Final Project'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
