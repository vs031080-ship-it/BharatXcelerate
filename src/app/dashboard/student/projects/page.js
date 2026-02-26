'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, SlidersHorizontal, ArrowUpRight,
    Clock, Zap, Loader, CheckCircle2, FolderKanban, Layers
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './projects.module.css';

const DOMAIN_COLORS = {
    'AI/ML': { bg: '#EDE9FE', txt: '#7C3AED', icon: '🤖' },
    'Blockchain': { bg: '#FEF3C7', txt: '#D97706', icon: '⛓️' },
    'Full Stack': { bg: '#DBEAFE', txt: '#1D4ED8', icon: '🌐' },
    'Backend': { bg: '#D1FAE5', txt: '#059669', icon: '⚙️' },
    'Frontend': { bg: '#FCE7F3', txt: '#BE185D', icon: '🎨' },
    'Mobile': { bg: '#FFEDD5', txt: '#EA580C', icon: '📱' },
    'DevOps': { bg: '#E0F2FE', txt: '#0369A1', icon: '🚀' },
    'Data Science': { bg: '#F0FDF4', txt: '#16A34A', icon: '📊' },
    'Cybersecurity': { bg: '#FEE2E2', txt: '#DC2626', icon: '🔐' },
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
    const [sortBy, setSortBy] = useState('progress');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/student/projects/active', { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    setAllProjects(data.projects || []);
                }
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const inProgress = allProjects.filter(p => p.status !== 'completed' && p.status !== 'archived');
    const completed = allProjects.filter(p => p.status === 'completed');

    let filtered = (activeTab === 'active' ? inProgress : completed)
        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

    if (sortBy === 'progress') filtered = [...filtered].sort((a, b) => (b.progress || 0) - (a.progress || 0));
    if (sortBy === 'xp') filtered = [...filtered].sort((a, b) => (b.points || 0) - (a.points || 0));
    if (sortBy === 'title') filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

    return (
        <div className={styles.page}>
            {/* Page Header */}
            <div className={styles.pageTop}>
                <div>
                    <h1 className={styles.pageTitle}>My Projects</h1>
                    <p className={styles.pageSub}>Track progress and continue where you left off</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Pill tabs — In Progress / Completed */}
                    <div className={styles.filterPills}>
                        <button
                            className={`${styles.pill} ${activeTab === 'active' ? styles.pillActive : ''}`}
                            onClick={() => setActiveTab('active')}
                        >
                            In Progress&nbsp;
                            <span style={{
                                fontSize: '0.7rem',
                                background: activeTab === 'active' ? 'rgba(255,255,255,0.25)' : '#E5E7EB',
                                color: activeTab === 'active' ? '#fff' : '#6B7280',
                                borderRadius: '20px',
                                padding: '1px 7px',
                                fontWeight: 700,
                            }}>{inProgress.length}</span>
                        </button>
                        <button
                            className={`${styles.pill} ${activeTab === 'completed' ? styles.pillActive : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Completed&nbsp;
                            <span style={{
                                fontSize: '0.7rem',
                                background: activeTab === 'completed' ? 'rgba(255,255,255,0.25)' : '#E5E7EB',
                                color: activeTab === 'completed' ? '#fff' : '#6B7280',
                                borderRadius: '20px',
                                padding: '1px 7px',
                                fontWeight: 700,
                            }}>{completed.length}</span>
                        </button>
                    </div>

                    <Link href="/dashboard/student/explore" className={styles.browseCta}>
                        Browse Projects <ArrowUpRight size={15} />
                    </Link>
                </div>
            </div>

            {/* Stat pills */}
            <div className={styles.statRow}>
                <div className={styles.statPill}>
                    <FolderKanban size={15} color="#4F46E5" />
                    <span><strong>{allProjects.length}</strong> Total</span>
                </div>
                <div className={styles.statPill}>
                    <Clock size={15} color="#0EA5E9" />
                    <span><strong>{inProgress.length}</strong> In Progress</span>
                </div>
                <div className={styles.statPill}>
                    <CheckCircle2 size={15} color="#10B981" />
                    <span><strong>{completed.length}</strong> Completed</span>
                </div>
            </div>

            {/* Main Table Card */}
            <div className={styles.tableCard}>
                {/* Controls row */}
                <div className={styles.controls}>
                    <button className={styles.filterBtn}>
                        <Filter size={14} />
                        Filters
                    </button>

                    <div className={styles.rightControls}>
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
                        {/* Sort */}
                        <span className={styles.sortLabel}>Sort by:</span>
                        <div className={styles.sortBox}>
                            <SlidersHorizontal size={13} color="#6B7280" />
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="progress">Progress</option>
                                <option value="xp">XP</option>
                                <option value="title">Title</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Head */}
                {!loading && filtered.length > 0 && (
                    <div className={styles.tableHead}>
                        <span className={styles.colProject}>Project</span>
                        <span className={styles.colDomain}>Domain</span>
                        <span className={styles.colProgress}>Progress</span>
                        <span className={styles.colStatus}>Status</span>
                        <span className={styles.colXp}>XP</span>
                        <span className={styles.colAction} />
                    </div>
                )}

                {/* Table Body */}
                {loading ? (
                    <div className={styles.loadingState}>
                        <Loader size={22} className={styles.spin} color="#2563EB" />
                        <span>Loading your projects...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Layers size={48} strokeWidth={1.2} color="#D1D5DB" />
                        <h3>{search ? 'No results found' : activeTab === 'active' ? 'No active projects' : 'No completed projects yet'}</h3>
                        <p>{search ? 'Try clearing the search.' : activeTab === 'active' ? 'Start a new project from the project library.' : 'Complete a project to see it here.'}</p>
                        {activeTab === 'active' && !search && (
                            <Link href="/dashboard/student/explore" className={styles.emptyBtn}>
                                Browse Projects
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className={styles.tableBody}>
                        <AnimatePresence mode="popLayout">
                            {filtered.map((project, i) => {
                                const dc = DOMAIN_COLORS[project.domain] || { bg: '#F1F5F9', txt: '#64748B', icon: '📁' };
                                const status = getStatus(project);
                                const pct = project.progress || 0;
                                const curStep = (project.currentStep || 0) + 1;
                                const totSteps = project.totalSteps || '?';
                                return (
                                    <motion.div
                                        key={project.id}
                                        className={styles.tableRow}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        {/* Project */}
                                        <div className={styles.colProject}>
                                            <div className={styles.projectAvatar} style={{ background: dc.bg, color: dc.txt }}>
                                                {dc.icon}
                                            </div>
                                            <div>
                                                <Link href={`/dashboard/student/projects/${project.id}`} className={styles.projectName}>
                                                    {project.title}
                                                </Link>
                                                <div className={styles.projectSub}>{project.difficulty} · Step {curStep} of {totSteps}</div>
                                            </div>
                                        </div>

                                        {/* Domain */}
                                        <div className={styles.colDomain}>
                                            <span className={styles.domainChip} style={{ background: dc.bg, color: dc.txt }}>
                                                {project.domain}
                                            </span>
                                        </div>

                                        {/* Progress */}
                                        <div className={styles.colProgress}>
                                            <div className={styles.pbarWrap}>
                                                <div className={styles.pbarTop}>
                                                    <span className={styles.pbarSteps}>{curStep}/{totSteps}</span>
                                                    <span className={styles.pbarPct}>({pct}%)</span>
                                                </div>
                                                <div className={styles.pbarBg}>
                                                    <div className={styles.pbarFill} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className={styles.colStatus}>
                                            <span className={`${styles.statusChip} ${styles[`chip${status.cls.charAt(0).toUpperCase() + status.cls.slice(1)}`]}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* XP */}
                                        <div className={styles.colXp}>
                                            <span className={styles.xpChip}>+{project.points} XP</span>
                                        </div>

                                        {/* Action */}
                                        <div className={styles.colAction}>
                                            <Link href={`/dashboard/student/projects/${project.id}`} className={styles.actionBtn}>
                                                {project.status === 'completed' ? 'View' : 'Continue'}
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
