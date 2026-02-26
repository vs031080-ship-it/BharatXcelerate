'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, MapPin, UserPlus, CheckCircle, Award, TrendingUp } from 'lucide-react';
import { useData } from '@/context/DataContext';
import styles from './talent.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };

const LEVELS = ['', 'beginner', 'intermediate', 'advanced'];
const MIN_SCORES = [0, 40, 50, 60, 70, 80, 90];

export default function TalentSearchPage() {
    const { shortlist, shortlistCandidate } = useData();
    const [candidates, setCandidates] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');
    const [filters, setFilters] = useState({ search: '', skill: '', level: '', minScore: 0 });

    const shortlistedIds = shortlist.map(s => s.candidateId);

    // Fetch skill categories for the filter
    useEffect(() => {
        fetch('/api/admin/skills')
            .then(r => r.json())
            .then(d => setSkills(d.categories || []))
            .catch(() => { });
    }, []);

    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.skill) params.set('skill', filters.skill);
        if (filters.level) params.set('level', filters.level);
        if (filters.minScore > 0) params.set('minScore', filters.minScore);
        try {
            const res = await fetch('/api/company/talent?' + params);
            const data = await res.json();
            setCandidates(data.candidates || []);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const t = setTimeout(fetchCandidates, 300);
        return () => clearTimeout(t);
    }, [fetchCandidates]);

    const handleShortlist = (candidate) => {
        if (!shortlistedIds.includes(candidate._id)) {
            shortlistCandidate({ candidateId: candidate._id, candidateName: candidate.name, ...candidate });
            setToast(`${candidate.name} added to shortlist!`);
            setTimeout(() => setToast(''), 3000);
        }
    };

    return (
        <div className={styles.container}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <CheckCircle size={18} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Banner */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1>Find Talent 🔍</h1>
                    <p>Filter verified candidates by skill, test level, and minimum MCQ score.</p>
                </div>
            </motion.div>

            {/* Search & Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchInput}>
                    <Search size={18} />
                    <input type="text" placeholder="Search by name or skill..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
                </div>
                <div className={styles.filters}>
                    <select className={styles.filterSelect} value={filters.skill} onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))}>
                        <option value="">All Skills</option>
                        {skills.map(s => <option key={s.slug} value={s.name}>{s.icon} {s.name}</option>)}
                    </select>
                    <select className={styles.filterSelect} value={filters.level} onChange={e => setFilters(f => ({ ...f, level: e.target.value }))}>
                        <option value="">All Levels</option>
                        {LEVELS.slice(1).map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                    </select>
                    <select className={styles.filterSelect} value={filters.minScore} onChange={e => setFilters(f => ({ ...f, minScore: Number(e.target.value) }))}>
                        <option value={0}>Min Score: Any</option>
                        {MIN_SCORES.slice(1).map(s => <option key={s} value={s}>{s}+</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading candidates...</div>
            ) : (
                <>
                    <div className={styles.candidateGrid}>
                        {candidates.map((c, i) => {
                            const isShortlisted = shortlistedIds.includes(c._id);
                            return (
                                <motion.div key={c._id} className={styles.candidateCard} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                                    <div className={styles.cardHeader}>
                                        {c.overallAverage > 0 && (
                                            <div className={styles.scoreBadge}><TrendingUp size={12} /> {c.overallAverage}% avg</div>
                                        )}
                                    </div>
                                    <div className={styles.cardBody}>
                                        <img src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6366f1&color=fff&size=80`} alt={c.name} className={styles.avatar} />
                                        <h4>{c.name}</h4>
                                        <p className={styles.role}>{c.bio?.slice(0, 60) || 'Student'}</p>
                                        <div className={styles.meta}>
                                            <span><MapPin size={12} /> {c.location || 'India'}</span>
                                        </div>

                                        {/* Earned Badges */}
                                        {c.earnedBadges?.length > 0 && (
                                            <div className={styles.badgesRow}>
                                                {c.earnedBadges.slice(0, 3).map(badge => (
                                                    <span key={badge} className={styles.badge} title={badge}>🏅 {badge.split('—')[0]?.trim()}</span>
                                                ))}
                                                {c.earnedBadges.length > 3 && <span className={styles.badgeMore}>+{c.earnedBadges.length - 3}</span>}
                                            </div>
                                        )}

                                        {/* Per-skill scores */}
                                        {c.skillScores?.slice(0, 3).map(r => (
                                            <div key={r.skill + r.level} className={styles.skillRow}>
                                                <span className={styles.skillName}>{r.skill}</span>
                                                <span className={styles.skillLevel}>{r.level}</span>
                                                <div className={styles.skillBarWrap}>
                                                    <div className={styles.skillBar} style={{ width: r.score + '%', background: r.score >= 40 ? '#10b981' : '#f59e0b' }} />
                                                </div>
                                                <span className={styles.skillScore}>{r.score}</span>
                                            </div>
                                        ))}

                                        {c.skillScores?.length === 0 && (
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0 0' }}>No MCQ test results yet</p>
                                        )}
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={`${styles.shortlistBtn} ${isShortlisted ? styles.shortlisted : ''}`}
                                            onClick={() => handleShortlist(c)}
                                            disabled={isShortlisted}
                                        >
                                            {isShortlisted ? <><CheckCircle size={14} /> Shortlisted</> : <><UserPlus size={14} /> Shortlist</>}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {candidates.length === 0 && (
                        <div className={styles.empty}>
                            <Search size={48} />
                            <h3>No candidates found</h3>
                            <p>Try adjusting your skill, level, or score filter.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
