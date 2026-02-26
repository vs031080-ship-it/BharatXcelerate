'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ThumbsUp, Users, Tag, Clock, Heart,
    X, ChevronLeft, Sparkles, Layers, ArrowUpRight
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import styles from './explore.module.css';

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

export default function InvestorExplorePage() {
    const { ideas, toggleLikeIdea } = useData();
    const { user } = useAuth();
    const investorId = user?._id || user?.email || 'investor-1';

    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch]                 = useState('');
    const [selected, setSelected]             = useState(null);

    const filtered = ideas.filter(idea => {
        const matchCat    = activeCategory === 'All' || idea.category === activeCategory;
        const matchSearch = idea.title.toLowerCase().includes(search.toLowerCase()) ||
            (idea.description || '').toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const effectiveSelected = selected && filtered.find(i => (i.id || i._id) === (selected.id || selected._id))
        ? selected : filtered[0] || null;

    const totalLiked = ideas.filter(i => i.likes?.includes(investorId)).length;

    const handleLike = (ideaId) => toggleLikeIdea(ideaId, investorId);

    return (
        <div className={styles.page}>
            {/* ── Top Header ── */}
            <div className={styles.topHeader}>
                <div>
                    <h1 className={styles.pageTitle}><Sparkles size={20} /> Explore Ideas</h1>
                    <p className={styles.pageSub}>Discover student-built innovation ideas across domains</p>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.hStat}><span>{ideas.length}</span><span>Total Ideas</span></div>
                    <div className={styles.hStat}><span style={{ color: '#EF4444' }}>{totalLiked}</span><span>Liked</span></div>
                </div>
            </div>

            <div className={styles.body}>
                {/* ── LEFT: List Panel ── */}
                <aside className={styles.listPanel}>
                    {/* Search */}
                    <div className={styles.searchBox}>
                        <Search size={14} color="#9CA3AF" />
                        <input
                            type="text"
                            placeholder="Search ideas..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && <button onClick={() => setSearch('')}><X size={12} /></button>}
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

                    {/* Idea list rows */}
                    <div className={styles.ideaList}>
                        {filtered.length === 0 ? (
                            <div className={styles.emptyList}>
                                <Sparkles size={32} color="#E5E7EB" />
                                <p>No ideas found</p>
                            </div>
                        ) : filtered.map((idea, i) => {
                            const id       = idea.id || idea._id;
                            const sm       = STAGE_META[idea.stage] || STAGE_META['Idea'];
                            const isLiked  = idea.likes?.includes(investorId);
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
                                        {isLiked && <Heart size={10} fill="#EF4444" color="#EF4444" style={{ marginLeft: 'auto' }} />}
                                    </div>
                                    <div className={styles.rowTitle}>{idea.title}</div>
                                    <div className={styles.rowMeta}>
                                        <span><Heart size={11} /> {idea.likes?.length || 0}</span>
                                        <span><Users size={11} /> {idea.teamSize || 1}</span>
                                        <span><Clock size={11} /> {idea.createdAtFormatted || idea.createdAt}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </aside>

                {/* ── RIGHT: Detail Panel ── */}
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
                                            return <span className={styles.detailStage} style={{ background: sm.bg, color: sm.color }}>{effectiveSelected.stage}</span>;
                                        })()}
                                    </div>
                                </div>
                                <h1 className={styles.detailTitle}>{effectiveSelected.title}</h1>

                                {/* Author */}
                                <div className={styles.authorRow}>
                                    <div className={styles.authorAvatar}>
                                        {(effectiveSelected.author || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className={styles.authorName}>{effectiveSelected.author || 'Anonymous'}</div>
                                        <div className={styles.authorDate}>{effectiveSelected.createdAtFormatted || effectiveSelected.createdAt}</div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className={styles.descBox}>
                                    <div className={styles.descBoxTitle}>About This Idea</div>
                                    <p className={styles.descText}>{effectiveSelected.description}</p>
                                </div>

                                {/* Stats */}
                                <div className={styles.statsRow}>
                                    <div className={styles.statItem}>
                                        <Heart size={15} color="#EF4444" />
                                        <span><strong>{effectiveSelected.likes?.length || 0}</strong> Likes</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <Users size={15} color="#10B981" />
                                        <span><strong>{effectiveSelected.teamSize || 1}</strong> Team</span>
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

                                {/* Investor actions */}
                                <div className={styles.detailActions}>
                                    <button
                                        className={`${styles.likeBtn} ${effectiveSelected.likes?.includes(investorId) ? styles.liked : ''}`}
                                        onClick={() => {
                                            handleLike(effectiveSelected.id || effectiveSelected._id);
                                            setSelected(prev => ({
                                                ...prev,
                                                likes: prev.likes?.includes(investorId)
                                                    ? prev.likes.filter(id => id !== investorId)
                                                    : [...(prev.likes || []), investorId]
                                            }));
                                        }}
                                    >
                                        <Heart size={14} fill={effectiveSelected.likes?.includes(investorId) ? '#EF4444' : 'none'} />
                                        {effectiveSelected.likes?.includes(investorId) ? 'Liked' : 'Like Idea'}
                                    </button>
                                    <button className={styles.investBtn}>
                                        Express Interest <ArrowUpRight size={13} />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </main>
            </div>
        </div>
    );
}
