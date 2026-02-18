'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Briefcase, Calendar, Trash2, MessageSquare, ChevronDown, Filter, Bookmark, CheckCircle, Clock } from 'lucide-react';
import styles from './shortlist.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const statusConfig = {
    'New': { bg: '#DBEAFE', color: '#1E40AF', icon: Bookmark },
    'Interview Scheduled': { bg: '#FEF3C7', color: '#92400E', icon: Calendar },
    'Offer Sent': { bg: '#D1FAE5', color: '#065F46', icon: CheckCircle },
};

const candidates = [
    { id: 1, name: 'Rahul Desai', role: 'Full Stack Developer', score: 920, projects: 12, skills: ['React', 'Node.js', 'AWS'], location: 'Mumbai', status: 'Interview Scheduled', shortlistedDate: 'Feb 10, 2026', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
    { id: 2, name: 'Ananya Singh', role: 'Data Scientist', score: 890, projects: 8, skills: ['Python', 'TensorFlow', 'SQL'], location: 'Bangalore', status: 'New', shortlistedDate: 'Feb 14, 2026', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { id: 3, name: 'Vikram Mehta', role: 'Blockchain Dev', score: 850, projects: 6, skills: ['Solidity', 'Web3.js', 'Rust'], location: 'Remote', status: 'Offer Sent', shortlistedDate: 'Feb 5, 2026', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { id: 4, name: 'Priya Nair', role: 'UI/UX Designer', score: 870, projects: 10, skills: ['Figma', 'CSS', 'Design Systems'], location: 'Chennai', status: 'New', shortlistedDate: 'Feb 16, 2026', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    { id: 5, name: 'Amit Patel', role: 'DevOps Engineer', score: 910, projects: 9, skills: ['Docker', 'Kubernetes', 'Terraform'], location: 'Pune', status: 'Interview Scheduled', shortlistedDate: 'Feb 12, 2026', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
];

export default function ShortlistPage() {
    const [filterStatus, setFilterStatus] = useState('All');
    const filtered = filterStatus === 'All' ? candidates : candidates.filter(c => c.status === filterStatus);

    return (
        <div className={styles.container}>
            {/* Banner */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1>Shortlisted Candidates 📋</h1>
                    <p>Manage and track your shortlisted talent pipeline.</p>
                </div>
            </motion.div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <h3>Total Shortlisted</h3>
                    <strong>5</strong>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    <h3>Interviews Scheduled</h3>
                    <strong>2</strong>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <h3>Offers Sent</h3>
                    <strong>1</strong>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                    <h3>New This Week</h3>
                    <strong>2</strong>
                </motion.div>
            </div>

            {/* Filter */}
            <motion.div className={styles.filterBar} initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                <div className={styles.filterLabel}><Filter size={16} /> Filter by Status:</div>
                {['All', 'New', 'Interview Scheduled', 'Offer Sent'].map(status => (
                    <button key={status} className={`${styles.filterBtn} ${filterStatus === status ? styles.filterBtnActive : ''}`} onClick={() => setFilterStatus(status)}>
                        {status}
                    </button>
                ))}
            </motion.div>

            {/* Candidate List */}
            <div className={styles.list}>
                {filtered.map((c, i) => {
                    const statusInfo = statusConfig[c.status];
                    return (
                        <motion.div key={c.id} className={styles.candidateRow} initial="hidden" animate="visible" variants={fadeUp} custom={i + 5}>
                            <div className={styles.candidateInfo}>
                                <img src={c.image} alt={c.name} className={styles.avatar} />
                                <div className={styles.candidateDetails}>
                                    <div className={styles.nameRow}>
                                        <h4>{c.name}</h4>
                                        <span className={styles.statusBadge} style={{ background: statusInfo.bg, color: statusInfo.color }}>
                                            <statusInfo.icon size={12} /> {c.status}
                                        </span>
                                    </div>
                                    <p className={styles.candidateRole}>{c.role}</p>
                                    <div className={styles.candidateMeta}>
                                        <span><Star size={12} fill="#FACC15" color="#FACC15" /> {c.score}</span>
                                        <span><Briefcase size={12} /> {c.projects} Projects</span>
                                        <span><MapPin size={12} /> {c.location}</span>
                                        <span><Clock size={12} /> {c.shortlistedDate}</span>
                                    </div>
                                    <div className={styles.skills}>
                                        {c.skills.map(s => <span key={s}>{s}</span>)}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.candidateActions}>
                                <button className="btn btn-primary btn-sm">View Profile</button>
                                <button className={styles.iconAction} title="Message"><MessageSquare size={16} /></button>
                                <button className={`${styles.iconAction} ${styles.removeAction}`} title="Remove"><Trash2 size={16} /></button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className={styles.empty}>
                    <Bookmark size={48} />
                    <h3>No candidates found</h3>
                    <p>Try a different filter.</p>
                </div>
            )}
        </div>
    );
}
