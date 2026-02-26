'use client';
import { useState, useEffect } from 'react';
import {
    Clock, Star, AlertCircle, CheckCircle, Search,
    ChevronRight, BookOpen, Award, Zap, Filter, X, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './exams.module.css';

const LEVELS = ['beginner', 'intermediate', 'advanced'];

const LEVEL_META = {
    beginner:     { label: 'Beginner',     color: '#10B981', bg: '#D1FAE5' },
    intermediate: { label: 'Intermediate', color: '#F59E0B', bg: '#FEF3C7' },
    advanced:     { label: 'Advanced',     color: '#EF4444', bg: '#FEE2E2' },
};

export default function ExamsPage() {
    const [tests, setTests]           = useState([]);
    const [skills, setSkills]         = useState([]);
    const [loading, setLoading]       = useState(true);
    const [filter, setFilter]         = useState({ skill: '', level: '', status: '' });
    const [search, setSearch]         = useState('');
    const [activeTab, setActiveTab]   = useState('all'); // 'all' | 'available' | 'attempted'
    const [enrollModal, setEnrollModal] = useState(null);
    const [enrolling, setEnrolling]   = useState(false);
    const [error, setError]           = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => { fetchData(); }, [filter]);

    async function fetchData() {
        setLoading(true);
        const params = new URLSearchParams();
        if (filter.skill) params.set('skill', filter.skill);
        if (filter.level) params.set('level', filter.level);
        const [testsRes, skillsRes] = await Promise.all([
            fetch('/api/student/exams?' + params),
            fetch('/api/admin/skills'),
        ]);
        const [testsData, skillsData] = await Promise.all([testsRes.json(), skillsRes.json()]);
        setTests(testsData.tests || []);
        setSkills(skillsData.categories || []);
        setLoading(false);
    }

    async function handleEnroll() {
        if (!enrollModal) return;
        setEnrolling(true); setError('');
        try {
            const res = await fetch(`/api/student/exams/${enrollModal._id}/enroll`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Error enrolling'); return; }
            window.location.href = `/dashboard/student/exams/${data.sessionId}`;
        } finally { setEnrolling(false); }
    }

    const attempted = tests.filter(t => t.status === 'completed' || t.status === 'in-progress');
    const available = tests.filter(t => t.status !== 'completed' && t.status !== 'in-progress');

    let tabFiltered = activeTab === 'attempted' ? attempted : activeTab === 'available' ? available : tests;
    if (search) tabFiltered = tabFiltered.filter(t => t.badgeLabel?.toLowerCase().includes(search.toLowerCase()) || t.category?.name?.toLowerCase().includes(search.toLowerCase()));
    if (filter.level) tabFiltered = tabFiltered.filter(t => t.level === filter.level);
    if (filter.skill) tabFiltered = tabFiltered.filter(t => t.category?.slug === filter.skill);

    const hasFilters = filter.skill || filter.level;

    return (
        <div className={styles.page}>
            {/* ── Page Header ── */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Skill Exams</h1>
                    <p className={styles.pageSub}>Appear in tests to earn badges and build your verified scorecard</p>
                </div>
                <div className={styles.headerStats}>
                    <div className={styles.hStat}>
                        <span className={styles.hStatNum}>{tests.length}</span>
                        <span className={styles.hStatLbl}>Total Tests</span>
                    </div>
                    <div className={styles.hStat}>
                        <span className={styles.hStatNum} style={{ color: '#10B981' }}>{attempted.filter(t => t.passed).length}</span>
                        <span className={styles.hStatLbl}>Badges Earned</span>
                    </div>
                    <div className={styles.hStat}>
                        <span className={styles.hStatNum} style={{ color: '#F59E0B' }}>{attempted.length}</span>
                        <span className={styles.hStatLbl}>Attempted</span>
                    </div>
                </div>
            </div>

            {/* ── Toolbar: Tabs + Search + Filters ── */}
            <div className={styles.toolbar}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    {[
                        { key: 'all',       label: 'All Exams',  count: tests.length },
                        { key: 'available', label: 'Available',  count: available.length },
                        { key: 'attempted', label: 'Attempted',  count: attempted.length },
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

                {/* Search */}
                <div className={styles.searchBox}>
                    <Search size={14} color="#9CA3AF" />
                    <input
                        type="text"
                        placeholder="Search exams..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && <button className={styles.clearSearch} onClick={() => setSearch('')}><X size={12} /></button>}
                </div>

                {/* Level filter */}
                <div className={styles.filterChips}>
                    <Filter size={13} color="#6B7280" />
                    {LEVELS.map(l => {
                        const m = LEVEL_META[l];
                        const active = filter.level === l;
                        return (
                            <button
                                key={l}
                                className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                                style={active ? { background: m.bg, color: m.color, borderColor: m.color } : {}}
                                onClick={() => setFilter(f => ({ ...f, level: active ? '' : l }))}
                            >
                                {m.label}
                            </button>
                        );
                    })}
                    {hasFilters && (
                        <button className={styles.clearChip} onClick={() => setFilter({ skill: '', level: '', status: '' })}>
                            <X size={11} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* ── Skill filter pills ── */}
            {skills.length > 0 && (
                <div className={styles.skillPills}>
                    <button
                        className={`${styles.skillPill} ${!filter.skill ? styles.skillPillActive : ''}`}
                        onClick={() => setFilter(f => ({ ...f, skill: '' }))}
                    >All Skills</button>
                    {skills.map(s => (
                        <button
                            key={s.slug}
                            className={`${styles.skillPill} ${filter.skill === s.slug ? styles.skillPillActive : ''}`}
                            onClick={() => setFilter(f => ({ ...f, skill: f.skill === s.slug ? '' : s.slug }))}
                        >
                            {s.icon} {s.name}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Content ── */}
            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <span>Loading exams...</span>
                </div>
            ) : tabFiltered.length === 0 ? (
                <div className={styles.empty}>
                    <BookOpen size={48} color="#E5E7EB" strokeWidth={1.2} />
                    <h3>No exams found</h3>
                    <p>{search ? `No results for "${search}"` : 'Try changing your filters'}</p>
                </div>
            ) : (
                <div className={styles.list}>
                    <AnimatePresence mode="popLayout">
                        {tabFiltered.map((test, idx) => {
                            const isCompleted   = test.status === 'completed';
                            const isInProgress  = test.status === 'in-progress';
                            const lm = LEVEL_META[test.level] || LEVEL_META.beginner;

                            return (
                                <motion.div
                                    key={test._id}
                                    className={`${styles.row} ${isCompleted ? styles.rowDone : ''} ${expandedId === test._id ? styles.rowExpanded : ''}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    onClick={() => setExpandedId(expandedId === test._id ? null : test._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* Left: icon + info */}
                                    <div className={styles.rowLeft}>
                                        <div className={styles.rowIcon} style={{ position: 'relative' }}>
                                            <span>{test.category?.icon || '📚'}</span>
                                            <div className={styles.expandIndicator}>
                                                {expandedId === test._id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                            </div>
                                        </div>
                                        <div className={styles.rowInfo}>
                                            <div className={styles.rowBreadcrumb}>
                                                <span>{test.category?.name || 'Skill'}</span>
                                                <ChevronRight size={12} />
                                                <span>{test.level?.charAt(0).toUpperCase() + test.level?.slice(1)}</span>
                                            </div>
                                            <h3 className={styles.rowTitle}>{test.badgeLabel}</h3>
                                            <div className={styles.rowMeta}>
                                                <span><Clock size={12} /> {test.config?.duration} min</span>
                                                <span><Star size={12} /> {test.config?.totalMarks} marks</span>
                                                <span><Award size={12} /> Pass: {test.config?.passingScore}+</span>
                                                <span><Zap size={12} /> {test.config?.questionsCount} Questions</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center: result bar if completed */}
                                    <div className={styles.rowCenter}>
                                        {isCompleted && (
                                            <div className={`${styles.resultBadge} ${test.passed ? styles.resultPass : styles.resultFail}`}>
                                                {test.passed
                                                    ? <><CheckCircle size={14} /> Passed — {test.score}/100</>
                                                    : <><AlertCircle size={14} /> Failed — {test.score}/100</>
                                                }
                                            </div>
                                        )}
                                        <span
                                            className={styles.levelChip}
                                            style={{ background: lm.bg, color: lm.color }}
                                        >
                                            {lm.label}
                                        </span>
                                    </div>

                                    {/* Right: status + CTA */}
                                    <div className={styles.rowRight} onClick={e => e.stopPropagation()}>
                                        {isCompleted ? (
                                            <span className={styles.statusChip} style={{ background: test.passed ? '#D1FAE5' : '#FEE2E2', color: test.passed ? '#059669' : '#DC2626' }}>
                                                {test.passed ? 'Passed' : 'Failed'}
                                            </span>
                                        ) : isInProgress ? (
                                            <span className={styles.statusChip} style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                                                In Progress
                                            </span>
                                        ) : (
                                            <span className={styles.statusChip} style={{ background: '#F3F4F6', color: '#6B7280' }}>
                                                Available
                                            </span>
                                        )}

                                        <button
                                            className={`${styles.ctaBtn} ${isCompleted ? styles.ctaOutline : isInProgress ? styles.ctaResume : styles.ctaStart}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isCompleted) {
                                                    window.location.href = `/dashboard/student/exams/${test.sessionId}/report`;
                                                } else if (isInProgress) {
                                                    window.location.href = `/dashboard/student/exams/${test.sessionId}`;
                                                } else {
                                                    setEnrollModal(test); setError('');
                                                }
                                            }}
                                        >
                                            {isCompleted ? <>View Report <ChevronRight size={14} /></> :
                                             isInProgress ? <><Clock size={13} /> Resume</> :
                                             <>Enroll <ChevronRight size={14} /></>}
                                        </button>
                                    </div>

                                    {/* ── Expandable description ── */}
                                    <AnimatePresence>
                                        {expandedId === test._id && (
                                            <motion.div
                                                className={styles.descPanel}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <div className={styles.descInner}>
                                                    <Info size={14} className={styles.descIcon} />
                                                    <p className={styles.descText}>
                                                        {test.description || 'No description available for this exam yet.'}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* ── Enroll Modal ── */}
            <AnimatePresence>
                {enrollModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setEnrollModal(null); setError(''); }}
                    >
                        <motion.div
                            className={styles.modalBox}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <div className={styles.modalIcon}>📋</div>
                                <div>
                                    <h2 className={styles.modalTitle}>Exam Rules</h2>
                                    <p className={styles.modalSkill}>{enrollModal.badgeLabel}</p>
                                </div>
                                <button className={styles.modalClose} onClick={() => setEnrollModal(null)}>
                                    <X size={18} />
                                </button>
                            </div>
                            <ul className={styles.rulesList}>
                                <li>⏱ You have <strong>{enrollModal.config?.duration} minutes</strong> to complete {enrollModal.config?.questionsCount} questions.</li>
                                <li>🔒 <strong>One attempt only</strong> — you cannot retake this test once started.</li>
                                <li>⚡ The exam <strong>auto-submits</strong> when the timer runs out.</li>
                                <li>✅ Passing score: <strong>{enrollModal.config?.passingScore}/100</strong> to earn the badge.</li>
                                <li>📵 Do not refresh or close the tab during the exam.</li>
                                <li>🔐 All answers are graded on the server. Results are instant.</li>
                            </ul>
                            {error && <p className={styles.ruleError}>{error}</p>}
                            <div className={styles.modalActions}>
                                <button className={styles.cancelBtn} onClick={() => setEnrollModal(null)}>Cancel</button>
                                <button className={styles.startBtn} onClick={handleEnroll} disabled={enrolling}>
                                    {enrolling ? 'Starting...' : '🚀 Start Exam'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
