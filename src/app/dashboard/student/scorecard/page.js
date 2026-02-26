'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, TrendingUp, Share2, Download, Star, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import styles from './scorecard.module.css';
import { getAuthHeaders } from '@/context/AuthContext';

const LEVEL_COLORS = { beginner: '#3b82f6', intermediate: '#f59e0b', advanced: '#ef4444' };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07 } }) };

export default function ScorecardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');

    useEffect(() => {
        fetch('/api/student/scorecard', { headers: getAuthHeaders() })
            .then(r => r.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setToast('Link copied!');
        setTimeout(() => setToast(''), 3000);
    };

    if (loading) return (
        <div className={styles.loading}>
            <div className={styles.spinner} /><span>Loading Scorecard...</span>
        </div>
    );

    const { user, overallAverage, totalTests, passedTests, earnedBadges, bySkill, results } = data || {};
    const hasTests = totalTests > 0;

    return (
        <div className={styles.container}>
            {toast && <div className={styles.toast}><CheckCircle size={14} /> {toast}</div>}

            {/* Header */}
            <motion.div className={styles.header} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.headerInfo}>
                    <h1>{user?.name || 'Student'}'s Scorecard <span className={styles.verifiedBadge}><Shield size={14} /> Verified</span></h1>
                    <p>MCQ-based skill assessment report • {user?.email}</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.btnOutline} onClick={handleShare}><Share2 size={15} /> Share</button>
                    <button className={styles.btnPrimary} onClick={() => window.print()}><Download size={15} /> Download PDF</button>
                </div>
            </motion.div>

            {/* Summary strip */}
            <div className={styles.summaryStrip}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{overallAverage || 0}%</span>
                    <span className={styles.summaryLabel}>Overall Average</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{totalTests || 0}</span>
                    <span className={styles.summaryLabel}>Tests Taken</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{passedTests || 0}</span>
                    <span className={styles.summaryLabel}>Tests Passed</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{earnedBadges?.length || 0}</span>
                    <span className={styles.summaryLabel}>Badges Earned</span>
                </div>
            </div>

            {!hasTests ? (
                <div className={styles.emptyState}>
                    <Star size={52} color="#e2e8f0" strokeWidth={1.5} />
                    <h3>No test results yet</h3>
                    <p>Take skill assessments to build your verified scorecard. Companies filter candidates by your scores.</p>
                    <Link href="/dashboard/student/exams" className={styles.examLink}>
                        Browse Exams <ChevronRight size={16} />
                    </Link>
                </div>
            ) : (
                <>
                    {/* Per-Skill Breakdown */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Skill Scores</h2>
                        <div className={styles.skillGrid}>
                            {Object.entries(bySkill || {}).map(([skill, skillResults], i) => {
                                const best = [...skillResults].sort((a, b) => b.score - a.score)[0];
                                return (
                                    <motion.div key={skill} className={styles.skillCard} variants={fadeUp} custom={i} initial="hidden" animate="visible">
                                        <div className={styles.skillHeader}>
                                            <span className={styles.skillName}>{skill}</span>
                                            <span className={styles.skillBestScore}>{best.score}/100</span>
                                        </div>
                                        <div className={styles.skillBar}>
                                            <div className={styles.skillBarFill} style={{ width: `${best.score}%`, background: best.score >= 40 ? '#10b981' : '#f59e0b' }} />
                                        </div>
                                        <div className={styles.levelTags}>
                                            {skillResults.map(r => (
                                                <span key={r.level} className={styles.levelTag} style={{ background: LEVEL_COLORS[r.level] + '20', color: LEVEL_COLORS[r.level] }}>
                                                    {r.level.charAt(0).toUpperCase() + r.level.slice(1)}: {r.score}/100 {r.passed ? '✅' : '❌'}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Earned Badges */}
                    {earnedBadges?.length > 0 && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Earned Badges</h2>
                            <div className={styles.badgesGrid}>
                                {earnedBadges.map((badge, i) => (
                                    <motion.div key={badge.label} className={styles.badgeCard} variants={fadeUp} custom={i} initial="hidden" animate="visible">
                                        <div className={styles.badgeEmoji}>🏅</div>
                                        <div className={styles.badgeLabel}>{badge.label}</div>
                                        <div className={styles.badgeDate}>{new Date(badge.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Test Results */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>All Test Results</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr><th>Skill</th><th>Level</th><th>Score</th><th>Result</th><th>Badge</th><th>Date</th></tr>
                                </thead>
                                <tbody>
                                    {results?.map((r, i) => (
                                        <tr key={i}>
                                            <td><strong>{r.skill}</strong></td>
                                            <td><span className={styles.levelChip} style={{ background: LEVEL_COLORS[r.level] + '20', color: LEVEL_COLORS[r.level] }}>{r.level}</span></td>
                                            <td>
                                                <div className={styles.miniBar}><div style={{ width: `${r.score}%`, height: '100%', background: r.score >= 40 ? '#10b981' : '#f59e0b', borderRadius: 3 }} /></div>
                                                {r.score}/100
                                            </td>
                                            <td>{r.passed ? <span className={styles.passTag}>Passed ✅</span> : <span className={styles.failTag}>Failed ❌</span>}</td>
                                            <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.badgeLabel || '—'}</td>
                                            <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
