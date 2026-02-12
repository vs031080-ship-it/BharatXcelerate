'use client';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, ThumbsUp, ArrowRight } from 'lucide-react';
import styles from './investor.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const ideas = [
    { id: 1, title: 'AgriTech Drone Solution', student: 'Rohan Gupta', domain: 'Agriculture', stage: 'Prototype', summary: 'Autonomous drones for precision pesticide spraying in small farms.', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=200&fit=crop' },
    { id: 2, title: 'Decentralized Identity Vault', student: 'Priya Nair', domain: 'Blockchain', stage: 'Idea', summary: 'Self-sovereign identity management system for gig workers.', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop' },
];

export default function InvestorDashboard() {
    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <div>
                    <h1>Discover the next big thing 💡</h1>
                    <p>3 new student ideas match your <strong>Deep Tech</strong> focus area.</p>
                </div>
                <button className="btn btn-white">Browse All Ideas</button>
            </div>

            <div className={styles.sectionHeader}>
                <h3>Fresh Ideas for You</h3>
            </div>

            <div className={styles.grid}>
                {ideas.map((idea, i) => (
                    <motion.div key={idea.id} className={styles.card} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                        <div className={styles.cardImg}>
                            <img src={idea.image} alt={idea.title} />
                            <span className={styles.stageBadge}>{idea.stage}</span>
                        </div>
                        <div className={styles.cardContent}>
                            <span className={styles.domain}>{idea.domain}</span>
                            <h4>{idea.title}</h4>
                            <p className={styles.summary}>{idea.summary}</p>
                            <div className={styles.meta}>
                                <span>By {idea.student}</span>
                                <button className={styles.actionBtn}><ThumbsUp size={16} /></button>
                            </div>
                            <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '12px' }}>View Pitch <ArrowRight size={14} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
