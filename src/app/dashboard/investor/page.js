'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Lightbulb, ArrowRight, Eye, Sparkles, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import styles from './investor.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.04 } }) };

const stageColors = {
    'Idea': { bg: '#FEF3C7', color: '#92400E' },
    'Prototype': { bg: '#DBEAFE', color: '#1E40AF' },
    'MVP': { bg: '#D1FAE5', color: '#065F46' },
};

export default function InvestorDashboardPage() {
    const { ideas, shortlist, loading } = useData();
    const { user } = useAuth();
    const userId = user?.userId || user?.id;
    const firstName = user?.name?.split(' ')[0] || 'Investor';

    const newestIdeas = (ideas || []).slice(0, 4);
    const activeInvestmentsCount = (ideas || []).filter(i => i.likes?.length > 0).length;

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
            {/* Welcome Banner — Upstream style */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.bannerContent}>
                    <span className={styles.bannerBreadcrumb}>Investor · Dashboard</span>
                    <h1>Welcome back, {firstName} 👋</h1>
                    <p>Discover the latest student innovations and investment opportunities.</p>
                </div>
                <Link href="/dashboard/investor/explore" className={styles.browseBtn}>
                    <Sparkles size={18} /> Browse All Ideas
                </Link>
            </motion.div>

            {/* Stats — Compact icon-left */}
            <div className={styles.statsRow}>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#2563EB' }}><Lightbulb size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{ideas.length}</span>
                        <span className={styles.statLabel}>Ideas Pipeline</span>
                    </div>
                    <TrendingUp size={14} className={styles.statTrend} />
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    <div className={styles.statIcon} style={{ background: '#D1FAE5', color: '#059669' }}><TrendingUp size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{activeInvestmentsCount}</span>
                        <span className={styles.statLabel}>Active Investments</span>
                    </div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <div className={styles.statIcon} style={{ background: '#F9F5FF', color: '#6941C6' }}><BarChart3 size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>+18.5%</span>
                        <span className={styles.statLabel}>Avg. ROI</span>
                    </div>
                </motion.div>
            </div>

            {/* Newest Ideas — Upstream Events-inspired cards */}
            <motion.div className={styles.section} initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <div className={styles.sectionHeader}>
                    <h2>Newest Ideas</h2>
                    <Link href="/dashboard/investor/explore" className={styles.viewAll}>View All <ArrowRight size={14} /></Link>
                </div>
                <div className={styles.ideaGrid}>
                    {newestIdeas.length > 0 ? (
                        newestIdeas.map((idea, i) => (
                            <motion.div key={idea.id || idea._id} className={styles.ideaCard} variants={fadeUp} custom={i + 4}>
                                {/* Card Header */}
                                <div className={styles.ideaHeader}>
                                    <div className={styles.ideaAvatar} style={{ background: stageColors[idea.stage]?.bg || '#F1F5F9', color: stageColors[idea.stage]?.color || '#475569' }}>
                                        {idea.title?.charAt(0)?.toUpperCase() || 'I'}
                                    </div>
                                    <div>
                                        <h4>{idea.title}</h4>
                                        <span className={styles.ideaAuthor}>By {idea.author}</span>
                                    </div>
                                </div>

                                <p className={styles.ideaDesc}>{idea.description}</p>

                                {/* Badges */}
                                <div className={styles.ideaBadges}>
                                    <span className={styles.stageBadge} style={{ background: stageColors[idea.stage]?.bg, color: stageColors[idea.stage]?.color }}>{idea.stage}</span>
                                    <span className={styles.categoryBadge}>{idea.category}</span>
                                </div>

                                {/* Footer — Vendors style */}
                                <div className={styles.ideaFooter}>
                                    <div className={styles.ideaStat}>
                                        <strong>{idea.likes?.length || 0}</strong>
                                        <span>Likes</span>
                                    </div>
                                    <div className={styles.ideaStat}>
                                        <strong>{idea.stage}</strong>
                                        <span>Stage</span>
                                    </div>
                                    <Link href="/dashboard/investor/explore" className={styles.viewPitchBtn}>
                                        <Eye size={14} /> View
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p style={{ color: '#667085', fontSize: '0.9rem', textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>No ideas in the pipeline yet.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
