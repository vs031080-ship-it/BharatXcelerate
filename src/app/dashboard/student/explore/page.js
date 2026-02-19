'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, Target, ArrowRight, LayoutGrid, LayoutList } from 'lucide-react';
import Link from 'next/link';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './explore.module.css';

const domains = ['All Domains', 'Full Stack', 'AI/ML', 'Blockchain', 'Backend', 'Frontend', 'Data Science', 'Mobile', 'DevOps', 'Cloud', 'Cybersecurity'];
const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const difficultyColors = {
    Beginner: { bg: '#D1FAE5', color: '#065F46' },
    Intermediate: { bg: '#DBEAFE', color: '#1E40AF' },
    Advanced: { bg: '#FEF3C7', color: '#92400E' },
    Expert: { bg: '#FEE2E2', color: '#991B1B' },
};

export default function ExploreProjectsPage() {
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');
    const [domainFilter, setDomainFilter] = useState('All Domains');
    const [levelFilter, setLevelFilter] = useState('All Levels');
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch projects the user hasn't started yet
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

    const filteredProjects = allProjects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
        const matchesDomain = domainFilter === 'All Domains' || p.domain === domainFilter;
        const matchesLevel = levelFilter === 'All Levels' || p.difficulty === levelFilter;
        return matchesSearch && matchesDomain && matchesLevel;
    });

    return (
        <div className={styles.container}>
            {/* Gradient Banner */}
            <div className={styles.banner}>
                <div>
                    <h1>Explore Projects</h1>
                    <p>Discover real-world projects to build your portfolio and earn XP.</p>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={18} />
                    <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className={styles.filterGroup}>
                    <select className={styles.filterSelect} value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)}>
                        {domains.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select className={styles.filterSelect} value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                        {difficulties.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>

                    <div className={styles.viewToggle}>
                        <button className={`${styles.toggleBtn} ${view === 'grid' ? styles.activeView : ''}`} onClick={() => setView('grid')} title="Grid View">
                            <LayoutGrid size={18} />
                        </button>
                        <button className={`${styles.toggleBtn} ${view === 'list' ? styles.activeView : ''}`} onClick={() => setView('list')} title="List View">
                            <LayoutList size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {loading ? (
                <div className={styles.emptyState}>Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
                <div className={styles.emptyState}>
                    <Search size={48} />
                    <h3>No new projects found</h3>
                    <p>Check "My Projects" for your ongoing work or try adjusting filters.</p>
                </div>
            ) : view === 'grid' ? (
                <div className={styles.grid}>
                    {filteredProjects.map((p) => {
                        const dc = difficultyColors[p.difficulty] || difficultyColors.Intermediate;
                        return (
                            <motion.div key={p._id} className={styles.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                {/* Card Header with Avatar */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardAvatar} style={{ background: dc.bg, color: dc.color }}>
                                        {p.title.charAt(0)}
                                    </div>
                                    <div className={styles.cardTitleArea}>
                                        <h3 className={styles.cardTitle}>{p.title}</h3>
                                        <span className={styles.cardDomain}>{p.domain}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className={styles.cardDesc}>{p.description}</p>

                                {/* Difficulty Badge */}
                                <div className={styles.cardBadgeRow}>
                                    <span className={styles.diffBadge} style={{ background: dc.bg, color: dc.color }}>
                                        <Zap size={12} /> {p.difficulty}
                                    </span>
                                </div>

                                {/* Stats Footer */}
                                <div className={styles.cardFooter}>
                                    <div className={styles.footerStat}>
                                        <strong>+{p.points}</strong>
                                        <span>XP Points</span>
                                    </div>
                                    <div className={styles.footerStat}>
                                        <strong>{p.domain.split(' ')[0]}</strong>
                                        <span>Domain</span>
                                    </div>
                                    <div className={styles.footerAction}>
                                        <Link href={`/dashboard/student/projects/${p._id}`} className={styles.viewDetailsBtn}>
                                            View Details <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.list}>
                    {filteredProjects.map((p) => {
                        const dc = difficultyColors[p.difficulty] || difficultyColors.Intermediate;
                        return (
                            <motion.div key={p._id} className={styles.listRow} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                                <div className={styles.listAvatar} style={{ background: dc.bg, color: dc.color }}>
                                    {p.title.charAt(0)}
                                </div>
                                <div className={styles.listInfo}>
                                    <h3>{p.title}</h3>
                                    <span>{p.domain} · {p.difficulty} · +{p.points} XP</span>
                                </div>
                                <div className={styles.listActions}>
                                    <Link href={`/dashboard/student/projects/${p._id}`} className={styles.viewDetailsBtn}>
                                        View Details <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
