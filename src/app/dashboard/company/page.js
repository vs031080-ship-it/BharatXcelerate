'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, TrendingUp, ArrowRight, Plus, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import styles from './company.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }) };

export default function CompanyDashboardPage() {
    const { jobs, shortlist, applications, addJob } = useData();
    const [showPostModal, setShowPostModal] = useState(false);
    const { user } = useAuth();
    const companyName = user?.name || 'Company';
    const [saved, setSaved] = useState(false);
    const [newJob, setNewJob] = useState({ title: '', type: 'Full-time', location: '', salary: '', company: '', description: '', skills: '' });

    const totalApplicants = applications.filter(a => a.status === 'Applied').length;
    const openRoles = jobs.length;
    const shortlistedCount = shortlist.length;

    const topCandidates = shortlist.slice(0, 4);

    const handlePostJob = (e) => {
        e.preventDefault();
        addJob({ ...newJob, company: companyName, skills: newJob.skills.split(',').map(s => s.trim()).filter(Boolean) });
        setNewJob({ title: '', type: 'Full-time', location: '', salary: '', company: '', description: '', skills: '' });
        setShowPostModal(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className={styles.container}>
            {/* Success Toast */}
            <AnimatePresence>
                {saved && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <CheckCircle size={18} /> Job posted successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Welcome Banner — Upstream style */}
            <motion.div className={styles.welcomeCombo} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.welcomeCard}>
                    <div className={styles.bannerContent}>
                        <span className={styles.bannerBreadcrumb}>Company · Dashboard</span>
                        <h1>Welcome back, {companyName} 👋</h1>
                        <p>Manage your talent pipeline and open roles from here.</p>
                    </div>
                    <button className={styles.postBtn} onClick={() => setShowPostModal(true)}>
                        <Plus size={18} /> Post New Role
                    </button>
                </div>
            </motion.div>

            {/* Stats — Compact icon-left */}
            <div className={styles.statsGrid}>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#2563EB' }}><Briefcase size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{openRoles}</span>
                        <span className={styles.statLabel}>Open Roles</span>
                    </div>
                    <TrendingUp size={14} className={styles.statTrend} />
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    <div className={styles.statIcon} style={{ background: '#D1FAE5', color: '#059669' }}><TrendingUp size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{totalApplicants}</span>
                        <span className={styles.statLabel}>Total Applicants</span>
                    </div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <div className={styles.statIcon} style={{ background: '#F9F5FF', color: '#6941C6' }}><Users size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{shortlistedCount}</span>
                        <span className={styles.statLabel}>Shortlisted</span>
                    </div>
                </motion.div>
            </div>

            {/* Top Candidates — Upstream Vendors style */}
            <motion.div className={styles.section} initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <div className={styles.sectionHeader}>
                    <h2>Top Candidates</h2>
                    <Link href="/dashboard/company/talent" className={styles.viewAll}>View All Talent <ArrowRight size={14} /></Link>
                </div>
                <div className={styles.candidateGrid}>
                    {topCandidates.map((c, i) => (
                        <motion.div key={c.id} className={styles.candidateCard} variants={fadeUp} custom={i + 4}>
                            <div className={styles.candidateHeader}>
                                <div className={styles.candidateAvatar}>
                                    {c.candidateName?.charAt(0)?.toUpperCase() || 'C'}
                                </div>
                                <div>
                                    <h4>{c.candidateName}</h4>
                                    <span className={styles.candidateRole}>{c.role}</span>
                                </div>
                            </div>
                            <div className={styles.skillTags}>
                                {c.skills.slice(0, 3).map(s => <span key={s}>{s}</span>)}
                            </div>
                            {/* Stats Footer — Vendors style */}
                            <div className={styles.candidateFooter}>
                                <div className={styles.candidateStat}>
                                    <strong>{c.projects}</strong>
                                    <span>Projects</span>
                                </div>
                                <div className={styles.candidateStat}>
                                    <strong>{c.score}</strong>
                                    <span>Score</span>
                                </div>
                                <Link href="/dashboard/company/shortlist" className={styles.candidateViewBtn}>
                                    View <ArrowRight size={14} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Jobs — Clean list */}
            <motion.div className={styles.section} initial="hidden" animate="visible" variants={fadeUp} custom={6}>
                <div className={styles.sectionHeader}>
                    <h2>Recent Job Postings</h2>
                </div>
                <div className={styles.recentJobs}>
                    {jobs.slice(0, 4).map((job, i) => (
                        <div key={job._id || job.id || i} className={styles.recentJobRow}>
                            <div className={styles.jobAvatar} style={{ background: '#F0F9FF', color: '#0EA5E9' }}>
                                {job.title?.charAt(0)?.toUpperCase() || 'J'}
                            </div>
                            <div className={styles.jobInfo}>
                                <h4>{job.title}</h4>
                                <p>{job.type} · {job.location} · {job.salary}</p>
                            </div>
                            <div className={styles.recentJobRight}>
                                <span className={styles.applicantBadge}>{job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}</span>
                                <span className={styles.jobDate}>{job.postedDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Post Job Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPostModal(false)}>
                        <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Post New Role</h2>
                                <button className={styles.closeBtn} onClick={() => setShowPostModal(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handlePostJob} className={styles.modalForm}>
                                <div className={styles.formGroup}>
                                    <label>Job Title *</label>
                                    <input type="text" required placeholder="e.g. Senior React Developer" value={newJob.title} onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))} />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Job Type</label>
                                        <select value={newJob.type} onChange={(e) => setNewJob(prev => ({ ...prev, type: e.target.value }))}>
                                            <option>Full-time</option>
                                            <option>Internship</option>
                                            <option>Contract</option>
                                            <option>Part-time</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Location *</label>
                                        <input type="text" required placeholder="e.g. Mumbai, Remote" value={newJob.location} onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))} />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Salary Range *</label>
                                    <input type="text" required placeholder="e.g. ₹15-20 LPA" value={newJob.salary} onChange={(e) => setNewJob(prev => ({ ...prev, salary: e.target.value }))} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description *</label>
                                    <textarea required rows={3} placeholder="Describe the role responsibilities..." value={newJob.description} onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Required Skills (comma separated)</label>
                                    <input type="text" placeholder="e.g. React, Node.js, TypeScript" value={newJob.skills} onChange={(e) => setNewJob(prev => ({ ...prev, skills: e.target.value }))} />
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowPostModal(false)}>Cancel</button>
                                    <button type="submit" className={styles.submitBtn}><Plus size={16} /> Post Role</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
