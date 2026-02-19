'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Clock, Code, FileText, Link as LinkIcon,
    Github, Send, CheckCircle, AlertCircle, Loader, Target, Download,
    Zap, BookOpen, Video, Globe, Layers, Award, Sparkles, ExternalLink
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

    /* Submission form state */
    const [githubUrl, setGithubUrl] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
                            setGithubUrl(sData.submission.githubUrl || '');
                            setDescription(sData.submission.description || '');
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

    /* Accept Project */
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
                setToast('Project accepted! You can now start working on it.');
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

    /* Submit Work */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/student/submit', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ projectId: id, githubUrl, description }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubmission(data.submission);
                setToast('Project submitted successfully!');
                setTimeout(() => setToast(''), 4000);
            } else {
                setToast(data.error || 'Submission failed');
                setTimeout(() => setToast(''), 4000);
            }
        } catch {
            setToast('Error submitting project');
            setTimeout(() => setToast(''), 4000);
        }
        setSubmitting(false);
    };

    /* Helpers */
    const getStatusInfo = () => {
        if (!submission) return { label: 'Available', class: styles.statusAvailable, desc: 'Review the project and accept to begin' };
        switch (submission.status) {
            case 'accepted_by_student': return { label: 'Accepted', class: styles.statusAccepted, desc: 'You accepted this project — start working!' };
            case 'submitted': return { label: 'Submitted', class: styles.statusSubmitted, desc: 'Your work has been submitted for review' };
            case 'reviewed': case 'accepted': return { label: 'Graded ✓', class: styles.statusGraded, desc: 'Your submission has been reviewed' };
            case 'rejected': return { label: 'Needs Revision', class: styles.statusRevision, desc: 'Please review feedback and resubmit' };
            default: return { label: submission.status, class: '', desc: '' };
        }
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
                    {/* Breadcrumbs */}
                    <div className={styles.heroBreadcrumb}>
                        <span>Explore</span> <ArrowRight size={12} /> <span>Project Details</span>
                    </div>
                    <h1>{project.title}</h1>
                    <div className={styles.heroBadges}>
                        <span className={styles.heroBadge}>{project.domain}</span>
                        <span className={styles.heroBadgeDiff} style={{ background: dc.bg, color: dc.color }}>
                            <Zap size={12} /> {project.difficulty}
                        </span>
                    </div>
                    <div className={styles.heroMeta}>
                        <span><Clock size={14} /> {project.duration || 'Flexible'}</span>
                        <span><Target size={14} /> +{project.points} XP</span>
                        {project.technologies && project.technologies.length > 0 && (
                            <span><Layers size={14} /> {project.technologies.length} Technologies</span>
                        )}
                    </div>
                </div>
                <div className={styles.heroRight}>
                    {/* Status Badge */}
                    <div className={styles.statusCard}>
                        <span className={styles.statusLabel}>Status</span>
                        <span className={`${styles.statusPill} ${statusInfo.class}`}>{statusInfo.label}</span>
                        <span className={styles.statusDesc}>{statusInfo.desc}</span>
                    </div>
                    {/* Primary CTA — Accept button (only if not yet accepted) */}
                    {!submission && (
                        <button className={styles.acceptBtnLarge} onClick={handleAccept} disabled={accepting}>
                            {accepting ? <Loader size={18} className={styles.spinner} /> : <CheckCircle size={18} />}
                            {accepting ? 'Accepting...' : 'Accept Project'}
                        </button>
                    )}
                </div>
            </motion.div>

            {/* ======= MAIN CONTENT 2-COLUMN ======= */}
            <div className={styles.mainGrid}>
                {/* LEFT COLUMN — Content */}
                <div className={styles.leftCol}>
                    {/* Project Description */}
                    <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                        <div className={styles.cardHeader}>
                            <BookOpen size={18} />
                            <h3>Project Overview</h3>
                            {project.detailedDocument && (
                                <Link href={project.detailedDocument} target="_blank" className={styles.downloadBtn}>
                                    <Download size={14} /> Problem Statement
                                </Link>
                            )}
                        </div>
                        <div className={styles.descriptionBody}>
                            {project.description}
                        </div>
                    </motion.div>

                    {/* Key Requirements */}
                    {project.requirements && project.requirements.length > 0 && (
                        <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <div className={styles.cardHeader}>
                                <CheckCircle size={18} />
                                <h3>Key Requirements</h3>
                                <span className={styles.countChip}>{project.requirements.length} items</span>
                            </div>
                            <ul className={styles.reqList}>
                                {project.requirements.map((req, i) => (
                                    <li key={i}>
                                        <span className={styles.reqNumber}>{i + 1}</span>
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Learning Resources */}
                    {project.resources && project.resources.length > 0 && (
                        <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <div className={styles.cardHeader}>
                                <BookOpen size={18} />
                                <h3>Learning Resources</h3>
                                <span className={styles.countChip}>{project.resources.length} resources</span>
                            </div>
                            <div className={styles.resourceGrid}>
                                {project.resources.map((res, i) => {
                                    const Icon = resIcons[res.type] || Globe;
                                    return (
                                        <div key={i} className={styles.resourceCard}>
                                            <div className={styles.resIcon}>
                                                <Icon size={22} />
                                            </div>
                                            <div className={styles.resContent}>
                                                <span className={styles.resType}>{resLabels[res.type] || 'Resource'}</span>
                                                <h4>{res.title || 'Untitled Resource'}</h4>
                                                {res.url && (
                                                    <Link href={res.url} target="_blank" className={styles.resLink}>
                                                        Open Resource <ExternalLink size={12} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Submission Form — Only show if project is accepted */}
                    {submission && submission.status !== 'rejected' && (
                        <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className={styles.cardHeader}>
                                <Send size={18} />
                                <h3>Submit Your Work</h3>
                            </div>

                            {submission.grade && (
                                <div className={styles.gradeBox}>
                                    <Award size={20} />
                                    <div>
                                        <strong>Grade: {submission.grade}</strong>
                                        {submission.feedback && <p>{submission.feedback}</p>}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className={styles.submitForm}>
                                <div className={styles.formGroup}>
                                    <label><Github size={14} /> GitHub Repository URL</label>
                                    <input
                                        type="url"
                                        value={githubUrl}
                                        onChange={e => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/username/project-repo"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label><FileText size={14} /> Project Approach & Notes</label>
                                    <textarea
                                        rows={5}
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Describe your approach, features implemented, and any challenges..."
                                        required
                                        className={styles.textarea}
                                    />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                    <Send size={16} /> {submitting ? 'Submitting...' : submission.status === 'submitted' ? 'Update Submission' : 'Submit Project'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>

                {/* RIGHT COLUMN — Sidebar */}
                <div className={styles.rightCol}>
                    {/* Quick Stats Card */}
                    <motion.div className={styles.sidebarCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                        <h4>Project Details</h4>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}><Target size={14} /> XP Points</span>
                            <span className={styles.detailValue}>+{project.points}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}><Clock size={14} /> Duration</span>
                            <span className={styles.detailValue}>{project.duration || 'Flexible'}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}><Layers size={14} /> Domain</span>
                            <span className={styles.detailValue}>{project.domain}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}><Zap size={14} /> Difficulty</span>
                            <span className={styles.detailValueBadge} style={{ background: dc.bg, color: dc.color }}>{project.difficulty}</span>
                        </div>
                    </motion.div>

                    {/* Skills to Learn */}
                    {project.skills && project.skills.length > 0 && (
                        <motion.div className={styles.sidebarCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                            <h4><Sparkles size={14} /> Skills You&apos;ll Learn</h4>
                            <div className={styles.tagGrid}>
                                {project.skills.map((skill, i) => (
                                    <span key={i} className={styles.skillTag}>{skill}</span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Tech Stack */}
                    {project.technologies && project.technologies.length > 0 && (
                        <motion.div className={styles.sidebarCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                            <h4><Code size={14} /> Tech Stack</h4>
                            <div className={styles.tagGrid}>
                                {project.technologies.map((tech, i) => (
                                    <span key={i} className={styles.techTag}>{tech}</span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Accept CTA — Sidebar version for non-accepted projects */}
                    {!submission && (
                        <motion.div className={styles.sidebarCTA} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
