'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Plus, Search, ThumbsUp, Users, ArrowRight, Sparkles, Tag, Clock, X, CheckCircle, Eye } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import styles from './ideas.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };

const categories = ['All', 'AI/ML', 'FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'Blockchain', 'SaaS'];
const stageColors = {
    'Idea': { bg: '#FEF3C7', color: '#92400E' },
    'Prototype': { bg: '#DBEAFE', color: '#1E40AF' },
    'MVP': { bg: '#D1FAE5', color: '#065F46' },
};

export default function IdeaLabPage() {
    const { ideas, submitIdea, loading } = useData();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [toast, setToast] = useState('');
    const { user } = useAuth();
    const userName = user?.name || 'Student';
    const userId = user?.userId || user?.id;
    const [newIdea, setNewIdea] = useState({ title: '', category: 'AI/ML', stage: 'Idea', description: '', tags: '', teamSize: 1, author: '' });

    const filtered = (ideas || []).filter(idea => {
        const matchCat = activeCategory === 'All' || idea.category === activeCategory;
        const matchSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (idea.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const myIdeasCount = (ideas || []).filter(i => i.authorId === userId || i.author === userName).length;
    const totalLikes = (ideas || []).reduce((sum, i) => sum + (i.likes?.length || 0), 0);
    const totalTeam = (ideas || []).reduce((sum, i) => sum + (i.teamSize || 0), 0);

    const handleSubmitIdea = (e) => {
        e.preventDefault();
        submitIdea({ ...newIdea, tags: newIdea.tags.split(',').map(t => t.trim()).filter(Boolean), teamSize: Number(newIdea.teamSize) });
        setNewIdea({ title: '', category: 'AI/ML', stage: 'Idea', description: '', tags: '', teamSize: 1, author: '' });
        setShowSubmitModal(false);
        setToast('Idea submitted successfully!');
        setTimeout(() => setToast(''), 3000);
    };

    if (loading) {
        return (
            <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTopColor: '#2563EB', borderRadius: '50%' }}
                />
            </div>
        );
    }

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

            {/* Hero Banner */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.bannerContent}>
                    <div className={styles.bannerIcon}><Sparkles size={28} /></div>
                    <div>
                        <h1>Idea Lab 💡</h1>
                        <p>Transform your ideas into reality. Submit, iterate, and get feedback from investors.</p>
                    </div>
                </div>
                <button className={styles.submitNewBtn} onClick={() => setShowSubmitModal(true)}>
                    <Plus size={18} /> Submit New Idea
                </button>
            </motion.div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#2563EB' }}><Lightbulb size={20} /></div>
                    <div><span className={styles.statValue}>{myIdeasCount}</span><span className={styles.statLabel}>My Ideas</span></div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    <div className={styles.statIcon} style={{ background: '#FEF3C7', color: '#D97706' }}><ThumbsUp size={20} /></div>
                    <div><span className={styles.statValue}>{totalLikes}</span><span className={styles.statLabel}>Total Likes</span></div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <div className={styles.statIcon} style={{ background: '#D1FAE5', color: '#059669' }}><Users size={20} /></div>
                    <div><span className={styles.statValue}>{totalTeam}</span><span className={styles.statLabel}>Team Members</span></div>
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
                        <button key={cat} className={`${styles.catTab} ${activeCategory === cat ? styles.catTabActive : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
                    ))}
                </div>
            </motion.div>

            {/* Ideas Grid */}
            <div className={styles.grid}>
                {filtered.map((idea, i) => (
                    <motion.div key={idea.id || idea._id} className={styles.card} initial="hidden" animate="visible" variants={fadeUp} custom={i + 4}>
                        <div className={styles.cardTop}>
                            <span className={styles.stageBadge} style={{ background: stageColors[idea.stage]?.bg, color: stageColors[idea.stage]?.color }}>{idea.stage}</span>
                            <span className={styles.categoryBadge}>{idea.category}</span>
                        </div>
                        <h3 className={styles.cardTitle}>{idea.title}</h3>
                        <p className={styles.cardDesc}>{idea.description}</p>
                        <div className={styles.cardTags}>
                            {(idea.tags || []).map(tag => <span key={tag} className={styles.tag}><Tag size={10} /> {tag}</span>)}
                        </div>
                        <div className={styles.cardFooter}>
                            <div className={styles.cardMeta}>
                                <span className={styles.likes}><ThumbsUp size={14} /> {idea.likes?.length || 0}</span>
                                <span className={styles.teamSize}><Users size={14} /> {idea.teamSize || 1}</span>
                                <span className={styles.time}><Clock size={14} /> {idea.createdAtFormatted || idea.createdAt}</span>
                            </div>
                            <button className={styles.viewBtn} onClick={() => setSelectedIdea(idea)}>View <ArrowRight size={14} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && !loading && (
                <div className={styles.empty}>
                    <Lightbulb size={48} />
                    <h3>No ideas found</h3>
                    <p>Try a different search or category filter.</p>
                </div>
            )}

            {/* Submit Idea Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSubmitModal(false)}>
                        <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Submit New Idea</h2>
                                <button className={styles.closeBtn} onClick={() => setShowSubmitModal(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmitIdea} className={styles.modalForm}>
                                <div className={styles.formGroup}>
                                    <label>Idea Title *</label>
                                    <input type="text" required placeholder="e.g. AI-Powered Resume Reviewer" value={newIdea.title} onChange={e => setNewIdea(p => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Category</label>
                                        <select value={newIdea.category} onChange={e => setNewIdea(p => ({ ...p, category: e.target.value }))}>
                                            {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Stage</label>
                                        <select value={newIdea.stage} onChange={e => setNewIdea(p => ({ ...p, stage: e.target.value }))}>
                                            <option>Idea</option><option>Prototype</option><option>MVP</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description *</label>
                                    <textarea required rows={3} placeholder="Describe your idea..." value={newIdea.description} onChange={e => setNewIdea(p => ({ ...p, description: e.target.value }))} />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Tags (comma separated)</label>
                                        <input type="text" placeholder="e.g. AI, NLP, Career" value={newIdea.tags} onChange={e => setNewIdea(p => ({ ...p, tags: e.target.value }))} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Team Size</label>
                                        <input type="number" min={1} max={10} value={newIdea.teamSize} onChange={e => setNewIdea(p => ({ ...p, teamSize: e.target.value }))} />
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowSubmitModal(false)}>Cancel</button>
                                    <button type="submit" className={styles.submitBtn}><Sparkles size={16} /> Submit Idea</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Idea Detail Modal */}
            <AnimatePresence>
                {selectedIdea && (
                    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIdea(null)}>
                        <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <div>
                                    <h2>{selectedIdea.title}</h2>
                                    <p style={{ fontSize: '0.875rem', color: '#6941C6', marginTop: 4 }}>{selectedIdea.category} · {selectedIdea.stage}</p>
                                </div>
                                <button className={styles.closeBtn} onClick={() => setSelectedIdea(null)}><X size={20} /></button>
                            </div>
                            <div style={{ padding: '24px 28px' }}>
                                <p style={{ fontSize: '0.9375rem', color: '#475467', lineHeight: 1.7, marginBottom: 20 }}>{selectedIdea.description}</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                                    {selectedIdea.tags.map(t => <span key={t} className={styles.tag}><Tag size={10} /> {t}</span>)}
                                </div>
                                <div style={{ display: 'flex', gap: 20, fontSize: '0.8125rem', color: '#667085' }}>
                                    <span><ThumbsUp size={14} /> {selectedIdea.likes.length} likes</span>
                                    <span><Users size={14} /> Team of {selectedIdea.teamSize}</span>
                                    <span><Clock size={14} /> {selectedIdea.createdAt}</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
