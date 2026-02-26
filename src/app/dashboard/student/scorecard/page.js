'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award, CheckCircle, TrendingUp, Share2, Download,
    Star, Shield, ChevronRight, BookOpen, Target, Zap,
    BarChart2, Calendar, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import styles from './scorecard.module.css';
import { getAuthHeaders } from '@/context/AuthContext';

const LEVEL_META = {
    beginner:     { label: 'Beginner',     color: '#10B981', bg: '#D1FAE5' },
    intermediate: { label: 'Intermediate', color: '#F59E0B', bg: '#FEF3C7' },
    advanced:     { label: 'Advanced',     color: '#EF4444', bg: '#FEE2E2' },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.06, ease: 'easeOut' } }),
};

/** SVG circular ring progress */
function ScoreRing({ pct = 0, r = 54, stroke = 8, color = '#4F46E5' }) {
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const size = (r + stroke) * 2;
    return (
        <svg width={size} height={size} className={styles.ring}>
            <circle cx={r + stroke} cy={r + stroke} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
            <circle
                cx={r + stroke} cy={r + stroke} r={r} fill="none"
                stroke={color} strokeWidth={stroke}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${r + stroke} ${r + stroke})`}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
        </svg>
    );
}

export default function ScorecardPage() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast]     = useState('');
    const [activeSkill, setActiveSkill] = useState(null);

    useEffect(() => {
        fetch('/api/student/scorecard', { headers: getAuthHeaders() })
            .then(r => r.json())
            .then(d => { setData(d); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setToast('Link copied to clipboard!');
        setTimeout(() => setToast(''), 3000);
    };

    if (loading) return (
        <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Loading Scorecard...</span>
        </div>
    );

    const { user, overallAverage, totalTests, passedTests, earnedBadges, bySkill, results } = data || {};
    const hasTests     = totalTests > 0;
    const passRate     = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    const ringColor    = overallAverage >= 70 ? '#10B981' : overallAverage >= 40 ? '#F59E0B' : '#EF4444';
    const skillEntries = Object.entries(bySkill || {});

    return (
        <div className={styles.page}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <CheckCircle size={14} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Hero Banner ── */}
            <motion.div className={styles.hero} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                {/* Left: avatar + name */}
                <div className={styles.heroLeft}>
                    <div className={styles.avatar}>
                        {(user?.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.heroInfo}>
                        <div className={styles.heroName}>
                            {user?.name || 'Student'}
                            <span className={styles.verifiedChip}>
                                <Shield size={11} /> Verified
                            </span>
                        </div>
                        <div className={styles.heroEmail}>{user?.email}</div>
                        <div className={styles.heroBadgeCount}>
                            🏅 {earnedBadges?.length || 0} Badge{(earnedBadges?.length || 0) !== 1 ? 's' : ''} Earned
                        </div>
                    </div>
                </div>

                {/* Center: score ring */}
                <div className={styles.heroCenter}>
                    <div className={styles.ringWrap}>
                        <ScoreRing pct={overallAverage || 0} color={ringColor} />
                        <div className={styles.ringInner}>
                            <span className={styles.ringNum} style={{ color: ringColor }}>{overallAverage || 0}%</span>
                            <span className={styles.ringLbl}>Avg Score</span>
                        </div>
                    </div>
                </div>

                {/* Right: summary stats */}
                <div className={styles.heroRight}>
                    <div className={styles.statPill}>
                        <Target size={16} color="#4F46E5" />
                        <div>
                            <span className={styles.statNum}>{totalTests || 0}</span>
                            <span className={styles.statLbl}>Tests Taken</span>
                        </div>
                    </div>
                    <div className={styles.statPill}>
                        <CheckCircle size={16} color="#10B981" />
                        <div>
                            <span className={styles.statNum} style={{ color: '#10B981' }}>{passedTests || 0}</span>
                            <span className={styles.statLbl}>Tests Passed</span>
                        </div>
                    </div>
                    <div className={styles.statPill}>
                        <TrendingUp size={16} color="#F59E0B" />
                        <div>
                            <span className={styles.statNum} style={{ color: '#F59E0B' }}>{passRate}%</span>
                            <span className={styles.statLbl}>Pass Rate</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.heroActions}>
                    <button className={styles.btnOutline} onClick={handleShare}><Share2 size={14} /> Share</button>
                    <button className={styles.btnPrimary} onClick={() => window.print()}><Download size={14} /> PDF</button>
                </div>
            </motion.div>

            {/* ── Empty state ── */}
            {!hasTests ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}><Star size={48} strokeWidth={1.2} /></div>
                    <h3>No test results yet</h3>
                    <p>Take skill assessments to build your verified scorecard. Companies filter candidates by your scores.</p>
                    <Link href="/dashboard/student/exams" className={styles.examLink}>
                        Browse Exams <ChevronRight size={15} />
                    </Link>
                </div>
            ) : (
                <>
                    {/* ── Skill Breakdown ── */}
                    <section className={styles.section}>
                        <div className={styles.sectionHead}>
                            <div>
                                <h2 className={styles.sectionTitle}><BarChart2 size={18} /> Skill Breakdown</h2>
                                <p className={styles.sectionSub}>Your best score per skill across all levels attempted</p>
                            </div>
                        </div>

                        <div className={styles.skillGrid}>
                            {skillEntries.map(([skill, skillResults], i) => {
                                const best = [...skillResults].sort((a, b) => b.score - a.score)[0];
                                const isOpen = activeSkill === skill;
                                const scoreColor = best.score >= 70 ? '#10B981' : best.score >= 40 ? '#F59E0B' : '#EF4444';

                                return (
                                    <motion.div
                                        key={skill}
                                        className={`${styles.skillCard} ${isOpen ? styles.skillCardOpen : ''}`}
                                        variants={fadeUp} custom={i} initial="hidden" animate="visible"
                                        onClick={() => setActiveSkill(isOpen ? null : skill)}
                                    >
                                        <div className={styles.skillTop}>
                                            <div className={styles.skillLeft}>
                                                <div className={styles.skillIcon}>
                                                    <BookOpen size={18} color="#4F46E5" />
                                                </div>
                                                <div>
                                                    <div className={styles.skillName}>{skill}</div>
                                                    <div className={styles.skillAttempts}>{skillResults.length} level{skillResults.length > 1 ? 's' : ''} attempted</div>
                                                </div>
                                            </div>
                                            <div className={styles.skillScore} style={{ color: scoreColor }}>
                                                {best.score}<span className={styles.skillScoreDen}>/100</span>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className={styles.skillBarTrack}>
                                            <motion.div
                                                className={styles.skillBarFill}
                                                style={{ background: scoreColor }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${best.score}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.05 }}
                                            />
                                        </div>

                                        {/* Level chips */}
                                        <div className={styles.levelChips}>
                                            {skillResults.map(r => {
                                                const lm = LEVEL_META[r.level] || LEVEL_META.beginner;
                                                return (
                                                    <span key={r.level} className={styles.levelChip} style={{ background: lm.bg, color: lm.color }}>
                                                        {lm.label}: {r.score}/100 {r.passed ? '✅' : '❌'}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── Earned Badges ── */}
                    {earnedBadges?.length > 0 && (
                        <section className={styles.section}>
                            <div className={styles.sectionHead}>
                                <div>
                                    <h2 className={styles.sectionTitle}><Award size={18} /> Earned Badges</h2>
                                    <p className={styles.sectionSub}>Verified skill badges displayed on your profile</p>
                                </div>
                            </div>

                            <div className={styles.badgesGrid}>
                                {earnedBadges.map((badge, i) => (
                                    <motion.div
                                        key={badge.label}
                                        className={styles.badgeCard}
                                        variants={fadeUp} custom={i} initial="hidden" animate="visible"
                                        whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(79,70,229,0.18)' }}
                                    >
                                        <div className={styles.badgeGlow} />
                                        <div className={styles.badgeEmoji}>🏅</div>
                                        <div className={styles.badgeLabel}>{badge.label}</div>
                                        <div className={styles.badgeDate}>
                                            <Calendar size={11} />
                                            {new Date(badge.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className={styles.badgeVerified}><Shield size={10} /> Verified</div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── All Test Results ── */}
                    <section className={styles.section}>
                        <div className={styles.sectionHead}>
                            <div>
                                <h2 className={styles.sectionTitle}><Zap size={18} /> All Test Results</h2>
                                <p className={styles.sectionSub}>Complete history of all attempted skill assessments</p>
                            </div>
                        </div>

                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Skill</th>
                                        <th>Level</th>
                                        <th>Score</th>
                                        <th>Result</th>
                                        <th>Badge</th>
                                        <th>Date</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results?.map((r, i) => {
                                        const lm = LEVEL_META[r.level] || LEVEL_META.beginner;
                                        const scoreColor = r.score >= 70 ? '#10B981' : r.score >= 40 ? '#F59E0B' : '#EF4444';
                                        return (
                                            <motion.tr
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                            >
                                                <td className={styles.tdNum}>{i + 1}</td>
                                                <td className={styles.tdSkill}>{r.skill}</td>
                                                <td>
                                                    <span className={styles.levelPill} style={{ background: lm.bg, color: lm.color }}>
                                                        {lm.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={styles.scoreCol}>
                                                        <div className={styles.miniBarTrack}>
                                                            <div className={styles.miniBarFill} style={{ width: `${r.score}%`, background: scoreColor }} />
                                                        </div>
                                                        <span className={styles.scoreVal} style={{ color: scoreColor }}>{r.score}<span className={styles.scoreDen}>/100</span></span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`${styles.resultPill} ${r.passed ? styles.pillPass : styles.pillFail}`}>
                                                        {r.passed ? '✅ Passed' : '❌ Failed'}
                                                    </span>
                                                </td>
                                                <td className={styles.tdBadge}>{r.badgeLabel || <span className={styles.naBadge}>—</span>}</td>
                                                <td className={styles.tdDate}>
                                                    {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                                                </td>
                                                <td>
                                                    {r.sessionId && (
                                                        <Link href={`/dashboard/student/exams/${r.sessionId}/report`} className={styles.viewBtn}>
                                                            <ExternalLink size={13} /> Report
                                                        </Link>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
