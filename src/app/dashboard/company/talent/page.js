'use client';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Star, Briefcase, ChevronDown, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../company.module.css'; // Reusing company styles

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const candidates = [
    { id: 1, name: 'Rahul Desai', role: 'Full Stack Developer', score: 920, projects: 12, skills: ['React', 'Node.js', 'AWS'], location: 'Mumbai', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
    { id: 2, name: 'Ananya Singh', role: 'Data Scientist', score: 890, projects: 8, skills: ['Python', 'TensorFlow', 'SQL'], location: 'Bangalore', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { id: 3, name: 'Vikram Mehta', role: 'Blockchain Dev', score: 850, projects: 6, skills: ['Solidity', 'Web3.js', 'Rust'], location: 'Remote', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { id: 4, name: 'Sana Khan', role: 'UX Designer', score: 840, projects: 10, skills: ['Figma', 'Prototyping', 'User Research'], location: 'Delhi', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face', },
    { id: 5, name: 'Amit Patel', role: 'DevOps Engineer', score: 810, projects: 7, skills: ['Docker', 'Kubernetes', 'CI/CD'], location: 'Pune', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
];

export default function TalentSearchPage() {
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.sectionHeader} style={{ marginBottom: '32px' }}>
                <div>
                    <h1>Find Talent</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Search verified students by skills, scorecard rating, and project experience.</p>
                </div>
                <button className="btn btn-primary">Saved Candidates (12)</button>
            </div>

            {/* Search & Filter Bar */}
            <div style={{ background: 'white', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-bg)', padding: '10px 16px', borderRadius: 'var(--radius-md)' }}>
                    <Search size={18} color="var(--color-text-secondary)" />
                    <input type="text" placeholder="Search by name, skill, or role..." style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '0.9375rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
                        Min Score <ChevronDown size={14} />
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
                        Location <ChevronDown size={14} />
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
                        <Filter size={14} /> More Filters
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <div className={styles.candidateGrid}>
                {candidates.map((c, i) => (
                    <motion.div key={c.id} className={styles.candidateCard} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                        <div className={styles.cardHeader}>
                            <div className={styles.scoreBadge}><Star size={12} fill="#FACC15" color="#FACC15" /> {c.score}</div>
                            <button className={styles.saveBtn}><CheckSquare size={18} /></button>
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
                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                            <Link href={`/dashboard/company/talent/1`} className="btn btn-outline btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Profile</Link>
                            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Contact</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
