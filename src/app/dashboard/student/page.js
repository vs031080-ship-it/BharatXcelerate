'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight, ChevronLeft, ChevronRight, Sparkles,
    Clock, Zap, CheckCircle2, FolderKanban, Bell,
    Play, BookOpen, Star, TrendingUp, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';
import OnboardingWalkthrough from '@/components/OnboardingWalkthrough/OnboardingWalkthrough';
import styles from './student.module.css';

const DOMAIN_COLORS = {
    'AI/ML': { bg: '#FFF7ED', txt: '#EA580C', border: '#FED7AA' },
    'Blockchain': { bg: '#FEF3C7', txt: '#D97706', border: '#FDE68A' },
    'Full Stack': { bg: '#EFF6FF', txt: '#2563EB', border: '#BFDBFE' },
    'Backend': { bg: '#F0FDF4', txt: '#16A34A', border: '#BBF7D0' },
    'Frontend': { bg: '#FDF2F8', txt: '#BE185D', border: '#F9A8D4' },
    'Mobile': { bg: '#FFF7ED', txt: '#EA580C', border: '#FED7AA' },
    'DevOps': { bg: '#F0F9FF', txt: '#0369A1', border: '#BAE6FD' },
    'Data Science': { bg: '#F0FDF4', txt: '#15803D', border: '#86EFAC' },
    'Cybersecurity': { bg: '#FEF2F2', txt: '#DC2626', border: '#FCA5A5' },
};

const DIFF_BADGE = {
    Beginner: { bg: '#DCFCE7', txt: '#15803D' },
    Intermediate: { bg: '#FEF3C7', txt: '#D97706' },
    Advanced: { bg: '#FEE2E2', txt: '#DC2626' },
};

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const firstName = user?.name?.split(' ')[0] || 'Student';

    const [activeProjects, setActiveProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showWalkthrough, setShowWalkthrough] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined' && localStorage.getItem('showWalkthroughAfterProfile') === 'true') {
            setShowWalkthrough(true);
            localStorage.removeItem('showWalkthroughAfterProfile');
        }
        fetch('/api/student/projects/active', { headers: getAuthHeaders() })
            .then(r => r.ok ? r.json() : { projects: [] })
            .then(d => setActiveProjects(d.projects || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user?._id]);

    function dismissWalkthrough() {
        if (typeof window !== 'undefined') localStorage.setItem(`onboarding_done_${user?._id || 'guest'}`, '1');
        setShowWalkthrough(false);
    }

    const today = mounted ? new Date() : new Date('2026-02-25');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const inProgress = activeProjects.filter(p => p.status !== 'completed' && p.status !== 'archived');
    const completed = activeProjects.filter(p => p.status === 'completed');
    const ongoing = inProgress[0] || null;
    const upNext = inProgress[1] || null;
    const happeningLater = inProgress.slice(2, 4);

    const totalXP = user?.xp || 0;
    const completedCount = completed.length;
    const notifications = [
        { id: 1, color: '#FEF3C7', txt: '#D97706', initial: '!', title: 'Profile Incomplete', body: 'Complete your profile to unlock all features.' },
        { id: 2, color: '#DBEAFE', txt: '#2563EB', initial: 'P', title: 'New Projects Available', body: 'Check out the latest AI/ML and Full Stack projects.' },
    ];

    return (
        <div className={styles.wrap}>
            {showWalkthrough && <OnboardingWalkthrough onDismiss={dismissWalkthrough} />}

            {/* ── TWO COLUMN LAYOUT ── */}
            <div className={styles.layout}>

                {/* ── LEFT/MAIN COLUMN ── */}
                <div className={styles.main}>

                    {/* Header Row */}
                    <div className={styles.dashHeader}>
                        <div>
                            <h1 className={styles.dashTitle}>Dashboard</h1>
                        </div>
                        <div className={styles.dashHeaderRight}>
                            <span className={styles.greetChip}>
                                👋 Welcome, {firstName}!
                            </span>
                        </div>
                    </div>

                    {/* ── SECTION: Active Projects ── */}
                    <div className={styles.sectionLabel}>
                        <span className={styles.sectionLabelDot} />
                        Active Projects
                    </div>

                    <div className={styles.bigCards}>
                        {/* ONGOING CARD */}
                        <div className={styles.ongoingCard}>
                            <div className={styles.bigCardTag}>
                                <span className={styles.liveTag}><span className={styles.liveDot} />ONGOING</span>
                            </div>
                            {loading ? (
                                <div className={styles.shimmer}><div /><div /><div /></div>
                            ) : ongoing ? (
                                <>
                                    <div className={styles.bigCardDomain} style={{ color: (DOMAIN_COLORS[ongoing.domain] || {}).txt || '#16A34A' }}>
                                        {ongoing.title}
                                    </div>
                                    <div className={styles.bigCardCode}>{ongoing.domain}</div>
                                    <div className={styles.bigCardMeta}>
                                        <Clock size={13} />
                                        Step {(ongoing.currentStep || 0) + 1} of {ongoing.totalSteps || '?'}
                                    </div>
                                    <div className={styles.bigCardMeta}>
                                        <Zap size={13} />
                                        {ongoing.difficulty} · +{ongoing.points} XP
                                    </div>
                                    <div className={styles.bigCardProgress}>
                                        <div className={styles.progressBg}>
                                            <div className={styles.progressFill} style={{ width: `${ongoing.progress || 0}%` }} />
                                        </div>
                                        <span>{ongoing.progress || 0}%</span>
                                    </div>
                                    <div className={styles.bigCardActions}>
                                        <Link href={`/dashboard/student/projects/${ongoing.id}`} className={styles.btnContinue}>
                                            <Play size={13} fill="white" /> Continue
                                        </Link>
                                        <Link href="/dashboard/student/projects" className={styles.btnOutline}>
                                            View All
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.noProject}>
                                    <BookOpen size={28} strokeWidth={1.3} color="#9CA3AF" />
                                    <p>No active project</p>
                                    <Link href="/dashboard/student/explore" className={styles.btnContinue}>
                                        <Sparkles size={13} /> Explore Projects
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* UP NEXT CARD */}
                        <div className={styles.upNextCard}>
                            <div className={styles.bigCardTag}>
                                <span className={styles.upNextTag}>UP NEXT</span>
                            </div>
                            {loading ? (
                                <div className={styles.shimmer}><div /><div /><div /></div>
                            ) : upNext ? (
                                <>
                                    <div className={styles.bigCardDomainBlue}>{upNext.title}</div>
                                    <div className={styles.bigCardCode}>{upNext.domain}</div>
                                    <div className={styles.bigCardMeta}><Clock size={13} /> Step {(upNext.currentStep || 0) + 1}</div>
                                    <div className={styles.bigCardMeta}><Zap size={13} /> {upNext.difficulty} · +{upNext.points} XP</div>
                                    <div className={styles.bigCardProgress}>
                                        <div className={styles.progressBg}>
                                            <div className={styles.progressFillBlue} style={{ width: `${upNext.progress || 0}%` }} />
                                        </div>
                                        <span>{upNext.progress || 0}%</span>
                                    </div>
                                    <Link href={`/dashboard/student/projects/${upNext.id}`} className={styles.btnAddReminder}>
                                        Start Now <ArrowRight size={13} />
                                    </Link>
                                </>
                            ) : (
                                <div className={styles.noProject}>
                                    <BookOpen size={28} strokeWidth={1.3} color="#9CA3AF" />
                                    <p>All caught up!</p>
                                    <Link href="/dashboard/student/explore" className={styles.btnAddReminder}>
                                        Browse More <ArrowRight size={13} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── SECTION: More Projects ── */}
                    {(happeningLater.length > 0) && (
                        <>
                            <div className={styles.sectionLabel} style={{ marginTop: 20 }}>
                                <span className={styles.sectionLabelDot} style={{ background: '#6366F1' }} />
                                More In Progress
                            </div>
                            <div className={styles.laterGrid}>
                                {happeningLater.map(proj => {
                                    const dc = DOMAIN_COLORS[proj.domain] || { bg: '#F5F7FA', txt: '#6B7280', border: '#E8EAED' };
                                    return (
                                        <Link key={proj.id} href={`/dashboard/student/projects/${proj.id}`} className={styles.laterCard} style={{ borderColor: dc.border }}>
                                            <div className={styles.laterDomain} style={{ color: dc.txt }}>{proj.title}</div>
                                            <div className={styles.laterCode}>{proj.domain}</div>
                                            <div className={styles.laterMeta}><Clock size={11} /> Step {(proj.currentStep || 0) + 1}</div>
                                            <div className={styles.laterMeta}><Zap size={11} /> {proj.difficulty}</div>
                                        </Link>
                                    );
                                })}
                                <Link href="/dashboard/student/explore" className={styles.addEventCard}>
                                    <span className={styles.addEventPlus}>+</span>
                                    <span>Explore More</span>
                                </Link>
                            </div>
                        </>
                    )}

                    {/* ── BOTTOM ROW: Notifications + Progress ── */}
                    <div className={styles.bottomRow}>
                        {/* Notifications */}
                        <div className={styles.bottomCard}>
                            <div className={styles.bottomCardHead}>
                                <span className={styles.bottomCardTitle}>Notifications</span>
                                <Link href="/dashboard/student/scorecard" className={styles.viewLink}>View scorecard →</Link>
                            </div>
                            <div className={styles.notifList}>
                                {notifications.map(n => (
                                    <div key={n.id} className={styles.notifItem}>
                                        <div className={styles.notifAvatar} style={{ background: n.color, color: n.txt }}>
                                            {n.initial}
                                        </div>
                                        <div className={styles.notifBody}>
                                            <div className={styles.notifTitle}>{n.title}</div>
                                            <div className={styles.notifText}>{n.body}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Progress Overview */}
                        <div className={styles.bottomCard}>
                            <div className={styles.bottomCardHead}>
                                <span className={styles.bottomCardTitle}>My Progress</span>
                                <Link href="/dashboard/student/scorecard" className={styles.viewLink}>View history →</Link>
                            </div>
                            {/* Overall bar */}
                            <div className={styles.attendancePct}>
                                <div className={styles.attendanceBar}>
                                    <div
                                        className={styles.attendanceFill}
                                        style={{ width: `${activeProjects.length > 0 ? Math.round(activeProjects.reduce((a, p) => a + (p.progress || 0), 0) / activeProjects.length) : 0}%` }}
                                    />
                                </div>
                                <span className={styles.attendanceNum}>
                                    {activeProjects.length > 0 ? Math.round(activeProjects.reduce((a, p) => a + (p.progress || 0), 0) / activeProjects.length) : 0}%
                                </span>
                            </div>
                            <div className={styles.attendanceRows}>
                                <div className={styles.attendanceRow}>
                                    <span className={styles.aRowLabel}>In Progress</span>
                                    <CheckCircle2 size={14} color={inProgress.length > 0 ? '#16A34A' : '#D1D5DB'} />
                                    <span className={styles.aRowStatus} style={{ color: inProgress.length > 0 ? '#16A34A' : '#9CA3AF' }}>
                                        {inProgress.length} projects
                                    </span>
                                </div>
                                <div className={styles.attendanceRow}>
                                    <span className={styles.aRowLabel}>Completed</span>
                                    <CheckCircle2 size={14} color={completedCount > 0 ? '#6366F1' : '#D1D5DB'} />
                                    <span className={styles.aRowStatus} style={{ color: completedCount > 0 ? '#6366F1' : '#9CA3AF' }}>
                                        {completedCount} {completedCount === 1 ? 'project' : 'projects'}
                                    </span>
                                </div>
                                <div className={styles.attendanceRow}>
                                    <span className={styles.aRowLabel}>Total XP</span>
                                    <Star size={14} color="#F59E0B" />
                                    <span className={styles.aRowStatus} style={{ color: '#F59E0B' }}>
                                        {totalXP} XP
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className={styles.right}>
                    {/* Calendar */}
                    <div className={styles.rightCard}>
                        <div className={styles.rightCardHead}>
                            <span className={styles.rightCardTitle}>Calendar</span>
                            <Link href="/dashboard/student/projects" className={styles.viewLink}>View schedule →</Link>
                        </div>
                        <div className={styles.calNav}>
                            <button className={styles.calNavBtn} onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
                                <ChevronLeft size={14} />
                            </button>
                            <span className={styles.calMonthName}>
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <button className={styles.calNavBtn} onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className={styles.calGrid}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className={styles.calDow}>{d}</div>
                            ))}
                            {Array.from({ length: startOffset }).map((_, i) => <div key={`x${i}`} className={styles.calEmpty} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const d = i + 1;
                                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                const hasDeadline = activeProjects.some(p => {
                                    if (!p.deadline) return false;
                                    const dd = new Date(p.deadline);
                                    return dd.getDate() === d && dd.getMonth() === month && dd.getFullYear() === year;
                                });
                                return (
                                    <div
                                        key={d}
                                        className={`${styles.calDay} ${isToday ? styles.calDayToday : ''} ${hasDeadline && !isToday ? styles.calDayDeadline : ''}`}
                                    >
                                        {d}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links — Explore */}
                    <div className={styles.rightCard}>
                        <div className={styles.rightCardHead}>
                            <span className={styles.rightCardTitle}>Quick Links</span>
                            <Link href="/dashboard/student/explore" className={styles.viewLink}>View projects →</Link>
                        </div>
                        <div className={styles.quickLinks}>
                            {[
                                { label: 'Explore Projects', href: '/dashboard/student/explore', color: '#FFF7ED', txt: '#EA580C', desc: 'Browse all available projects' },
                                { label: 'My Scorecard', href: '/dashboard/student/scorecard', color: '#EFF6FF', txt: '#2563EB', desc: 'View your exam results' },
                                { label: 'Take an Exam', href: '/dashboard/student/exams', color: '#F5F3FF', txt: '#7C3AED', desc: 'MCQ skill assessments' },
                            ].map(q => (
                                <Link key={q.href} href={q.href} className={styles.quickLink}>
                                    <div className={styles.quickLinkLeft}>
                                        <div className={styles.quickLinkName} style={{ color: q.txt }}>{q.label}</div>
                                        <div className={styles.quickLinkDesc}>{q.desc}</div>
                                    </div>
                                    <div className={styles.quickLinkBtn} style={{ background: q.color, color: q.txt }}>
                                        GO <ExternalLink size={11} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
