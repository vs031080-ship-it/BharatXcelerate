'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Star, Briefcase, ChevronDown, CheckSquare, UserPlus, CheckCircle, X } from 'lucide-react';
import { useData } from '@/context/DataContext';
import styles from './talent.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };

const candidates = [
    { candidateId: 1, candidateName: 'Rahul Desai', role: 'Full Stack Developer', score: 920, projects: 12, skills: ['React', 'Node.js', 'AWS'], location: 'Mumbai', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
    { candidateId: 2, candidateName: 'Ananya Singh', role: 'Data Scientist', score: 890, projects: 8, skills: ['Python', 'TensorFlow', 'SQL'], location: 'Bangalore', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { candidateId: 3, candidateName: 'Vikram Mehta', role: 'Blockchain Dev', score: 850, projects: 6, skills: ['Solidity', 'Web3.js', 'Rust'], location: 'Remote', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { candidateId: 4, candidateName: 'Sana Khan', role: 'UX Designer', score: 840, projects: 10, skills: ['Figma', 'Prototyping', 'User Research'], location: 'Delhi', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face' },
    { candidateId: 5, candidateName: 'Amit Patel', role: 'DevOps Engineer', score: 910, projects: 9, skills: ['Docker', 'Kubernetes', 'Terraform'], location: 'Pune', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    { candidateId: 6, candidateName: 'Priya Nair', role: 'UI/UX Designer', score: 870, projects: 10, skills: ['Figma', 'CSS', 'Design Systems'], location: 'Chennai', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
];

export default function TalentSearchPage() {
    const { shortlist, shortlistCandidate } = useData();
    const [search, setSearch] = useState('');
    const [minScore, setMinScore] = useState(0);
    const [locationFilter, setLocationFilter] = useState('All');
    const [toast, setToast] = useState('');

    const shortlistedIds = shortlist.map(s => s.candidateId);

    const filteredCandidates = candidates.filter(c => {
        const matchSearch = c.candidateName.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
        const matchScore = c.score >= minScore;
        const matchLocation = locationFilter === 'All' || c.location === locationFilter;
        return matchSearch && matchScore && matchLocation;
    });

    const handleShortlist = (candidate) => {
        if (!shortlistedIds.includes(candidate.candidateId)) {
            shortlistCandidate(candidate);
            setToast(`${candidate.candidateName} added to shortlist!`);
            setTimeout(() => setToast(''), 3000);
        }
    };

    const locations = ['All', ...new Set(candidates.map(c => c.location))];

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
                    <p>Search verified students by skills, scorecard rating, and project experience.</p>
                </div>
            </motion.div>

            {/* Search & Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchInput}>
                    <Search size={18} />
                    <input type="text" placeholder="Search by name, skill, or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className={styles.filters}>
                    <select className={styles.filterSelect} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))}>
                        <option value={0}>Min Score</option>
                        <option value={800}>800+</option>
                        <option value={850}>850+</option>
                        <option value={900}>900+</option>
                    </select>
                    <select className={styles.filterSelect} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                        {locations.map(l => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            <div className={styles.candidateGrid}>
                {filteredCandidates.map((c, i) => {
                    const isShortlisted = shortlistedIds.includes(c.candidateId);
                    return (
                        <motion.div key={c.candidateId} className={styles.candidateCard} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                            <div className={styles.cardHeader}>
                                <div className={styles.scoreBadge}><Star size={12} fill="#FACC15" color="#FACC15" /> {c.score}</div>
                            </div>
                            <div className={styles.cardBody}>
                                <img src={c.image} alt={c.candidateName} className={styles.avatar} />
                                <h4>{c.candidateName}</h4>
                                <p className={styles.role}>{c.role}</p>
                                <div className={styles.meta}>
                                    <span><Briefcase size={12} /> {c.projects} Projects</span>
                                    <span><MapPin size={12} /> {c.location}</span>
                                </div>
                                <div className={styles.skills}>
                                    {c.skills.map(s => <span key={s}>{s}</span>)}
                                </div>
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

            {filteredCandidates.length === 0 && (
                <div className={styles.empty}>
                    <Search size={48} />
                    <h3>No candidates found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            )}
        </div>
    );
}
