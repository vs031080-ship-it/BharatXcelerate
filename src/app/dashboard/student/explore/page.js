'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, Target, ArrowRight, LayoutGrid, LayoutList } from 'lucide-react';
import Link from 'next/link';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from './explore.module.css';

const fallbackProjects = [
    { id: 1, title: 'E-Commerce Platform', domain: 'Full Stack', difficulty: 'Intermediate', points: 300, image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=250&fit=crop', description: 'Build a fully functional e-commerce platform with product listings, cart, and checkout.' },
    { id: 2, title: 'AI Resume Screener', domain: 'AI/ML', difficulty: 'Intermediate', points: 200, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop', description: 'Create an AI-powered tool to parse and screen resumes against job descriptions.' },
    { id: 3, title: 'DeFi Lending Protocol', domain: 'Blockchain', difficulty: 'Advanced', points: 350, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop', description: 'Develop a decentralized lending protocol on Ethereum using Solidity and React.' },
    { id: 4, title: 'Task Manager API', domain: 'Backend', difficulty: 'Beginner', points: 100, image: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=400&h=250&fit=crop', description: 'Build a RESTful API for a task management application with user authentication.' },
    { id: 5, title: 'Portfolio Website', domain: 'Frontend', difficulty: 'Beginner', points: 150, image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=250&fit=crop', description: 'Design and build a responsive personal portfolio website to showcase your skills.' },
    { id: 6, title: 'Stock Market Predictor', domain: 'Data Science', difficulty: 'Advanced', points: 400, image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=400&h=250&fit=crop', description: 'Use historical stock data to predict future price movements using machine learning models.' },
    { id: 7, title: 'Chat Application', domain: 'Full Stack', difficulty: 'Intermediate', points: 250, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop', description: 'Real-time chat application with web sockets, user presence, and message history.' },
    { id: 8, title: 'Smart Contract Auditor', domain: 'Blockchain', difficulty: 'Expert', points: 500, image: 'https://images.unsplash.com/photo-1621504450168-38f647311816?w=400&h=250&fit=crop', description: 'Automated tool to detect common vulnerabilities in Solidity smart contracts.' },
];

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
    const [statusFilter, setStatusFilter] = useState('all');
    const [allProjects, setAllProjects] = useState(fallbackProjects);
    const [acceptedMap, setAcceptedMap] = useState({});

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/admin/projects', { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    if (data.projects && data.projects.length > 0) {
                        const apiProjects = data.projects.map(p => ({
                            id: p._id, title: p.title, domain: p.domain, difficulty: p.difficulty,
                            points: p.points, image: p.image || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=250&fit=crop',
                            description: p.description,
                        }));
                        setAllProjects([...apiProjects, ...fallbackProjects]);
                    }
                }
            } catch { /* use fallback */ }
        };

        const fetchAccepted = async () => {
            try {
                const res = await fetch('/api/student/submit', { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    const map = {};
                    (data.submissions || []).forEach(s => {
                        map[s.project?._id || s.project] = s.status;
                    });
                    setAcceptedMap(map);
                }
            } catch { /* ignore */ }
        };

        fetchProjects();
        fetchAccepted();
    }, []);


    const getProjectStatus = (id) => acceptedMap[id] || null;

    const filteredProjects = allProjects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
        const matchesDomain = domainFilter === 'All Domains' || p.domain === domainFilter;
        const matchesLevel = levelFilter === 'All Levels' || p.difficulty === levelFilter;
        const status = getProjectStatus(p.id);
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'accepted' && status) ||
            (statusFilter === 'available' && !status);
        return matchesSearch && matchesDomain && matchesLevel && matchesStatus;
    });

    const acceptedCount = allProjects.filter(p => getProjectStatus(p.id)).length;
    const availableCount = allProjects.length - acceptedCount;

    const getStatusLabel = (status) => {
        if (!status) return null;
        if (status === 'accepted_by_student') return 'Accepted';
        if (status === 'submitted') return 'Submitted';
        if (status === 'accepted') return 'Graded ✓';
        if (status === 'rejected') return 'Rejected';
        return status;
    };

    return (
        <div className={styles.container}>
            {/* Gradient Banner */}
            <div className={styles.banner}>
                <div>
                    <h1>Explore Projects</h1>
                    <p>Discover real-world projects to build your portfolio and earn XP.</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
                {[
                    { key: 'all', label: `All Projects ${allProjects.length}` },
                    { key: 'available', label: `Available ${availableCount}` },
                    { key: 'accepted', label: `My Accepted ${acceptedCount}` },
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.tabBtn} ${statusFilter === tab.key ? styles.tabActive : ''}`}
                        onClick={() => setStatusFilter(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
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

            {/* Grid View — Upstream Vendors style */}
            {view === 'grid' ? (
                <div className={styles.grid}>
                    {filteredProjects.map((p) => {
                        const status = getProjectStatus(p.id);
                        const dc = difficultyColors[p.difficulty] || {};
                        return (
                            <motion.div key={p.id} className={`${styles.card} ${status ? styles.cardAccepted : ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                {/* Card Header with Avatar */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardAvatar} style={{ background: dc.bg, color: dc.color }}>
                                        {p.title.charAt(0)}
                                    </div>
                                    <div className={styles.cardTitleArea}>
                                        <h3 className={styles.cardTitle}>{p.title}</h3>
                                        <span className={styles.cardDomain}>{p.domain}</span>
                                    </div>
                                    {status && (
                                        <span className={styles.statusPill}>{getStatusLabel(status)}</span>
                                    )}
                                </div>

                                {/* Description */}
                                <p className={styles.cardDesc}>{p.description}</p>

                                {/* Difficulty Badge */}
                                <div className={styles.cardBadgeRow}>
                                    <span className={styles.diffBadge} style={{ background: dc.bg, color: dc.color }}>
                                        <Zap size={12} /> {p.difficulty}
                                    </span>
                                </div>

                                {/* Stats Footer — Upstream Vendors style */}
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
                                        <Link href={`/dashboard/student/projects/${p.id}`} className={status ? styles.viewBtn : styles.viewDetailsBtn}>
                                            {status ? 'View' : 'View Details'} <ArrowRight size={14} />
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
                        const status = getProjectStatus(p.id);
                        const dc = difficultyColors[p.difficulty] || {};
                        return (
                            <motion.div key={p.id} className={`${styles.listRow} ${status ? styles.listRowAccepted : ''}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                                <div className={styles.listAvatar} style={{ background: dc.bg, color: dc.color }}>
                                    {p.title.charAt(0)}
                                </div>
                                <div className={styles.listInfo}>
                                    <h3>{p.title}</h3>
                                    <span>{p.domain} · {p.difficulty} · +{p.points} XP</span>
                                </div>
                                <div className={styles.listActions}>
                                    {status && <span className={styles.statusPill}>{getStatusLabel(status)}</span>}
                                    <Link href={`/dashboard/student/projects/${p.id}`} className={status ? styles.viewBtn : styles.viewDetailsBtn}>
                                        {status ? 'View' : 'View Details'} <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {filteredProjects.length === 0 && (
                <div className={styles.emptyState}>
                    <Search size={48} />
                    <h3>No projects found</h3>
                    <p>Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    );
}
