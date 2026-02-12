'use client';
import { motion } from 'framer-motion';
import { Briefcase, Search, Star, Filter, MapPin, ChevronRight, Bookmark } from 'lucide-react';
import styles from './company.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const candidates = [
    { id: 1, name: 'Rahul Desai', role: 'Full Stack Developer', score: 920, projects: 12, skills: ['React', 'Node.js', 'AWS'], location: 'Mumbai', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
    { id: 2, name: 'Ananya Singh', role: 'Data Scientist', score: 890, projects: 8, skills: ['Python', 'TensorFlow', 'SQL'], location: 'Bangalore', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { id: 3, name: 'Vikram Mehta', role: 'Blockchain Dev', score: 850, projects: 6, skills: ['Solidity', 'Web3.js', 'Rust'], location: 'Remote', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
];

export default function CompanyDashboard() {
    return (
        <div className={styles.container}>
            {/* Banner */}
            <div className={styles.banner}>
                <div>
                    <h1>Find your next hire 🚀</h1>
                    <p>You have <strong>5 new matches</strong> based on your hiring criteria.</p>
                </div>
                <button className="btn btn-white">Post New Role</button>
            </div>

            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <h3>Shortlisted</h3>
                    <strong>12</strong>
                </div>
                <div className={styles.statCard}>
                    <h3>Interviews</h3>
                    <strong>4</strong>
                </div>
                <div className={styles.statCard}>
                    <h3>Offers Sent</h3>
                    <strong>1</strong>
                </div>
            </div>

            <div className={styles.sectionHeader}>
                <h3>Top Candidates for You</h3>
                <button className={styles.linkBtn}>View All Talent <ChevronRight size={16} /></button>
            </div>

            <div className={styles.candidateGrid}>
                {candidates.map((c, i) => (
                    <motion.div key={c.id} className={styles.candidateCard} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                        <div className={styles.cardHeader}>
                            <div className={styles.scoreBadge}><Star size={12} fill="#FACC15" color="#FACC15" /> {c.score}</div>
                            <button className={styles.saveBtn}><Bookmark size={16} /></button>
                        </div>
                        <div className={styles.cardBody}>
                            <img src={c.image} alt={c.name} className={styles.avatar} />
                            <h4>{c.name}</h4>
                            <p className={styles.role}>{c.role}</p>
                            <div className={styles.meta}>
                                <span><Briefcase size={12} /> {c.projects} Projects</span>
                                <span><MapPin size={12} /> {c.location}</span>
                            </div>
                            <div className={styles.skills}>
                                {c.skills.map(s => <span key={s}>{s}</span>)}
                            </div>
                        </div>
                        <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '16px' }}>View Profile</button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
