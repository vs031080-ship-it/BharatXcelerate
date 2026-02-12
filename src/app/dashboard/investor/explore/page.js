'use client';
import { motion } from 'framer-motion';
import { Search, Filter, ThumbsUp, MessageCircle, Share2, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';
import styles from '../investor.module.css'; // Reusing investor styles

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const allIdeas = [
    { id: 1, title: 'AgriTech Drone Solution', student: 'Rohan Gupta', domain: 'Agriculture', stage: 'Prototype', summary: 'Autonomous drones for precision pesticide spraying in small farms. Reduces chemical usage by 30% and increases yield.', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=200&fit=crop', date: 'Feb 10' },
    { id: 2, title: 'Decentralized Identity Vault', student: 'Priya Nair', domain: 'Blockchain', stage: 'Idea', summary: 'Self-sovereign identity management system for gig workers. Allows portable reputation across platforms like Uber, Upwork, etc.', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop', date: 'Feb 08' },
    { id: 3, title: 'AI-Powered Dyslexia Tutor', student: 'Arjun Singh', domain: 'EdTech', stage: 'MVP', summary: 'Personalized reading assistant that adapts to the learning pace and patterns of dyslexic children using speech recognition.', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop', date: 'Feb 05' },
    { id: 4, title: 'Smart Grid Energy Optimizer', student: 'Neha Patel', domain: 'CleanTech', stage: 'Prototype', summary: 'IoT device for households that optimizes energy consumption based on real-time grid pricing and usage patterns.', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop', date: 'Feb 01' },
];

export default function ExploreIdeasPage() {
    const [filter, setFilter] = useState('All');

    return (
        <div className={styles.container}>
            <div className={styles.sectionHeader} style={{ marginBottom: '32px' }}>
                <div>
                    <h1>Explore Ideas</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Discover vetted student innovations across DeepTech, SaaS, and Consumer.</p>
                </div>
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                {['All', 'DeepTech', 'EdTech', 'FinTech', 'CleanTech', 'Consumer', 'SaaS'].map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', background: filter === cat ? 'var(--color-text)' : 'white', color: filter === cat ? 'white' : 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {allIdeas.map((idea, i) => (
                    <motion.div key={idea.id} className={styles.card} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                        <div className={styles.cardImg}>
                            <img src={idea.image} alt={idea.title} />
                            <span className={styles.stageBadge}>{idea.stage}</span>
                        </div>
                        <div className={styles.cardContent}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span className={styles.domain}>{idea.domain}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> {idea.date}</span>
                            </div>
                            <h4>{idea.title}</h4>
                            <p className={styles.summary}>{idea.summary}</p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <img src={`https://ui-avatars.com/api/?name=${idea.student}&background=random`} alt={idea.student} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{idea.student}</span>
                            </div>

                            <div className={styles.meta} style={{ marginTop: 0 }}>
                                <button className={styles.actionBtn}><ThumbsUp size={16} /></button>
                                <button className={styles.actionBtn}><MessageCircle size={16} /></button>
                                <button className={styles.actionBtn}><Share2 size={16} /></button>
                                <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>Details</button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
