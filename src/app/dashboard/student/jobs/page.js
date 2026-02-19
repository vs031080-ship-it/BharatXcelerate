'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, MapPin, Clock, DollarSign, Building2, ArrowRight, CheckCircle, Filter, Zap, X } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import styles from './jobs.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };

const jobTypes = ['All Types', 'Full-time', 'Internship', 'Contract', 'Part-time'];
const locations = ['All Locations', 'Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Remote'];

export default function StudentJobsPage() {
    const { jobs, applications, applyToJob, revokeApplication } = useData();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [locationFilter, setLocationFilter] = useState('All Locations');
    const [selectedJob, setSelectedJob] = useState(null);

    const appliedJobIds = applications.map(a => a.jobId);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase()) || job.description.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'All Types' || job.type === typeFilter;
        const matchesLocation = locationFilter === 'All Locations' || job.location === locationFilter;
        return matchesSearch && matchesType && matchesLocation;
    });

    const handleApply = async (jobId) => {
        if (appliedJobIds.includes(jobId)) {
            if (window.confirm('Are you sure you want to withdraw your application?')) {
                await revokeApplication(jobId, user?.name);
            }
        } else {
            await applyToJob(jobId, user?.name || 'Student');
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Banner */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.bannerContent}>
                    <div className={styles.bannerIcon}><Briefcase size={28} /></div>
                    <div>
                        <h1>Jobs Board 💼</h1>
                        <p>Discover {jobs.length} open positions from top companies. Apply with your verified scorecard.</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className={styles.statsRow}>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#2563EB' }}><Briefcase size={20} /></div>
                    <div><span className={styles.statValue}>{jobs.length}</span><span className={styles.statLabel}>Open Jobs</span></div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    <div className={styles.statIcon} style={{ background: '#D1FAE5', color: '#059669' }}><CheckCircle size={20} /></div>
                    <div><span className={styles.statValue}>{applications.length}</span><span className={styles.statLabel}>Applied</span></div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <div className={styles.statIcon} style={{ background: '#FEF3C7', color: '#D97706' }}><Building2 size={20} /></div>
                    <div><span className={styles.statValue}>{new Set(jobs.map(j => j.company)).size}</span><span className={styles.statLabel}>Companies</span></div>
                </motion.div>
            </div>

            {/* Filter Bar */}
            <motion.div className={styles.filterBar} initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <div className={styles.searchInput}>
                    <Search size={18} />
                    <input type="text" placeholder="Search jobs by title, company, or keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className={styles.filters}>
                    <select className={styles.filterSelect} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select className={styles.filterSelect} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
            </motion.div>

            {/* Job Listings */}
            <div className={styles.jobList}>
                {filteredJobs.map((job, i) => {
                    const jobId = job.id || job._id;
                    const isApplied = appliedJobIds.includes(jobId);
                    return (
                        <motion.div key={jobId} className={styles.jobCard} initial="hidden" animate="visible" variants={fadeUp} custom={i + 4}>
                            <div className={styles.jobCardLeft}>
                                <div className={styles.companyBadge}>
                                    <Building2 size={20} />
                                </div>
                                <div className={styles.jobInfo}>
                                    <h3>{job.title}</h3>
                                    <p className={styles.companyName}>{job.company}</p>
                                    <div className={styles.jobMeta}>
                                        <span><Briefcase size={13} /> {job.type}</span>
                                        <span><MapPin size={13} /> {job.location}</span>
                                        <span><DollarSign size={13} /> {job.salary}</span>
                                        <span><Clock size={13} /> {job.postedDate}</span>
                                    </div>
                                    <div className={styles.jobSkills}>
                                        {job.skills.map(s => <span key={s}>{s}</span>)}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.jobCardRight}>
                                <div className={styles.applicantCount}>
                                    {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
                                </div>
                                <button
                                    className={`${styles.applyBtn} ${isApplied ? styles.appliedBtn : ''}`}
                                    onClick={() => handleApply(jobId)}
                                >
                                    {isApplied ? <><X size={16} /> Withdraw</> : <>Apply Now <ArrowRight size={16} /></>}
                                </button>
                                <button className={styles.detailsBtn} onClick={() => setSelectedJob(job)}>
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredJobs.length === 0 && (
                <div className={styles.empty}>
                    <Briefcase size={48} />
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}

            {/* Job Detail Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedJob(null)}>
                        <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <div>
                                    <h2>{selectedJob.title}</h2>
                                    <p>{selectedJob.company}</p>
                                </div>
                                <button className={styles.closeBtn} onClick={() => setSelectedJob(null)}><X size={20} /></button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.modalMeta}>
                                    <span><Briefcase size={14} /> {selectedJob.type}</span>
                                    <span><MapPin size={14} /> {selectedJob.location}</span>
                                    <span><DollarSign size={14} /> {selectedJob.salary}</span>
                                    <span><Clock size={14} /> Posted {selectedJob.postedDate}</span>
                                </div>
                                <h4>Description</h4>
                                <p className={styles.modalDesc}>{selectedJob.description}</p>
                                <h4>Required Skills</h4>
                                <div className={styles.modalSkills}>
                                    {selectedJob.skills.map(s => <span key={s}>{s}</span>)}
                                </div>
                                <div className={styles.modalFooter}>
                                    <span>{selectedJob.applicants.length} applicant{selectedJob.applicants.length !== 1 ? 's' : ''}</span>
                                    <button
                                        className={`${styles.applyBtn} ${appliedJobIds.includes(selectedJob.id) ? styles.appliedBtn : ''}`}
                                        onClick={() => handleApply(selectedJob.id)}
                                        disabled={appliedJobIds.includes(selectedJob.id)}
                                    >
                                        {appliedJobIds.includes(selectedJob.id) ? <><CheckCircle size={16} /> Applied</> : <>Apply Now <ArrowRight size={16} /></>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
