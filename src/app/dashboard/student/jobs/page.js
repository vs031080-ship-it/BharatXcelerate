'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Search, MapPin, Clock, DollarSign,
    Building2, ArrowRight, CheckCircle, X, Bookmark,
    BookmarkCheck, Filter, ChevronRight, Users, Zap
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import styles from './jobs.module.css';

const jobTypes    = ['Full-time', 'Internship', 'Contract', 'Part-time'];
const locations   = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Remote'];

export default function StudentJobsPage() {
    const { jobs, applications, applyToJob, revokeApplication, loading } = useData();
    const { user } = useAuth();

    const [search, setSearch]             = useState('');
    const [typeFilters, setTypeFilters]   = useState([]);
    const [locFilters, setLocFilters]     = useState([]);
    const [activeTab, setActiveTab]       = useState('all');   // 'all' | 'applied' | 'recent'
    const [selectedJob, setSelectedJob]   = useState(null);
    const [saved, setSaved]               = useState({});

    const appliedJobIds = (applications || []).map(a => a.jobId);

    // Toggle filter helpers
    const toggleType = t => setTypeFilters(f => f.includes(t) ? f.filter(x => x !== t) : [...f, t]);
    const toggleLoc  = l => setLocFilters(f => f.includes(l) ? f.filter(x => x !== l) : [...f, l]);

    const filtered = (jobs || []).filter(job => {
        const matchSearch = !search ||
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.company.toLowerCase().includes(search.toLowerCase()) ||
            (job.description || '').toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilters.length === 0 || typeFilters.includes(job.type);
        const matchLoc  = locFilters.length  === 0 || locFilters.includes(job.location);
        return matchSearch && matchType && matchLoc;
    });

    const tabFiltered = activeTab === 'applied'
        ? filtered.filter(j => appliedJobIds.includes(j.id || j._id))
        : activeTab === 'recent'
        ? [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
        : filtered;

    const effectiveSelected = selectedJob && tabFiltered.find(j => (j.id || j._id) === (selectedJob.id || selectedJob._id))
        ? selectedJob : tabFiltered[0] || null;

    const handleApply = async (jobId) => {
        if (appliedJobIds.includes(jobId)) {
            if (window.confirm('Withdraw your application?')) await revokeApplication(jobId, user?.name);
        } else {
            await applyToJob(jobId, user?.name || 'Student');
        }
    };

    const toggleSave = (id) => setSaved(s => ({ ...s, [id]: !s[id] }));

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} /><span>Loading Jobs...</span>
        </div>
    );

    return (
        <div className={styles.page}>
            {/* ── Top bar ── */}
            <div className={styles.topBar}>
                <div>
                    <h1 className={styles.pageTitle}>Search for jobs</h1>
                    <p className={styles.pageSub}>{jobs.length} open positions from top companies</p>
                </div>
                <div className={styles.topStats}>
                    <div className={styles.topStat}><span>{jobs.length}</span><span>Open</span></div>
                    <div className={styles.topStat}><span style={{ color: '#10B981' }}>{applications.length}</span><span>Applied</span></div>
                    <div className={styles.topStat}><span>{new Set((jobs || []).map(j => j.company)).size}</span><span>Companies</span></div>
                </div>
            </div>

            {/* ── Search bar ── */}
            <div className={styles.searchBar}>
                <Search size={15} color="#9CA3AF" />
                <input
                    type="text"
                    placeholder="Search by title, company, or keyword..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {search && <button onClick={() => setSearch('')}><X size={13} /></button>}
            </div>

            <div className={styles.body}>
                {/* ── LEFT: Filter sidebar ── */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHead}>
                        <Filter size={14} color="#6B7280" /> <span>Filter</span>
                        {(typeFilters.length > 0 || locFilters.length > 0) && (
                            <button className={styles.clearAll} onClick={() => { setTypeFilters([]); setLocFilters([]); }}>Clear all</button>
                        )}
                    </div>

                    {/* Job Type */}
                    <div className={styles.filterGroup}>
                        <div className={styles.filterGroupTitle}>Job Type</div>
                        {jobTypes.map(t => (
                            <label key={t} className={styles.filterCheck}>
                                <input type="checkbox" checked={typeFilters.includes(t)} onChange={() => toggleType(t)} />
                                <span>{t}</span>
                                {typeFilters.includes(t) && <CheckCircle size={13} color="#4F46E5" className={styles.checkIcon} />}
                            </label>
                        ))}
                    </div>

                    {/* Location */}
                    <div className={styles.filterGroup}>
                        <div className={styles.filterGroupTitle}>Location</div>
                        {locations.map(l => (
                            <label key={l} className={styles.filterCheck}>
                                <input type="checkbox" checked={locFilters.includes(l)} onChange={() => toggleLoc(l)} />
                                <span><MapPin size={11} /> {l}</span>
                                {locFilters.includes(l) && <CheckCircle size={13} color="#4F46E5" className={styles.checkIcon} />}
                            </label>
                        ))}
                    </div>
                </aside>

                {/* ── CENTER: Job List ── */}
                <div className={styles.centerCol}>
                    {/* Tabs */}
                    <div className={styles.tabRow}>
                        {[
                            { key: 'all',     label: 'Browse all',  count: filtered.length },
                            { key: 'applied', label: 'Applied',     count: applications.length },
                            { key: 'recent',  label: 'Recent',      count: Math.min(filtered.length, 10) },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                                <span className={styles.tabCount}>{tab.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    {tabFiltered.length === 0 ? (
                        <div className={styles.empty}>
                            <Briefcase size={40} color="#E5E7EB" strokeWidth={1.2} />
                            <h3>No jobs found</h3>
                            <p>{search ? `No results for "${search}"` : 'Try adjusting your filters'}</p>
                        </div>
                    ) : (
                        <div className={styles.jobList}>
                            {tabFiltered.map((job, i) => {
                                const jobId    = job.id || job._id;
                                const isApplied = appliedJobIds.includes(jobId);
                                const isSaved   = saved[jobId];
                                const isActive  = effectiveSelected && (effectiveSelected.id || effectiveSelected._id) === jobId;

                                return (
                                    <motion.div
                                        key={jobId}
                                        className={`${styles.jobRow} ${isActive ? styles.jobRowActive : ''}`}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        <div className={styles.jobRowLeft}>
                                            <div className={styles.companyLogo}>
                                                <Building2 size={18} color="#4F46E5" />
                                            </div>
                                            <div className={styles.jobInfo}>
                                                <div className={styles.companyRow}>
                                                    <span className={styles.companyName}>{job.company}</span>
                                                    {isApplied && <span className={styles.appliedChip}><CheckCircle size={10} /> Applied</span>}
                                                </div>
                                                <div className={styles.jobTitle}>{job.title}</div>
                                                <div className={styles.jobMeta}>
                                                    <span><MapPin size={11} /> {job.location}</span>
                                                    <span><Briefcase size={11} /> {job.type}</span>
                                                    <span><DollarSign size={11} /> {job.salary}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.jobRowRight}>
                                            <span className={styles.postedTag}>
                                                <Clock size={10} /> {job.postedDate || new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <button
                                                className={styles.saveBtn}
                                                onClick={e => { e.stopPropagation(); toggleSave(jobId); }}
                                                title={isSaved ? 'Unsave' : 'Save'}
                                            >
                                                {isSaved ? <BookmarkCheck size={15} color="#4F46E5" /> : <Bookmark size={15} />}
                                            </button>
                                            <button
                                                className={`${styles.applyBtn} ${isApplied ? styles.appliedBtn : ''}`}
                                                onClick={e => { e.stopPropagation(); handleApply(jobId); }}
                                            >
                                                {isApplied ? 'Withdraw' : 'Apply'}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Job Detail Panel ── */}
                <aside className={styles.detailPanel}>
                    {!effectiveSelected ? (
                        <div className={styles.detailEmpty}>
                            <Briefcase size={36} color="#E5E7EB" strokeWidth={1.2} />
                            <p>Select a job to see details</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={effectiveSelected.id || effectiveSelected._id}
                                className={styles.detailContent}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Company header */}
                                <div className={styles.detailCompanyRow}>
                                    <div className={styles.detailLogo}><Building2 size={22} color="#4F46E5" /></div>
                                    <div>
                                        <div className={styles.detailCompany}>{effectiveSelected.company}</div>
                                        <div className={styles.detailCompanyType}>{new Set((jobs||[]).filter(j=>j.company===effectiveSelected.company).map(j=>j.type)).size} position(s)</div>
                                    </div>
                                </div>

                                <h2 className={styles.detailTitle}>{effectiveSelected.title}</h2>

                                <div className={styles.detailChips}>
                                    <span className={styles.detailChip}><MapPin size={12} /> {effectiveSelected.location}</span>
                                    <span className={styles.detailChip}><Briefcase size={12} /> {effectiveSelected.type}</span>
                                    <span className={styles.detailChip}><DollarSign size={12} /> {effectiveSelected.salary}</span>
                                    <span className={styles.detailChip}><Users size={12} /> {effectiveSelected.applicants?.length || 0} applicants</span>
                                </div>

                                <div className={styles.detailSection}>
                                    <div className={styles.detailSectionTitle}>About Role</div>
                                    <p className={styles.detailDesc}>{effectiveSelected.description}</p>
                                </div>

                                {effectiveSelected.skills?.length > 0 && (
                                    <div className={styles.detailSection}>
                                        <div className={styles.detailSectionTitle}><Zap size={13} /> Required Skills</div>
                                        <div className={styles.skillTags}>
                                            {effectiveSelected.skills.map(s => (
                                                <span key={s} className={styles.skillTag}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.detailPosted}>
                                    <Clock size={12} />
                                    Posted {effectiveSelected.postedDate || new Date(effectiveSelected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>

                                <div className={styles.detailActions}>
                                    <button
                                        className={`${styles.applyBigBtn} ${appliedJobIds.includes(effectiveSelected.id || effectiveSelected._id) ? styles.withdrawBigBtn : ''}`}
                                        onClick={() => handleApply(effectiveSelected.id || effectiveSelected._id)}
                                    >
                                        {appliedJobIds.includes(effectiveSelected.id || effectiveSelected._id)
                                            ? <><X size={15} /> Withdraw Application</>
                                            : <>Apply Now <ArrowRight size={15} /></>
                                        }
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </aside>
            </div>
        </div>
    );
}
