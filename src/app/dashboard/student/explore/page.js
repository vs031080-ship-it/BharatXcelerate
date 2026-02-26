'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Filter, SlidersHorizontal, Loader } from 'lucide-react';
import Link from 'next/link';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './explore.module.css';

const domains = ['All Domains', 'Full Stack', 'AI/ML', 'Blockchain', 'Backend', 'Frontend', 'Data Science', 'Mobile', 'DevOps', 'Cloud', 'Cybersecurity'];
const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

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
    'Cloud': { bg: '#F0F9FF', txt: '#0284C7', icon: '☁️' },
};

const difficultyColors = {
    Beginner: { bg: '#D1FAE5', color: '#065F46' },
    Intermediate: { bg: '#DBEAFE', color: '#1E40AF' },
    Advanced: { bg: '#FEF3C7', color: '#92400E' },
    Expert: { bg: '#FEE2E2', color: '#991B1B' },
};

const TABS = [
    { key: 'all', label: 'All' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
];

export default function ExploreProjectsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [domainFilter, setDomainFilter] = useState('All Domains');
    const [sortBy, setSortBy] = useState('points');
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/student/projects/explore', { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    setAllProjects(data.projects || []);
                }
            } catch (error) {
                console.error('Failed to fetch explore projects', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    let filtered = allProjects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
        const matchesDomain = domainFilter === 'All Domains' || p.domain === domainFilter;
        const matchesTab =
            activeTab === 'all' ? true :
                activeTab === 'beginner' ? p.difficulty === 'Beginner' :
                    activeTab === 'intermediate' ? p.difficulty === 'Intermediate' :
                        activeTab === 'advanced' ? ['Advanced', 'Expert'].includes(p.difficulty) : true;
        return matchesSearch && matchesDomain && matchesTab;
    });

    if (sortBy === 'points') filtered = [...filtered].sort((a, b) => (b.points || 0) - (a.points || 0));
    if (sortBy === 'title') filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

    return (
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.pageTop}>
                <div>
                    <h1 className={styles.pageTitle}>Explore Projects</h1>
                    <p className={styles.pageSub}>Discover real-world projects to build your portfolio and earn XP.</p>
                </div>

                {/* Pill tabs — like Upcoming / In Progress / Completed in screenshot */}
                <div className={styles.filterPills}>
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            className={`${styles.pill} ${activeTab === t.key ? styles.pillActive : ''}`}
                            onClick={() => setActiveTab(t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Card */}
            <div className={styles.tableCard}>
                {/* Controls row */}
                <div className={styles.controls}>
                    <div className={styles.filterGroup}>
                        {/* Domain filter */}
                        <button className={styles.filterBtn}>
                            <Filter size={14} />
                            Filters
                        </button>
                        <select
                            className={styles.filterSelect}
                            value={domainFilter}
                            onChange={e => setDomainFilter(e.target.value)}
                        >
                            {domains.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className={styles.rightControls}>
                        <span className={styles.sortLabel}>Sort by:</span>
                        <div className={styles.sortBox}>
                            <SlidersHorizontal size={13} color="#6B7280" />
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="points">XP Points</option>
                                <option value="title">Title</option>
                            </select>
                        </div>

                        <div className={styles.searchWrapper}>
                            <Search size={14} color="#9CA3AF" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Head */}
                {!loading && filtered.length > 0 && (
                    <div className={styles.tableHead}>
                        <span className={styles.colProject}>Project</span>
                        <span className={styles.colDomain}>Domain</span>
                        <span className={styles.colDifficulty}>Difficulty</span>
                        <span className={styles.colDesc}>Description</span>
                        <span className={styles.colXp}>XP</span>
                        <span className={styles.colAction} />
                    </div>
                )}

                {/* Table Body */}
                <div className={styles.tableBody}>
                    {loading ? (
                        <div className={styles.emptyState}>
                            <Loader size={22} className={styles.spin} color="#2563EB" />
                            <span>Loading projects...</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Search size={48} strokeWidth={1.2} color="#D1D5DB" />
                            <h3>No projects found</h3>
                            <p>Check &quot;My Projects&quot; for your ongoing work or try adjusting filters.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filtered.map((p, i) => {
                                const dc = DOMAIN_COLORS[p.domain] || { bg: '#F1F5F9', txt: '#64748B', icon: '📁' };
                                const diffClr = difficultyColors[p.difficulty] || difficultyColors.Intermediate;
                                return (
                                    <motion.div
                                        key={p._id}
                                        className={styles.tableRow}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        {/* Project */}
                                        <div className={styles.colProject}>
                                            <div className={styles.projectAvatar} style={{ background: dc.bg, color: dc.txt }}>
                                                {dc.icon}
                                            </div>
                                            <div>
                                                <Link href={`/dashboard/student/projects/${p._id}`} className={styles.projectName}>
                                                    {p.title}
                                                </Link>
                                                <div className={styles.projectSub}>{p.domain}</div>
                                            </div>
                                        </div>

                                        {/* Domain */}
                                        <div className={styles.colDomain}>
                                            <span className={styles.domainChip} style={{ background: dc.bg, color: dc.txt }}>
                                                {p.domain}
                                            </span>
                                        </div>

                                        {/* Difficulty */}
                                        <div className={styles.colDifficulty}>
                                            <span className={styles.diffBadge} style={{ background: diffClr.bg, color: diffClr.color }}>
                                                <Zap size={11} />
                                                {p.difficulty}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <div className={styles.colDesc}>
                                            <span className={styles.colDescText}>{p.description}</span>
                                        </div>

                                        {/* XP */}
                                        <div className={styles.colXp}>
                                            <span className={styles.xpChip}>+{p.points} XP</span>
                                        </div>

                                        {/* Action */}
                                        <div className={styles.colAction}>
                                            <Link href={`/dashboard/student/projects/${p._id}`} className={styles.viewDetailsBtn}>
                                                Start
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
