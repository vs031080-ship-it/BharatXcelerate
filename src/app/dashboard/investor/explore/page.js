'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ThumbsUp, Users, ArrowRight, Tag, Clock, Eye, X, Heart } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import styles from './explore.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };
const categories = ['All', 'AI/ML', 'FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'Blockchain', 'SaaS'];
const stageColors = {
    'Idea': { bg: '#FEF3C7', color: '#92400E' },
    'Prototype': { bg: '#DBEAFE', color: '#1E40AF' },
    'MVP': { bg: '#D1FAE5', color: '#065F46' },
};

export default function InvestorExplorePage() {
    const { ideas, toggleLikeIdea } = useData();
    const { user } = useAuth();
    const investorId = user?._id || user?.email || 'investor-1';
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedIdea, setSelectedIdea] = useState(null);

    const filtered = ideas.filter(idea => {
        const matchCat = activeCategory === 'All' || idea.category === activeCategory;
        const matchSearch = idea.title.toLowerCase().includes(search.toLowerCase()) || idea.description.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const handleLike = (ideaId) => {
        toggleLikeIdea(ideaId, investorId);
    };

    return (
        <div className={styles.container}>
            {/* Banner */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1>Explore Ideas 🚀</h1>
                    <p>Discover {ideas.length} student-built innovation ideas across domains.</p>
                </div>
            </motion.div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchInput}>
                    <Search size={18} />
                    <input type="text" placeholder="Search ideas by title or keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className={styles.categoryTabs}>
                    {categories.map(cat => (
                        <button key={cat} className={`${styles.catTab} ${activeCategory === cat ? styles.catTabActive : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
                    ))}
                </div>
            </div>

            {/* Ideas Grid */}
            <div className={styles.grid}>
                {filtered.map((idea, i) => {
                    const isLiked = idea.likes.includes(investorId);
                    return (
                        <motion.div key={idea.id} className={styles.card} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                            <div className={styles.cardTop}>
                                <span className={styles.stageBadge} style={{ background: stageColors[idea.stage]?.bg, color: stageColors[idea.stage]?.color }}>{idea.stage}</span>
                                <span className={styles.categoryBadge}>{idea.category}</span>
                            </div>
                            <h3>{idea.title}</h3>
                            <p className={styles.cardDesc}>{idea.description}</p>
                            <div className={styles.cardTags}>
                                {idea.tags.map(tag => <span key={tag}><Tag size={10} /> {tag}</span>)}
                            </div>
                            <div className={styles.authorRow}>
                                <span>By {idea.author}</span>
                                <span><Users size={12} /> Team of {idea.teamSize}</span>
                            </div>
                            <div className={styles.cardActions}>
                                <button className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`} onClick={() => handleLike(idea.id)}>
                                    <Heart size={16} fill={isLiked ? '#EF4444' : 'none'} /> {idea.likes.length}
                                </button>
                                <button className={styles.detailsBtn} onClick={() => setSelectedIdea(idea)}>
                                    <Eye size={14} /> Details
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className={styles.empty}>
                    <Search size={48} />
                    <h3>No ideas found</h3>
                    <p>Try adjusting your filters.</p>
                </div>
            )}

            {/* Idea Detail Modal */}
            <AnimatePresence>
                {selectedIdea && (
                    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIdea(null)}>
                        <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <div>
                                    <h2>{selectedIdea.title}</h2>
                                    <p style={{ fontSize: '0.875rem', color: '#6941C6', marginTop: 4 }}>{selectedIdea.category} · {selectedIdea.stage} · By {selectedIdea.author}</p>
                                </div>
                                <button className={styles.closeBtn} onClick={() => setSelectedIdea(null)}><X size={20} /></button>
                            </div>
                            <div style={{ padding: '24px 28px' }}>
                                <p style={{ fontSize: '0.9375rem', color: '#475467', lineHeight: 1.7, marginBottom: 20 }}>{selectedIdea.description}</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                                    {selectedIdea.tags.map(t => <span key={t} style={{ fontSize: '0.75rem', background: '#F9F5FF', color: '#6941C6', padding: '4px 10px', borderRadius: 6 }}>{t}</span>)}
                                </div>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <button
                                        className={`${styles.likeBtn} ${selectedIdea.likes.includes(investorId) ? styles.liked : ''}`}
                                        onClick={() => { handleLike(selectedIdea.id); setSelectedIdea(prev => ({ ...prev, likes: prev.likes.includes(investorId) ? prev.likes.filter(id => id !== investorId) : [...prev.likes, investorId] })); }}
                                        style={{ padding: '10px 20px' }}
                                    >
                                        <Heart size={16} fill={selectedIdea.likes.includes(investorId) ? '#EF4444' : 'none'} /> {selectedIdea.likes.length} likes
                                    </button>
                                    <span style={{ fontSize: '0.8125rem', color: '#98A2B3' }}><Users size={14} /> Team of {selectedIdea.teamSize}</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
