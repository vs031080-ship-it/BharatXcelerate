'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ArrowUpRight, Clock, Loader, CheckCircle2,
    FolderKanban, ChevronRight, Target, Zap, BarChart3,
    TrendingUp, Calendar, BookOpen, ArrowRight, Star
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './projects.module.css';

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
};

const STATUS_MAP = {
    accepted: { label: 'Accepted', cls: 'green' },
    pending: { label: 'Under Review', cls: 'amber' },
    completed: { label: 'Completed', cls: 'teal' },
    default: { label: 'In Progress', cls: 'indigo' },
};

function getStatus(project) {
    if (project.displayStatus === 'accepted') return STATUS_MAP.accepted;
    if (project.displayStatus === 'pending') return STATUS_MAP.pending;
    if (project.status === 'completed') return STATUS_MAP.completed;
    return STATUS_MAP.default;
}

export default function MyProjectsPage() {
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [search, setSearch] = useState('');
    const [_selected, setSelected] = useState(null);

    useEffect(() => {
        fetch('/api/student/projects/active', { headers: getAuthHeaders() })
            .then(r => r.ok ? r.json() : { projects: [] })
            .then(d => {
                const projs = d.projects || [];
                setAllProjects(projs);
                if (projs.length > 0) setSelected(projs[0]);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const inProgress = allProjects.filter(p => p.status !== 'completed' && p.status !== 'archived');
    const completed = allProjects.filter(p => p.status === 'completed');

    const filtered = (activeTab === 'active' ? inProgress : completed)
        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

    // If current selection was filtered out, pick first visible one (computed at render, no effect needed)
    const effectiveSelected = _selected && filtered.find(p => (p.id || p._id) === (_selected.id || _selected._id))
        ? _selected
        : filtered[0] || null;

    const selectedDc = effectiveSelected ? (DOMAIN_COLORS[effectiveSelected.domain] || { bg: '#F1F5F9', txt: '#64748B', solid: '#64748B', icon: '📁' }) : null;
    const selectedStatus = effectiveSelected ? getStatus(effectiveSelected) : null;
    const pct = effectiveSelected ? (effectiveSelected.progress || 0) : 0;
    const curStep = effectiveSelected ? (effectiveSelected.currentStep || 0) + 1 : 0;
    const totSteps = effectiveSelected ? (effectiveSelected.totalSteps || effectiveSelected.steps?.length || 0) : 0;

    // Total XP earned from completed projects
    const totalXpEarned = completed.reduce((s, p) => s + (p.points || 0), 0);
    const totalXpPending = inProgress.reduce((s, p) => s + (p.points || 0), 0);
    const avgProgress = inProgress.length > 0
        ? Math.round(inProgress.reduce((s, p) => s + (p.progress || 0), 0) / inProgress.length)
        : 0;

    // Alias so JSX can reference `selected` (from effectiveSelected) cleanly
    const selected = effectiveSelected;

    return (
        <div className={styles.shell}>
            {/* ── COLUMN 1: Project List ── */}
            <aside className={styles.listPanel}>
                <div className={styles.listHeader}>
                    <h2 className={styles.listTitle}>My Projects</h2>
                    <p className={styles.listSub}>Track your progress</p>

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

                    {/* Tab pills */}
                    <div className={styles.tabPills}>
                        <button
                            className={`${styles.tabPill} ${activeTab === 'active' ? styles.tabPillActive : ''}`}
                            onClick={() => setActiveTab('active')}
                        >
                            In Progress <span className={styles.tabCount}>{inProgress.length}</span>
                        </button>
                        <button
                            className={`${styles.tabPill} ${activeTab === 'completed' ? styles.tabPillActive : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Completed <span className={styles.tabCount}>{completed.length}</span>
                        </button>
                    </div>
                </div>

                <div className={styles.listBody}>
                    {loading ? (
                        <div className={styles.listLoading}>
                            <Loader size={20} className={styles.spin} color="#4F46E5" />
                            <span>Loading...</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className={styles.listEmpty}>
                            <FolderKanban size={32} color="#D1D5DB" strokeWidth={1.5} />
                            <p>{search ? 'No results found' : activeTab === 'active' ? 'No active projects yet' : 'No completed projects yet'}</p>
                            {activeTab === 'active' && !search && (
                                <Link href="/dashboard/student/explore" className={styles.listEmptyBtn}>
                                    Browse Projects
                                </Link>
                            )}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filtered.map((proj, i) => {
                                const dc = DOMAIN_COLORS[proj.domain] || { bg: '#F1F5F9', txt: '#64748B', solid: '#64748B', icon: '📁' };
                                const progress = proj.progress || 0;
                                const isActive = (selected?.id || selected?._id) === (proj.id || proj._id);
                                return (
                                    <motion.button
                                        key={proj.id || proj._id}
                                        className={`${styles.listItem} ${isActive ? styles.listItemActive : ''}`}
                                        onClick={() => setSelected(proj)}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                    >
                                        <div className={styles.listItemBadge} style={{ background: dc.solid }}>
                                            {proj.domain?.substring(0, 3).toUpperCase() || '---'}
                                        </div>
                                        <div className={styles.listItemInfo}>
                                            <span className={styles.listItemTitle}>{proj.title}</span>
                                            <div className={styles.listItemProgressRow}>
                                                <div className={styles.listItemProgressBg}>
                                                    <div
                                                        className={styles.listItemProgressFill}
                                                        style={{ width: `${progress}%`, background: dc.solid }}
                                                    />
                                                </div>
                                                <span className={styles.listItemProgressPct}>{progress}%</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className={styles.listItemArrow} />
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </aside>

            {/* ── COLUMN 2: Detail Panel ── */}
            <main className={styles.detailPanel}>
                {!selected || filtered.length === 0 ? (
                    <div className={styles.detailEmpty}>
                        <BookOpen size={48} color="#D1D5DB" strokeWidth={1.2} />
                        <h3>No project selected</h3>
                        <p>{activeTab === 'active' ? 'Accept a project from the library to get started.' : 'Complete an active project to see it here.'}</p>
                        <Link href="/dashboard/student/explore" className={styles.detailEmptyBtn}>
                            Explore Projects <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selected.id || selected._id}
                            className={styles.detailContent}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Header */}
                            <div className={styles.detailHeader}>
                                <div className={styles.detailIcon} style={{ background: selectedDc.bg, color: selectedDc.txt }}>
                                    <span className={styles.detailIconEmoji}>{selectedDc.icon}</span>
                                </div>
                                <div className={styles.detailMeta}>
                                    <span className={styles.detailDomainTag} style={{ background: selectedDc.bg, color: selectedDc.txt }}>
                                        {selected.domain}
                                    </span>
                                    <span className={`${styles.statusChip} ${styles[`chip${selectedStatus.cls.charAt(0).toUpperCase() + selectedStatus.cls.slice(1)}`]}`}>
                                        {selectedStatus.label}
                                    </span>
                                </div>
                            </div>
                            <h1 className={styles.detailTitle}>{selected.title}</h1>
                            <p className={styles.detailDomain}>{selected.difficulty} · {selected.domain}</p>

                            {/* Progress Section */}
                            <div className={styles.progressSection}>
                                <div className={styles.progressHeader}>
                                    <span className={styles.progressLabel}>Project Progress</span>
                                    <span className={styles.progressSteps}>Step {curStep} of {totSteps}</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${pct}%`, background: selectedDc.solid }}
                                    />
                                </div>
                                <div className={styles.progressFooter}>
                                    <span className={styles.progressPct}>{pct}% Complete</span>
                                    <span className={styles.progressXp}><Star size={12} /> +{selected.points} XP on completion</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className={styles.detailStats}>
                                <div className={styles.statBox}>
                                    <Clock size={16} color="#6B7280" />
                                    <div>
                                        <span className={styles.statVal}>{totSteps} Steps</span>
                                        <span className={styles.statLbl}>Total Milestones</span>
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <Target size={16} color="#4F46E5" />
                                    <div>
                                        <span className={styles.statVal}>Step {curStep}</span>
                                        <span className={styles.statLbl}>Current Step</span>
                                    </div>
                                </div>
                                <div className={styles.statBox}>
                                    <Zap size={16} color="#D97706" />
                                    <div>
                                        <span className={styles.statVal}>+{selected.points} XP</span>
                                        <span className={styles.statLbl}>Reward</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description section */}
                            <div className={styles.detailSection}>
                                <h3 className={styles.detailSectionTitle}>About this project</h3>
                                <p className={styles.detailDesc}>{selected.description}</p>
                            </div>

                            {/* Steps preview */}
                            {selected.steps && selected.steps.length > 0 && (
                                <div className={styles.detailSection}>
                                    <h3 className={styles.detailSectionTitle}>Milestone Progress</h3>
                                    <div className={styles.stepsList}>
                                        {selected.steps.slice(0, 5).map((step, idx) => {
                                            const done = idx < (selected.currentStep || 0);
                                            const current = idx === (selected.currentStep || 0);
                                            return (
                                                <div key={idx} className={`${styles.stepItem} ${done ? styles.stepDone : ''} ${current ? styles.stepCurrent : ''}`}>
                                                    <div className={styles.stepNum} style={{
                                                        background: done ? '#10B981' : current ? selectedDc.solid : '#E5E7EB',
                                                        color: done || current ? 'white' : '#9CA3AF'
                                                    }}>
                                                        {done ? <CheckCircle2 size={12} /> : idx + 1}
                                                    </div>
                                                    <span className={styles.stepTitle} style={{ color: done ? '#059669' : current ? '#111827' : '#6B7280' }}>
                                                        {step.title || step}
                                                    </span>
                                                    {current && <span className={styles.stepCurrentBadge}>Current</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <div className={styles.detailActions}>
                                <Link
                                    href={`/dashboard/student/projects/${selected.id || selected._id}`}
                                    className={styles.continueBtn}
                                    style={{ background: selectedDc.solid }}
                                >
                                    {selected.status === 'completed' ? <><CheckCircle2 size={16} /> View Project</> : <><ArrowRight size={16} /> Continue Project</>}
                                </Link>
                                <Link
                                    href={`/dashboard/student/scorecard`}
                                    className={styles.scorecardBtn}
                                >
                                    <BarChart3 size={15} /> Scorecard
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>

            {/* ── COLUMN 3: Right Panel ── */}
            <aside className={styles.rightPanel}>
                {/* Overall Progress */}
                <div className={styles.rpCard}>
                    <h3 className={styles.rpCardTitle}>
                        <TrendingUp size={15} /> Your Progress
                    </h3>
                    <div className={styles.rpStats}>
                        <div className={styles.rpStat}>
                            <span className={styles.rpStatNum}>{allProjects.length}</span>
                            <span className={styles.rpStatLbl}>Total Projects</span>
                        </div>
                        <div className={styles.rpStat}>
                            <span className={styles.rpStatNum}>{avgProgress}%</span>
                            <span className={styles.rpStatLbl}>Avg. Progress</span>
                        </div>
                        <div className={styles.rpStat}>
                            <span className={styles.rpStatNum} style={{ color: '#059669' }}>+{totalXpEarned}</span>
                            <span className={styles.rpStatLbl}>XP Earned</span>
                        </div>
                        <div className={styles.rpStat}>
                            <span className={styles.rpStatNum} style={{ color: '#D97706' }}>+{totalXpPending}</span>
                            <span className={styles.rpStatLbl}>XP Pending</span>
                        </div>
                    </div>
                </div>

                {/* Completion Status */}
                <div className={styles.rpCard}>
                    <h3 className={styles.rpCardTitle}>
                        <BarChart3 size={15} /> Completion Overview
                    </h3>
                    <div className={styles.completionItems}>
                        <div className={styles.compItem}>
                            <span className={styles.compLabel}><Clock size={12} color="#4F46E5" /> In Progress</span>
                            <div className={styles.compBar}>
                                <div className={styles.compFill} style={{ width: allProjects.length > 0 ? `${(inProgress.length / allProjects.length) * 100}%` : '0%', background: '#4F46E5' }} />
                            </div>
                            <span className={styles.compNum}>{inProgress.length}</span>
                        </div>
                        <div className={styles.compItem}>
                            <span className={styles.compLabel}><CheckCircle2 size={12} color="#10B981" /> Completed</span>
                            <div className={styles.compBar}>
                                <div className={styles.compFill} style={{ width: allProjects.length > 0 ? `${(completed.length / allProjects.length) * 100}%` : '0%', background: '#10B981' }} />
                            </div>
                            <span className={styles.compNum}>{completed.length}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.rpCard}>
                    <h3 className={styles.rpCardTitle}>
                        <Calendar size={15} /> Quick Actions
                    </h3>
                    <div className={styles.quickActions}>
                        <Link href="/dashboard/student/explore" className={styles.qaItem}>
                            <div className={styles.qaIcon} style={{ background: '#EDE9FE', color: '#7C3AED' }}>🔍</div>
                            <div className={styles.qaInfo}>
                                <span className={styles.qaTitle}>Explore Projects</span>
                                <span className={styles.qaDesc}>Find new projects to start</span>
                            </div>
                            <ArrowRight size={13} color="#9CA3AF" />
                        </Link>
                        <Link href="/dashboard/student/scorecard" className={styles.qaItem}>
                            <div className={styles.qaIcon} style={{ background: '#D1FAE5', color: '#059669' }}>📊</div>
                            <div className={styles.qaInfo}>
                                <span className={styles.qaTitle}>Scorecard</span>
                                <span className={styles.qaDesc}>View your grades & scores</span>
                            </div>
                            <ArrowRight size={13} color="#9CA3AF" />
                        </Link>
                        <Link href="/dashboard/student/exams" className={styles.qaItem}>
                            <div className={styles.qaIcon} style={{ background: '#DBEAFE', color: '#1D4ED8' }}>🎓</div>
                            <div className={styles.qaInfo}>
                                <span className={styles.qaTitle}>Skill Exams</span>
                                <span className={styles.qaDesc}>Earn skill badges</span>
                            </div>
                            <ArrowRight size={13} color="#9CA3AF" />
                        </Link>
                    </div>
                </div>

                {/* Browse more CTA */}
                <div className={styles.rpCard} style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', border: 'none' }}>
                    <h3 className={styles.rpCardTitle} style={{ color: 'white' }}>
                        <Star size={15} /> Explore More
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', marginBottom: '12px', lineHeight: 1.5 }}>
                        Discover new projects and keep building your portfolio.
                    </p>
                    <Link href="/dashboard/student/explore" className={styles.rpCtaBtn}>
                        Browse Projects <ArrowUpRight size={14} />
                    </Link>
                </div>
            </aside>
        </div>
    );
}
