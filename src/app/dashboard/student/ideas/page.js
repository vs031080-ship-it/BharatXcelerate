'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lightbulb, Plus, Search, ThumbsUp, Users, Sparkles,
    Tag, Clock, X, CheckCircle, ChevronLeft, Layers,
    ArrowUpRight, Filter
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import styles from './ideas.module.css';

const categories = ['All', 'AI/ML', 'FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'Blockchain', 'SaaS'];

const STAGE_META = {
    'Idea':      { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
    'Prototype': { bg: '#DBEAFE', color: '#1E40AF', dot: '#3B82F6' },
    'MVP':       { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
};

const CAT_ICONS = {
    'AI/ML': '🤖', 'FinTech': '💰', 'EdTech': '📚', 'HealthTech': '🏥',
    'AgriTech': '🌾', 'Blockchain': '🔗', 'SaaS': '☁️', 'All': '✨',
};

export default function IdeaLabPage() {
    const { ideas, submitIdea, loading } = useData();
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery]       = useState('');
    const [showModal, setShowModal]           = useState(false);
    const [selected, setSelected]             = useState(null);
    const [toast, setToast]                   = useState('');
    const userName = user?.name || 'Student';
    const userId   = user?.userId || user?.id;

    const [newIdea, setNewIdea] = useState({
        title: '', category: 'AI/ML', stage: 'Idea',
        description: '', tags: '', teamSize: 1,
    });

    const filtered = (ideas || []).filter(idea => {
        const matchCat    = activeCategory === 'All' || idea.category === activeCategory;
        const matchSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (idea.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    // Auto-select first when filter changes
    const effectiveSelected = selected && filtered.find(i => (i.id || i._id) === (selected.id || selected._id))
        ? selected : filtered[0] || null;

    const myIdeasCount = (ideas || []).filter(i => i.authorId === userId || i.author === userName).length;
    const totalLikes   = (ideas || []).reduce((s, i) => s + (i.likes?.length || 0), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        submitIdea({
            ...newIdea,
            tags: newIdea.tags.split(',').map(t => t.trim()).filter(Boolean),
            teamSize: Number(newIdea.teamSize),
        });
        setNewIdea({ title: '', category: 'AI/ML', stage: 'Idea', description: '', tags: '', teamSize: 1 });
        setShowModal(false);
        setToast('Idea submitted!');
        setTimeout(() => setToast(''), 3000);
    };

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} /><span>Loading Idea Lab...</span>
        </div>
    );

    return (
        <div className={styles.page}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <CheckCircle size={14} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Top Header ── */}
            <div className={styles.topHeader}>
                <div>
                    <h1 className={styles.pageTitle}><Lightbulb size={20} /> Idea Lab</h1>
                    <p className={styles.pageSub}>Submit, discover, and collaborate on startup ideas</p>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.hStat}><span>{myIdeasCount}</span><span>My Ideas</span></div>
                    <div className={styles.hStat}><span>{totalLikes}</span><span>Total Likes</span></div>
                    <button className={styles.submitBtn} onClick={() => setShowModal(true)}>
                        <Plus size={15} /> Submit Idea
                    </button>
                </div>
            </div>

            <div className={styles.body}>
                {/* ── LEFT PANEL: List ── */}
                <aside className={styles.listPanel}>
                    {/* Search */}
                    <div className={styles.searchBox}>
                        <Search size={14} color="#9CA3AF" />
                        <input
                            type="text"
                            placeholder="Search ideas..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && <button onClick={() => setSearchQuery('')}><X size={12} /></button>}
                    </div>

                    {/* Category tabs */}
                    <div className={styles.catScroll}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.catTab} ${activeCategory === cat ? styles.catTabActive : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {CAT_ICONS[cat]} {cat}
                            </button>
                        ))}
                    </div>

                    {/* Idea list */}
                    <div className={styles.ideaList}>
                        {filtered.length === 0 ? (
                            <div className={styles.emptyList}>
                                <Lightbulb size={32} color="#E5E7EB" />
                                <p>No ideas found</p>
                            </div>
                        ) : filtered.map((idea, i) => {
                            const id = idea.id || idea._id;
                            const sm = STAGE_META[idea.stage] || STAGE_META['Idea'];
                            const isActive = effectiveSelected && (effectiveSelected.id || effectiveSelected._id) === id;
                            return (
                                <motion.button
                                    key={id}
                                    className={`${styles.ideaRow} ${isActive ? styles.ideaRowActive : ''}`}
                                    onClick={() => setSelected(idea)}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    <div className={styles.rowTop}>
                                        <span className={styles.rowCategory}>{idea.category}</span>
                                        <span className={styles.stageDot} style={{ background: sm.dot }} />
                                        <span className={styles.rowStage} style={{ color: sm.color }}>{idea.stage}</span>
                                    </div>
                                    <div className={styles.rowTitle}>{idea.title}</div>
                                    <div className={styles.rowMeta}>
                                        <span><ThumbsUp size={11} /> {idea.likes?.length || 0}</span>
                                        <span><Users size={11} /> {idea.teamSize || 1}</span>
                                        <span><Clock size={11} /> {idea.createdAtFormatted || idea.createdAt}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </aside>

                {/* ── RIGHT PANEL: Detail ── */}
                <main className={styles.detailPanel}>
                    {!effectiveSelected ? (
                        <div className={styles.detailEmpty}>
                            <Sparkles size={44} color="#E5E7EB" strokeWidth={1.2} />
                            <h3>Select an idea</h3>
                            <p>Pick an idea from the list to see its full details</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={effectiveSelected.id || effectiveSelected._id}
                                className={styles.detailContent}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.22 }}
                            >
                                {/* Back link for mobile */}
                                <button className={styles.backMobile} onClick={() => setSelected(null)}>
                                    <ChevronLeft size={15} /> Back to list
                                </button>

                                {/* Header */}
                                <div className={styles.detailHeader}>
                                    <div className={styles.detailIcon}>
                                        <span>{CAT_ICONS[effectiveSelected.category] || '💡'}</span>
                                    </div>
                                    <div className={styles.detailMeta}>
                                        <span className={styles.detailCat}>{effectiveSelected.category}</span>
                                        {(() => {
                                            const sm = STAGE_META[effectiveSelected.stage] || STAGE_META['Idea'];
                                            return (
                                                <span className={styles.detailStage} style={{ background: sm.bg, color: sm.color }}>
                                                    {effectiveSelected.stage}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <h1 className={styles.detailTitle}>{effectiveSelected.title}</h1>

                                {/* Author row */}
                                <div className={styles.authorRow}>
                                    <div className={styles.authorAvatar}>
                                        {(effectiveSelected.author || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className={styles.authorName}>{effectiveSelected.author || 'Anonymous'}</div>
                                        <div className={styles.authorDate}>{effectiveSelected.createdAtFormatted || effectiveSelected.createdAt}</div>
                                    </div>
                                </div>

                                {/* Description box */}
                                <div className={styles.descBox}>
                                    <div className={styles.descBoxTitle}>About This Idea</div>
                                    <p className={styles.descText}>{effectiveSelected.description}</p>
                                </div>

                                {/* Stats row */}
                                <div className={styles.statsRow}>
                                    <div className={styles.statItem}>
                                        <ThumbsUp size={15} color="#4F46E5" />
                                        <span><strong>{effectiveSelected.likes?.length || 0}</strong> Likes</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <Users size={15} color="#10B981" />
                                        <span><strong>{effectiveSelected.teamSize || 1}</strong> Team Size</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <Layers size={15} color="#F59E0B" />
                                        <span><strong>{effectiveSelected.stage}</strong> Stage</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                {effectiveSelected.tags?.length > 0 && (
                                    <div className={styles.tagsSection}>
                                        <div className={styles.tagsSectionTitle}><Tag size={13} /> Tags</div>
                                        <div className={styles.tagsList}>
                                            {effectiveSelected.tags.map(t => (
                                                <span key={t} className={styles.tagChip}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className={styles.detailActions}>
                                    <button className={styles.likeBtn}>
                                        <ThumbsUp size={14} /> Like Idea
                                    </button>
                                    <button className={styles.colabBtn}>
                                        <Users size={14} /> Request to Collaborate <ArrowUpRight size={13} />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </main>
            </div>

            {/* ── Submit Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
                        <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHead}>
                                <div className={styles.modalTitleRow}>
                                    <Sparkles size={18} color="#4F46E5" />
                                    <h2>Submit New Idea</h2>
                                </div>
                                <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className={styles.modalForm}>
                                <div className={styles.formGroup}>
                                    <label>Idea Title *</label>
                                    <input type="text" required placeholder="e.g. AI-Powered Resume Reviewer"
                                        value={newIdea.title} onChange={e => setNewIdea(p => ({ ...p, title: e.target.value }))} />
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
                                    <textarea required rows={4} placeholder="Describe your idea in detail..."
                                        value={newIdea.description} onChange={e => setNewIdea(p => ({ ...p, description: e.target.value }))} />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Tags <span>(comma separated)</span></label>
                                        <input type="text" placeholder="AI, NLP, Career"
                                            value={newIdea.tags} onChange={e => setNewIdea(p => ({ ...p, tags: e.target.value }))} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Team Size</label>
                                        <input type="number" min={1} max={10} value={newIdea.teamSize}
                                            onChange={e => setNewIdea(p => ({ ...p, teamSize: e.target.value }))} />
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className={styles.startBtn}><Sparkles size={14} /> Submit Idea</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
