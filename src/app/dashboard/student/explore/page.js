'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Zap, Loader, ArrowRight, Star,
    Clock, BookOpen, Target, CheckCircle, ChevronRight,
    Flame, TrendingUp, Award, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './explore.module.css';

const DOMAIN_COLORS = {
    'AI/ML': { bg: '#EDE9FE', txt: '#7C3AED', solid: '#7C3AED', icon: '🤖' },
    'Blockchain': { bg: '#FEF3C7', txt: '#D97706', solid: '#D97706', icon: '⛓️' },
    'Full Stack': { bg: '#DBEAFE', txt: '#1D4ED8', solid: '#2563EB', icon: '🌐' },
    'Backend': { bg: '#D1FAE5', txt: '#059669', solid: '#059669', icon: '⚙️' },
    'Frontend': { bg: '#FCE7F3', txt: '#BE185D', solid: '#BE185D', icon: '🎨' },
    'Mobile': { bg: '#FFEDD5', txt: '#EA580C', solid: '#EA580C', icon: '📱' },
    'DevOps': { bg: '#E0F2FE', txt: '#0369A1', solid: '#0369A1', icon: '🚀' },
    'Data Science': { bg: '#F0FDF4', txt: '#16A34A', solid: '#16A34A', icon: '📊' },
    'Cybersecurity': { bg: '#FEE2E2', txt: '#DC2626', solid: '#DC2626', icon: '🔐' },
    'Cloud': { bg: '#F0F9FF', txt: '#0284C7', solid: '#0284C7', icon: '☁️' },
};

const DIFF_COLORS = {
    Beginner: { bg: '#D1FAE5', txt: '#065F46' },
    Intermediate: { bg: '#DBEAFE', txt: '#1E40AF' },
    Advanced: { bg: '#FEF3C7', txt: '#92400E' },
    Expert: { bg: '#FEE2E2', txt: '#991B1B' },
};

const CATEGORIES = ['All', 'Full Stack', 'AI/ML', 'Blockchain', 'Backend', 'Frontend', 'Data Science', 'Mobile', 'DevOps', 'Cloud', 'Cybersecurity'];

export default function ExploreProjectsPage() {
    const router = useRouter();
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [_selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [accepting, setAccepting] = useState(false);
    const [acceptError, setAcceptError] = useState('');

    useEffect(() => {
        fetch('/api/student/projects/explore', { headers: getAuthHeaders() })
            .then(r => r.ok ? r.json() : { projects: [] })
            .then(d => {
                const projs = d.projects || [];
                setAllProjects(projs);
                if (projs.length > 0) setSelected(projs[0]);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = allProjects.filter(p => {
        const q = search.toLowerCase();
        const matchSearch = !search || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        const matchCat = category === 'All' || p.domain === category;
        return matchSearch && matchCat;
    });

    // If current selection was filtered out, pick first available (computed at render, not in effect)
    const effectiveSelected = _selected && filtered.find(p => p._id === _selected._id)
        ? _selected
        : filtered[0] || null;

    async function handleAccept(projectId) {
        setAccepting(true);
        setAcceptError('');
        try {
            const res = await fetch('/api/student/submit', {
                method: 'POST',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, action: 'accept' }),
            });
            if (res.ok) {
                router.push(`/dashboard/student/projects/${projectId}`);
            } else {
                const data = await res.json();
                // If already accepted, just navigate there
                if (data.error?.toLowerCase().includes('already')) {
                    router.push(`/dashboard/student/projects/${projectId}`);
                } else {
                    setAcceptError(data.error || 'Failed to accept project');
                }
            }
        } catch {
            setAcceptError('Network error. Please try again.');
        } finally {
            setAccepting(false);
        }
    }

    // Related projects for right panel (same domain, excluding effectiveSelected)
    const related = allProjects
        .filter(p => effectiveSelected && p.domain === effectiveSelected.domain && p._id !== effectiveSelected._id)
        .slice(0, 3);

    // Domain breakdown stats for right panel
    const domainStats = allProjects.reduce((acc, p) => {
        acc[p.domain] = (acc[p.domain] || 0) + 1;
        return acc;
    }, {});
    const topDomains = Object.entries(domainStats).sort((a, b) => b[1] - a[1]).slice(0, 4);

    const selectedDc = effectiveSelected ? (DOMAIN_COLORS[effectiveSelected.domain] || { bg: '#F1F5F9', txt: '#64748B', solid: '#64748B', icon: '📁' }) : null;
    const selectedDiff = effectiveSelected ? (DIFF_COLORS[effectiveSelected.difficulty] || DIFF_COLORS.Intermediate) : null;

    // Alias so JSX can reference `selected` (from effectiveSelected) cleanly
    const selected = effectiveSelected;

    return (
        <div className={styles.shell}>
            {/* ── COLUMN 1: Project List ── */}
            <aside className={styles.listPanel}>
                <div className={styles.listHeader}>
                    <h2 className={styles.listTitle}>Explore Projects</h2>
                    <p className={styles.listSub}>{allProjects.length} projects available</p>

                    {/* Search */}
                    <div className={styles.searchBox}>
                        <Search size={14} color="#9CA3AF" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Category tabs */}
                    <div className={styles.catScroll}>
                        {CATEGORIES.map(c => (
                            <button
                                key={c}
                                className={`${styles.catBtn} ${category === c ? styles.catActive : ''}`}
                                onClick={() => setCategory(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.listBody}>
                    {loading ? (
                        <div className={styles.listLoading}>
                            <Loader size={20} className={styles.spin} color="#2563EB" />
                            <span>Loading...</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className={styles.listEmpty}>
                            <Search size={32} color="#D1D5DB" strokeWidth={1.5} />
                            <p>No projects match your filters</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filtered.map((p, i) => {
                                const dc = DOMAIN_COLORS[p.domain] || { bg: '#F1F5F9', txt: '#64748B', icon: '📁' };
                                const isActive = selected?._id === p._id;
                                return (
                                    <motion.button
                                        key={p._id}
                                        className={`${styles.listItem} ${isActive ? styles.listItemActive : ''}`}
                                        onClick={() => setSelected(p)}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                    >
                                        <div className={styles.listItemBadge} style={{ background: dc.solid }}>
                                            {p.domain.substring(0, 3).toUpperCase()}
                                        </div>
                                        <div className={styles.listItemInfo}>
                                            <span className={styles.listItemTitle}>{p.title}</span>
                                            <span className={styles.listItemMeta}>{p.domain} · {p.difficulty}</span>
                                        </div>
                                        <ChevronRight size={14} className={styles.listItemArrow} />
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </aside>

            {/* ── COLUMN 2: Project Detail ── */}
            <main className={styles.detailPanel}>
                {!selected ? (
                    <div className={styles.detailEmpty}>
                        <BookOpen size={48} color="#D1D5DB" strokeWidth={1.2} />
                        <h3>Select a project</h3>
                        <p>Pick a project from the list to see its details</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selected._id}
                            className={styles.detailContent}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Project Header */}
                            <div className={styles.detailHeader}>
                                <div className={styles.detailIcon} style={{ background: selectedDc.bg, color: selectedDc.txt }}>
                                    <span className={styles.detailIconEmoji}>{selectedDc.icon}</span>
                                </div>
                                <div className={styles.detailMeta}>
                                    <span className={styles.detailDomainTag} style={{ background: selectedDc.bg, color: selectedDc.txt }}>
                                        {selected.domain}
                                    </span>
                                    <span className={styles.detailDiffTag} style={{ background: selectedDiff.bg, color: selectedDiff.txt }}>
                                        <Zap size={11} />
                                        {selected.difficulty}
                                    </span>
                                </div>
                            </div>
                            <h1 className={styles.detailTitle}>{selected.title}</h1>

                            {/* About Section */}
                            <div className={styles.detailSection}>
                                <h3 className={styles.detailSectionTitle}>About this project</h3>
                                <p className={styles.detailDesc}>{selected.description}</p>
                            </div>

                            {/* Stats Row */}
                            <div className={styles.detailStats}>
                                <div className={styles.statBox}>
                                    <Clock size={16} color="#6B7280" />
                                    <div>
                                        <span className={styles.statVal}>{selected.totalSteps || selected.steps?.length || 0} Steps</span>
                                        <span className={styles.statLbl}>Total Milestones</span>
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <Star size={16} color="#D97706" />
                                    <div>
                                        <span className={styles.statVal}>+{selected.points} XP</span>
                                        <span className={styles.statLbl}>Reward Points</span>
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <Target size={16} color="#7C3AED" />
                                    <div>
                                        <span className={styles.statVal}>{selected.difficulty}</span>
                                        <span className={styles.statLbl}>Difficulty Level</span>
                                    </div>
                                </div>
                            </div>

                            {/* What You'll Build */}
                            {selected.steps && selected.steps.length > 0 && (
                                <div className={styles.detailSection}>
                                    <h3 className={styles.detailSectionTitle}>Project Milestones</h3>
                                    <div className={styles.stepsList}>
                                        {selected.steps.slice(0, 4).map((step, idx) => (
                                            <div key={idx} className={styles.stepItem}>
                                                <div className={styles.stepNum}>{idx + 1}</div>
                                                <span className={styles.stepTitle}>{step.title || step}</span>
                                            </div>
                                        ))}
                                        {selected.steps.length > 4 && (
                                            <div className={styles.stepMore}>
                                                +{selected.steps.length - 4} more milestones
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Error message */}
                            {acceptError && (
                                <div className={styles.acceptError}>{acceptError}</div>
                            )}

                            {/* Action Buttons */}
                            <div className={styles.detailActions}>
                                <button
                                    className={styles.acceptBtn}
                                    onClick={() => handleAccept(selected._id)}
                                    disabled={accepting}
                                >
                                    {accepting ? (
                                        <><Loader size={16} className={styles.spin} /> Accepting...</>
                                    ) : (
                                        <><CheckCircle size={16} /> Accept Project</>
                                    )}
                                </button>
                                <Link href={`/dashboard/student/projects/${selected._id}`} className={styles.viewBtn}>
                                    <ExternalLink size={15} /> View Details
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>

            {/* ── COLUMN 3: Right Panel ── */}
            <aside className={styles.rightPanel}>
                {/* Quick Stats */}
                <div className={styles.rpCard}>
                    <h3 className={styles.rpCardTitle}>
                        <TrendingUp size={15} /> Quick Stats
                    </h3>
                    <div className={styles.rpStats}>
                        <div className={styles.rpStat}>
                            <span className={styles.rpStatNum}>{allProjects.length}</span>
                            <span className={styles.rpStatLbl}>Total Projects</span>
                        </div>
                        <div className={styles.rpStat}>
                            <span className={styles.rpStatNum}>
                                {allProjects.reduce((s, p) => s + (p.points || 0), 0).toLocaleString()}
                            </span>
                            <span className={styles.rpStatLbl}>Total XP Available</span>
                        </div>
                    </div>
                </div>

                {/* Domain Breakdown */}
                <div className={styles.rpCard}>
                    <h3 className={styles.rpCardTitle}>
                        <Flame size={15} /> Top Domains
                    </h3>
                    <div className={styles.rpDomains}>
                        {topDomains.map(([domain, count]) => {
                            const dc = DOMAIN_COLORS[domain] || { bg: '#F1F5F9', txt: '#64748B' };
                            const pct = Math.round((count / allProjects.length) * 100);
                            return (
                                <button
                                    key={domain}
                                    className={styles.rpDomainRow}
                                    onClick={() => setCategory(domain)}
                                >
                                    <span className={styles.rpDomainBadge} style={{ background: dc.bg, color: dc.txt }}>{domain}</span>
                                    <div className={styles.rpDomainBar}>
                                        <div className={styles.rpDomainFill} style={{ width: `${pct}%`, background: dc.txt }} />
                                    </div>
                                    <span className={styles.rpDomainCount}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Related Projects */}
                {related.length > 0 && (
                    <div className={styles.rpCard}>
                        <h3 className={styles.rpCardTitle}>
                            <Award size={15} /> Similar Projects
                        </h3>
                        <div className={styles.rpRelated}>
                            {related.map(p => {
                                const dc = DOMAIN_COLORS[p.domain] || { bg: '#F1F5F9', txt: '#64748B', icon: '📁' };
                                return (
                                    <button
                                        key={p._id}
                                        className={styles.rpRelatedItem}
                                        onClick={() => setSelected(p)}
                                    >
                                        <span className={styles.rpRelatedIcon} style={{ background: dc.bg, color: dc.txt }}>
                                            {dc.icon}
                                        </span>
                                        <div className={styles.rpRelatedInfo}>
                                            <span className={styles.rpRelatedTitle}>{p.title}</span>
                                            <span className={styles.rpRelatedXp}>+{p.points} XP</span>
                                        </div>
                                        <ArrowRight size={13} color="#9CA3AF" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Go to My Projects */}
                <div className={styles.rpCard} style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', border: 'none' }}>
                    <h3 className={styles.rpCardTitle} style={{ color: 'white' }}>
                        <BookOpen size={15} /> My Projects
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '12px', lineHeight: 1.5 }}>
                        Track your accepted projects and continue where you left off.
                    </p>
                    <Link href="/dashboard/student/projects" className={styles.rpCtaBtn}>
                        View My Projects <ArrowRight size={14} />
                    </Link>
                </div>
            </aside>
        </div>
    );
}
