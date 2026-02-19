'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Search, Filter, ArrowRight, X, Mail, MapPin, Star, CheckCircle, Clock, Send } from 'lucide-react';
import { useData } from '@/context/DataContext';
import styles from './shortlist.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };
const statuses = ['All', 'New', 'Interview Scheduled', 'Offer Sent'];

export default function ShortlistPage() {
    const { shortlist, removeShortlist, updateShortlistStatus } = useData();
    const [statusFilter, setStatusFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const filteredCandidates = shortlist.filter(c => {
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchSearch = c.candidateName.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return { bg: '#EFF6FF', color: '#2563EB' };
            case 'Interview Scheduled': return { bg: '#FFFBEB', color: '#D97706' };
            case 'Offer Sent': return { bg: '#ECFDF5', color: '#059669' };
            default: return { bg: '#F2F4F7', color: '#667085' };
        }
    };

    const handleRemove = (id) => {
        removeShortlist(id);
        if (selectedCandidate?.id === id) setSelectedCandidate(null);
    };

    return (
        <div className={styles.container}>
            {/* Banner */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1>Shortlisted Candidates 🎯</h1>
                    <p>Manage your talent pipeline — {shortlist.length} candidate{shortlist.length !== 1 ? 's' : ''} shortlisted.</p>
                </div>
            </motion.div>

            {/* Status Counts */}
            <div className={styles.statusCounts}>
                {statuses.map(s => {
                    const count = s === 'All' ? shortlist.length : shortlist.filter(c => c.status === s).length;
                    return (
                        <button key={s} className={`${styles.statusBtn} ${statusFilter === s ? styles.statusBtnActive : ''}`} onClick={() => setStatusFilter(s)}>
                            {s} <span className={styles.countBadge}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className={styles.searchBar}>
                <Search size={18} />
                <input type="text" placeholder="Search by name or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* Candidate List */}
            <div className={styles.candidateList}>
                {filteredCandidates.map((c, i) => {
                    const statusColor = getStatusColor(c.status);
                    return (
                        <motion.div key={c.id} className={styles.candidateCard} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                            <img src={c.image} alt={c.candidateName} className={styles.avatar} />
                            <div className={styles.candidateInfo}>
                                <h4>{c.candidateName}</h4>
                                <p className={styles.role}>{c.role}</p>
                                <div className={styles.meta}>
                                    <span className={styles.scoreBadge}><Star size={12} /> {c.score}</span>
                                    <span><MapPin size={12} /> {c.location}</span>
                                    <span><Clock size={12} /> {c.shortlistedDate}</span>
                                </div>
                                <div className={styles.skills}>
                                    {c.skills.map(s => <span key={s}>{s}</span>)}
                                </div>
                            </div>
                            <div className={styles.candidateActions}>
                                <span className={styles.statusBadge} style={{ background: statusColor.bg, color: statusColor.color }}>{c.status}</span>
                                <select className={styles.statusSelect} value={c.status} onChange={(e) => updateShortlistStatus(c.id, e.target.value)}>
                                    <option value="New">New</option>
                                    <option value="Interview Scheduled">Interview Scheduled</option>
                                    <option value="Offer Sent">Offer Sent</option>
                                </select>
                                <button className={styles.removeBtn} onClick={() => handleRemove(c.id)} title="Remove from shortlist">
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredCandidates.length === 0 && (
                <div className={styles.empty}>
                    <Bookmark size={48} />
                    <h3>No candidates found</h3>
                    <p>Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    );
}
