'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Star, MapPin, UserPlus, CheckCircle, Award,
    TrendingUp, Filter, X, ChevronRight, BarChart2,
    Layers, Mail, Bookmark, BookmarkCheck, Users
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import styles from './talent.module.css';

const LEVELS       = ['beginner', 'intermediate', 'advanced'];
const MIN_SCORES   = [40, 50, 60, 70, 80, 90];
const LEVEL_META   = {
    beginner:     { label: 'Beginner',     color: '#10B981', bg: '#D1FAE5' },
    intermediate: { label: 'Intermediate', color: '#F59E0B', bg: '#FEF3C7' },
    advanced:     { label: 'Advanced',     color: '#EF4444', bg: '#FEE2E2' },
};

export default function TalentSearchPage() {
    const { shortlist, shortlistCandidate } = useData();
    const [candidates, setCandidates]       = useState([]);
    const [skills, setSkills]               = useState([]);
    const [loading, setLoading]             = useState(true);
    const [toast, setToast]                 = useState('');
    const [search, setSearch]               = useState('');
    const [levelFilters, setLevelFilters]   = useState([]);
    const [minScore, setMinScore]           = useState(0);
    const [skillFilter, setSkillFilter]     = useState('');
    const [selected, setSelected]           = useState(null);
    const [activeTab, setActiveTab]         = useState('all'); // 'all' | 'shortlisted'
    const [saved, setSaved]                 = useState({});

    const shortlistedIds = shortlist.map(s => s.candidateId);

    useEffect(() => {
        fetch('/api/admin/skills')
            .then(r => r.json())
            .then(d => setSkills(d.categories || []))
            .catch(() => {});
    }, []);

    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search)      params.set('search', search);
        if (skillFilter) params.set('skill', skillFilter);
        if (levelFilters.length === 1) params.set('level', levelFilters[0]);
        if (minScore > 0)  params.set('minScore', minScore);
        try {
            const res  = await fetch('/api/company/talent?' + params);
            const data = await res.json();
            setCandidates(data.candidates || []);
        } finally {
            setLoading(false);
        }
    }, [search, skillFilter, levelFilters, minScore]);

    useEffect(() => {
        const t = setTimeout(fetchCandidates, 350);
        return () => clearTimeout(t);
    }, [fetchCandidates]);

    const toggleLevel = l => setLevelFilters(f => f.includes(l) ? f.filter(x => x !== l) : [...f, l]);
    const toggleSave  = id => setSaved(s => ({ ...s, [id]: !s[id] }));

    const handleShortlist = (c) => {
        if (!shortlistedIds.includes(c._id)) {
            shortlistCandidate({ candidateId: c._id, candidateName: c.name, ...c });
            setToast(`${c.name} added to shortlist!`);
            setTimeout(() => setToast(''), 3000);
        }
    };

    const displayed = activeTab === 'shortlisted'
        ? candidates.filter(c => shortlistedIds.includes(c._id))
        : candidates;

    const effectiveSelected = selected && displayed.find(c => c._id === selected._id)
        ? selected : displayed[0] || null;

    return (
        <div className={styles.page}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <CheckCircle size={14} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top bar */}
            <div className={styles.topBar}>
                <div>
                    <h1 className={styles.pageTitle}>Find Talent</h1>
                    <p className={styles.pageSub}>Filter verified candidates by skill, level, and MCQ score</p>
                </div>
                <div className={styles.topStats}>
                    <div className={styles.topStat}><span>{candidates.length}</span><span>Matched</span></div>
                    <div className={styles.topStat}><span style={{ color: '#10B981' }}>{shortlist.length}</span><span>Shortlisted</span></div>
                </div>
            </div>

            {/* Search bar */}
            <div className={styles.searchBar}>
                <Search size={15} color="#9CA3AF" />
                <input
                    type="text"
                    placeholder="Search by name or skill..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {search && <button onClick={() => setSearch('')}><X size={13} /></button>}
            </div>

            <div className={styles.body}>
                {/* ── Sidebar ── */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHead}>
                        <Filter size={14} color="#6B7280" /> <span>Filters</span>
                        {(levelFilters.length > 0 || skillFilter || minScore > 0) && (
                            <button className={styles.clearAll} onClick={() => { setLevelFilters([]); setSkillFilter(''); setMinScore(0); }}>
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Skill category */}
                    <div className={styles.filterGroup}>
                        <div className={styles.filterGroupTitle}>Skill</div>
                        <select
                            className={styles.selectFilter}
                            value={skillFilter}
                            onChange={e => setSkillFilter(e.target.value)}
                        >
                            <option value="">All Skills</option>
                            {skills.map(s => <option key={s.slug} value={s.name}>{s.icon} {s.name}</option>)}
                        </select>
                    </div>

                    {/* Level checkboxes */}
                    <div className={styles.filterGroup}>
                        <div className={styles.filterGroupTitle}>Level</div>
                        {LEVELS.map(l => {
                            const lm = LEVEL_META[l];
                            return (
                                <label key={l} className={styles.filterCheck}>
                                    <input type="checkbox" checked={levelFilters.includes(l)} onChange={() => toggleLevel(l)} />
                                    <span className={styles.levelDot} style={{ background: lm.color }} />
                                    <span>{lm.label}</span>
                                    {levelFilters.includes(l) && <CheckCircle size={13} color={lm.color} className={styles.checkIcon} />}
                                </label>
                            );
                        })}
                    </div>

                    {/* Min score */}
                    <div className={styles.filterGroup}>
                        <div className={styles.filterGroupTitle}>Min Score</div>
                        <div className={styles.scoreOptions}>
                            <label className={styles.filterCheck}>
                                <input type="radio" name="minScore" checked={minScore === 0} onChange={() => setMinScore(0)} />
                                <span>Any</span>
                            </label>
                            {MIN_SCORES.map(s => (
                                <label key={s} className={styles.filterCheck}>
                                    <input type="radio" name="minScore" checked={minScore === s} onChange={() => setMinScore(s)} />
                                    <span>{s}+</span>
                                    {minScore === s && <CheckCircle size={13} color="#4F46E5" className={styles.checkIcon} />}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── Center column ── */}
                <div className={styles.centerCol}>
                    {/* Tabs */}
                    <div className={styles.tabRow}>
                        {[
                            { key: 'all',         label: 'All Candidates',  count: candidates.length },
                            { key: 'shortlisted', label: 'Shortlisted',     count: shortlist.length },
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

                    {/* Candidates */}
                    {loading ? (
                        <div className={styles.loadingMsg}>
                            <div className={styles.spinner} /> Loading candidates...
                        </div>
                    ) : displayed.length === 0 ? (
                        <div className={styles.empty}>
                            <Search size={40} color="#E5E7EB" strokeWidth={1.2} />
                            <h3>No candidates found</h3>
                            <p>Try adjusting your filters or search term</p>
                        </div>
                    ) : (
                        <div className={styles.candidateList}>
                            {displayed.map((c, i) => {
                                const isShortlisted = shortlistedIds.includes(c._id);
                                const isSaved       = saved[c._id];
                                const isActive      = effectiveSelected?._id === c._id;
                                const scoreColor    = c.overallAverage >= 70 ? '#10B981' : c.overallAverage >= 40 ? '#F59E0B' : '#9CA3AF';

                                return (
                                    <motion.div
                                        key={c._id}
                                        className={`${styles.candidateRow} ${isActive ? styles.candidateRowActive : ''}`}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => setSelected(c)}
                                    >
                                        <div className={styles.rowLeft}>
                                            <img
                                                src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6366f1&color=fff&size=80`}
                                                alt={c.name}
                                                className={styles.rowAvatar}
                                            />
                                            <div className={styles.rowInfo}>
                                                <div className={styles.rowNameLine}>
                                                    <span className={styles.rowName}>{c.name}</span>
                                                    {isShortlisted && <span className={styles.shortlistedChip}><CheckCircle size={10} /> Shortlisted</span>}
                                                </div>
                                                <div className={styles.rowBio}>{c.bio?.slice(0, 55) || 'Student'}{c.bio?.length > 55 ? '...' : ''}</div>
                                                <div className={styles.rowMeta}>
                                                    <span><MapPin size={11} /> {c.location || 'India'}</span>
                                                    <span><Award size={11} /> {c.earnedBadges?.length || 0} badges</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.rowRight}>
                                            <div className={styles.avgScore} style={{ color: scoreColor }}>
                                                {c.overallAverage > 0 ? `${c.overallAverage}%` : '—'}
                                                <span>avg</span>
                                            </div>
                                            <button
                                                className={styles.saveBtn}
                                                onClick={e => { e.stopPropagation(); toggleSave(c._id); }}
                                            >
                                                {isSaved ? <BookmarkCheck size={15} color="#4F46E5" /> : <Bookmark size={15} />}
                                            </button>
                                            <button
                                                className={`${styles.shortlistBtn} ${isShortlisted ? styles.shortlisted : ''}`}
                                                onClick={e => { e.stopPropagation(); handleShortlist(c); }}
                                                disabled={isShortlisted}
                                            >
                                                {isShortlisted ? <><CheckCircle size={13} /> Shortlisted</> : <><UserPlus size={13} /> Shortlist</>}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Right: Candidate Detail Panel ── */}
                <aside className={styles.detailPanel}>
                    {!effectiveSelected ? (
                        <div className={styles.detailEmpty}>
                            <Users size={36} color="#E5E7EB" strokeWidth={1.2} />
                            <p>Select a candidate to see full profile</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={effectiveSelected._id}
                                className={styles.detailContent}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Profile header */}
                                <div className={styles.profileHead}>
                                    <img
                                        src={effectiveSelected.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(effectiveSelected.name)}&background=6366f1&color=fff&size=160`}
                                        alt={effectiveSelected.name}
                                        className={styles.profileAvatar}
                                    />
                                    <div className={styles.profileName}>{effectiveSelected.name}</div>
                                    <div className={styles.profileBio}>{effectiveSelected.bio || 'Student'}</div>
                                    <div className={styles.profileMeta}>
                                        <span><MapPin size={12} /> {effectiveSelected.location || 'India'}</span>
                                    </div>
                                </div>

                                {/* Score ring + badges */}
                                <div className={styles.scoreSection}>
                                    <div className={styles.scorePill}>
                                        <TrendingUp size={14} color={effectiveSelected.overallAverage >= 70 ? '#10B981' : '#F59E0B'} />
                                        <span style={{ color: effectiveSelected.overallAverage >= 70 ? '#10B981' : '#F59E0B', fontWeight: 800 }}>
                                            {effectiveSelected.overallAverage || 0}%
                                        </span>
                                        <span>overall avg</span>
                                    </div>
                                </div>

                                {/* Earned badges */}
                                {effectiveSelected.earnedBadges?.length > 0 && (
                                    <div className={styles.detailSection}>
                                        <div className={styles.detailSectionTitle}><Award size={12} /> Badges</div>
                                        <div className={styles.badgeList}>
                                            {effectiveSelected.earnedBadges.map(b => (
                                                <span key={b} className={styles.badgeChip}>🏅 {b.split('—')[0]?.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skill scores */}
                                <div className={styles.detailSection}>
                                    <div className={styles.detailSectionTitle}><BarChart2 size={12} /> Skill Scores</div>
                                    {effectiveSelected.skillScores?.length > 0 ? (
                                        effectiveSelected.skillScores.map(r => {
                                            const lm = LEVEL_META[r.level] || LEVEL_META.beginner;
                                            const sc = r.score >= 70 ? '#10B981' : r.score >= 40 ? '#F59E0B' : '#EF4444';
                                            return (
                                                <div key={r.skill + r.level} className={styles.skillRow}>
                                                    <div className={styles.skillRowTop}>
                                                        <span className={styles.skillName}>{r.skill}</span>
                                                        <span className={styles.skillLevelPill} style={{ background: lm.bg, color: lm.color }}>{lm.label}</span>
                                                        <span className={styles.skillScore} style={{ color: sc }}>{r.score}/100</span>
                                                    </div>
                                                    <div className={styles.skillBarTrack}>
                                                        <div className={styles.skillBarFill} style={{ width: `${r.score}%`, background: sc }} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : <p className={styles.noData}>No MCQ results yet</p>}
                                </div>

                                {/* Skills tags */}
                                {effectiveSelected.skills?.length > 0 && (
                                    <div className={styles.detailSection}>
                                        <div className={styles.detailSectionTitle}><Layers size={12} /> Skills</div>
                                        <div className={styles.skillTags}>
                                            {effectiveSelected.skills.map(s => <span key={s} className={styles.skillTag}>{s}</span>)}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className={styles.detailActions}>
                                    <button
                                        className={`${styles.shortlistBigBtn} ${shortlistedIds.includes(effectiveSelected._id) ? styles.shortlistedBig : ''}`}
                                        onClick={() => handleShortlist(effectiveSelected)}
                                        disabled={shortlistedIds.includes(effectiveSelected._id)}
                                    >
                                        {shortlistedIds.includes(effectiveSelected._id)
                                            ? <><CheckCircle size={15} /> Shortlisted</>
                                            : <><UserPlus size={15} /> Add to Shortlist</>
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
