'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Clock, BarChart, ArrowRight, CheckCircle, Target, Zap, LayoutGrid, LayoutList } from 'lucide-react';
import Link from 'next/link';
import styles from './explore.module.css';

const allProjects = [
    { id: 1, title: 'E-Commerce Platform', domain: 'Full Stack', difficulty: 'Intermediate', points: 300, image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=250&fit=crop', description: 'Build a fully functional e-commerce platform with product listings, cart, and checkout.' },
    { id: 2, title: 'AI Resume Screener', domain: 'AI/ML', difficulty: 'Intermediate', points: 200, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop', description: 'Create an AI-powered tool to parse and screen resumes against job descriptions.' },
    { id: 3, title: 'DeFi Lending Protocol', domain: 'Blockchain', difficulty: 'Advanced', points: 350, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop', description: 'Develop a decentralized lending protocol on Ethereum using Solidity and React.' },
    { id: 4, title: 'Task Manager API', domain: 'Backend', difficulty: 'Beginner', points: 100, image: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=400&h=250&fit=crop', description: 'Build a RESTful API for a task management application with user authentication.' },
    { id: 5, title: 'Portfolio Website', domain: 'Frontend', difficulty: 'Beginner', points: 150, image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=250&fit=crop', description: 'Design and build a responsive personal portfolio website to showcase your skills.' },
    { id: 6, title: 'Stock Market Predictor', domain: 'Data Science', difficulty: 'Advanced', points: 400, image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=400&h=250&fit=crop', description: 'Use historical stock data to predict future price movements using machine learning models.' },
    { id: 7, title: 'Chat Application', domain: 'Full Stack', difficulty: 'Intermediate', points: 250, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop', description: 'Real-time chat application with web sockets, user presence, and message history.' },
    { id: 8, title: 'Smart Contract Auditor', domain: 'Blockchain', difficulty: 'Expert', points: 500, image: 'https://images.unsplash.com/photo-1621504450168-38f647311816?w=400&h=250&fit=crop', description: 'Automated tool to detect common vulnerabilities in Solidity smart contracts.' },
];

const domains = ['All Domains', 'Full Stack', 'AI/ML', 'Blockchain', 'Backend', 'Frontend', 'Data Science'];
const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function ExploreProjectsPage() {
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');
    const [domainFilter, setDomainFilter] = useState('All Domains');
    const [levelFilter, setLevelFilter] = useState('All Levels');

    const filteredProjects = allProjects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
        const matchesDomain = domainFilter === 'All Domains' || p.domain === domainFilter;
        const matchesLevel = levelFilter === 'All Levels' || p.difficulty === levelFilter;
        return matchesSearch && matchesDomain && matchesLevel;
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Explore Projects</h1>
                    <p>Discover real-world projects to build your portfolio and earn XP.</p>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search projects by title or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <select className={styles.filterSelect} value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)}>
                        {domains.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select className={styles.filterSelect} value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                        {difficulties.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>

                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.toggleBtn} ${view === 'grid' ? styles.activeView : ''}`}
                            onClick={() => setView('grid')}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${view === 'list' ? styles.activeView : ''}`}
                            onClick={() => setView('list')}
                            title="List View"
                        >
                            <LayoutList size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {view === 'grid' ? (
                <div className={styles.grid}>
                    {filteredProjects.map((p) => (
                        <motion.div
                            key={p.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={p.image} alt={p.title} className={styles.cardImage} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardMeta}>
                                    <span className={styles.domainBadge}>{p.domain}</span>
                                    <span className={styles.difficulty}>
                                        <Zap size={14} fill={p.difficulty === 'Expert' ? '#475467' : 'none'} />
                                        {p.difficulty}
                                    </span>
                                </div>
                                <h3 className={styles.cardTitle}>{p.title}</h3>
                                <p className={styles.cardDesc}>{p.description}</p>
                                <div className={styles.cardFooter}>
                                    <span className={styles.points}>
                                        <Target size={16} /> +{p.points} XP
                                    </span>
                                    <button className={styles.startBtn}>
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className={styles.list}>
                    {filteredProjects.map((p) => (
                        <motion.div
                            key={p.id}
                            className={`${styles.card} ${styles.listCard}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={p.image} alt={p.title} className={styles.listImage} />
                            <div className={styles.listContent}>
                                <div className={styles.listInfo}>
                                    <div className={styles.listMeta}>
                                        <span className={styles.domainBadge}>{p.domain}</span>
                                        <span className={styles.difficulty}>{p.difficulty}</span>
                                    </div>
                                    <h3 className={styles.listTitle}>{p.title}</h3>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#475467' }}>{p.description}</p>
                                </div>
                                <div className={styles.listStats}>
                                    <span className={styles.points}>
                                        <Target size={16} /> +{p.points} XP
                                    </span>
                                    <button className={styles.startBtn}>
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
