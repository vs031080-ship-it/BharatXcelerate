'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Plus, Search, Filter, ThumbsUp, Users, ArrowRight, Sparkles, Tag, Clock } from 'lucide-react';
import styles from './ideas.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const categories = ['All', 'AI/ML', 'FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'Blockchain', 'SaaS'];

const ideas = [
    { id: 1, title: 'AI-Powered Career Counselor', category: 'AI/ML', stage: 'Prototype', likes: 47, team: 3, description: 'An intelligent chatbot that analyzes student skills, interests, and market trends to provide personalized career guidance.', author: 'You', timeAgo: '2 days ago', tags: ['NLP', 'Career', 'Machine Learning'] },
    { id: 2, title: 'GreenChain — Carbon Credit NFTs', category: 'Blockchain', stage: 'Idea', likes: 32, team: 2, description: 'Tokenize carbon credits as NFTs to enable transparent, peer-to-peer trading for small businesses.', author: 'You', timeAgo: '1 week ago', tags: ['Web3', 'Sustainability', 'DeFi'] },
    { id: 3, title: 'MedTrack — Patient Compliance App', category: 'HealthTech', stage: 'MVP', likes: 68, team: 4, description: 'A gamified mobile app that helps patients stick to medication schedules through reminders and reward streaks.', author: 'You', timeAgo: '3 weeks ago', tags: ['Mobile', 'Gamification', 'Healthcare'] },
    { id: 4, title: 'FarmSense IoT Dashboard', category: 'AgriTech', stage: 'Idea', likes: 21, team: 1, description: 'Real-time soil moisture and weather monitoring dashboard for small-scale farmers using low-cost sensors.', author: 'You', timeAgo: '1 month ago', tags: ['IoT', 'Dashboard', 'Agriculture'] },
    { id: 5, title: 'SkillSwap — Peer Learning Platform', category: 'EdTech', stage: 'Prototype', likes: 55, team: 3, description: 'A platform where students barter skills — teach what you know, learn what you need — powered by a credit system.', author: 'You', timeAgo: '2 months ago', tags: ['P2P', 'Education', 'Marketplace'] },
    { id: 6, title: 'SplitEase — Expense Splitting', category: 'FinTech', stage: 'MVP', likes: 39, team: 2, description: 'Smart expense splitting app for groups with UPI auto-settle, recurring bills, and spending insights.', author: 'You', timeAgo: '2 months ago', tags: ['UPI', 'Finance', 'Groups'] },
];

const stageColors = {
    'Idea': { bg: '#FEF3C7', color: '#92400E' },
    'Prototype': { bg: '#DBEAFE', color: '#1E40AF' },
    'MVP': { bg: '#D1FAE5', color: '#065F46' },
};

export default function IdeaLabPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const filtered = ideas.filter(idea => {
        const matchCat = activeCategory === 'All' || idea.category === activeCategory;
        const matchSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) || idea.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className={styles.container}>
            {/* Hero Banner */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.bannerContent}>
                    <div className={styles.bannerIcon}><Sparkles size={28} /></div>
                    <div>
                        <h1>Idea Lab 💡</h1>
                        <p>Transform your ideas into reality. Submit, iterate, and get feedback from peers, mentors, and investors.</p>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowSubmitModal(true)}>
                    <Plus size={18} /> Submit New Idea
                </button>
            </motion.div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#2563EB' }}><Lightbulb size={20} /></div>
                    <div><span className={styles.statValue}>6</span><span className={styles.statLabel}>My Ideas</span></div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    <div className={styles.statIcon} style={{ background: '#FEF3C7', color: '#D97706' }}><ThumbsUp size={20} /></div>
                    <div><span className={styles.statValue}>262</span><span className={styles.statLabel}>Total Likes</span></div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <div className={styles.statIcon} style={{ background: '#D1FAE5', color: '#059669' }}><Users size={20} /></div>
                    <div><span className={styles.statValue}>15</span><span className={styles.statLabel}>Team Members</span></div>
                </motion.div>
            </div>

            {/* Filter Bar */}
            <motion.div className={styles.filterBar} initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <div className={styles.searchInput}>
                    <Search size={18} />
                    <input type="text" placeholder="Search ideas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className={styles.categoryTabs}>
                    {categories.map(cat => (
                        <button key={cat} className={`${styles.catTab} ${activeCategory === cat ? styles.catTabActive : ''}`} onClick={() => setActiveCategory(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Ideas Grid */}
            <div className={styles.grid}>
                {filtered.map((idea, i) => (
                    <motion.div key={idea.id} className={styles.card} initial="hidden" animate="visible" variants={fadeUp} custom={i + 4}>
                        <div className={styles.cardTop}>
                            <span className={styles.stageBadge} style={{ background: stageColors[idea.stage]?.bg, color: stageColors[idea.stage]?.color }}>{idea.stage}</span>
                            <span className={styles.categoryBadge}>{idea.category}</span>
                        </div>
                        <h3 className={styles.cardTitle}>{idea.title}</h3>
                        <p className={styles.cardDesc}>{idea.description}</p>
                        <div className={styles.cardTags}>
                            {idea.tags.map(tag => <span key={tag} className={styles.tag}><Tag size={10} /> {tag}</span>)}
                        </div>
                        <div className={styles.cardFooter}>
                            <div className={styles.cardMeta}>
                                <span className={styles.likes}><ThumbsUp size={14} /> {idea.likes}</span>
                                <span className={styles.teamSize}><Users size={14} /> {idea.team}</span>
                                <span className={styles.time}><Clock size={14} /> {idea.timeAgo}</span>
                            </div>
                            <button className={styles.viewBtn}>View <ArrowRight size={14} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className={styles.empty}>
                    <Lightbulb size={48} />
                    <h3>No ideas found</h3>
                    <p>Try a different search or category filter.</p>
                </div>
            )}
        </div>
    );
}
