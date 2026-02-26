'use client';
import { useState, useEffect } from 'react';
import { Clock, Star, AlertCircle, CheckCircle, Lock, ChevronRight, Filter } from 'lucide-react';
import styles from './exams.module.css';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const LEVEL_COLORS = { beginner: '#3b82f6', intermediate: '#f59e0b', advanced: '#ef4444' };

export default function ExamsPage() {
    const [tests, setTests] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ skill: '', level: '', status: '' });
    const [enrollModal, setEnrollModal] = useState(null); // the test paper to enroll in
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { fetchData(); }, [filter]);

    async function fetchData() {
        setLoading(true);
        const params = new URLSearchParams();
        if (filter.skill) params.set('skill', filter.skill);
        if (filter.level) params.set('level', filter.level);
        const [testsRes, skillsRes] = await Promise.all([
            fetch('/api/student/exams?' + params),
            fetch('/api/admin/skills'),
        ]);
        const [testsData, skillsData] = await Promise.all([testsRes.json(), skillsRes.json()]);
        setTests(testsData.tests || []);
        setSkills(skillsData.categories || []);
        setLoading(false);
    }

    async function handleEnroll() {
        if (!enrollModal) return;
        setEnrolling(true); setError('');
        try {
            const res = await fetch(`/api/student/exams/${enrollModal._id}/enroll`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Error enrolling'); return; }
            // Redirect to exam
            window.location.href = `/dashboard/student/exams/${data.sessionId}`;
        } finally { setEnrolling(false); }
    }

    const filtered = tests.filter(test => {
        if (filter.status === 'attempted') {
            return test.status === 'completed' || test.status === 'in-progress';
        }
        return true;
    });

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Skill Exams</h1>
                    <p className={styles.subtitle}>Appear in tests to earn badges and build your verified scorecard</p>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <Filter size={16} color="#64748b" />
                <select className={styles.filterSelect} value={filter.skill} onChange={e => setFilter(f => ({ ...f, skill: e.target.value }))}>
                    <option value="">All Skills</option>
                    {skills.map(s => <option key={s.slug} value={s.slug}>{s.icon} {s.name}</option>)}
                </select>
                <select className={styles.filterSelect} value={filter.level} onChange={e => setFilter(f => ({ ...f, level: e.target.value }))}>
                    <option value="">All Levels</option>
                    {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
                <select className={styles.filterSelect} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
                    <option value="">All Exams</option>
                    <option value="attempted">Attempted Only</option>
                </select>
                {(filter.skill || filter.level || filter.status) && (
                    <button className={styles.clearBtn} onClick={() => setFilter({ skill: '', level: '', status: '' })}>Clear</button>
                )}
            </div>

            {loading ? (
                <div className={styles.loading}><div className={styles.spinner} />Loading exams...</div>
            ) : filtered.length === 0 ? (
                <div className={styles.empty}>
                    <Star size={48} color="#e2e8f0" />
                    <p>No active exams available right now.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filtered.map(test => {
                        const isCompleted = test.status === 'completed';
                        const isInProgress = test.status === 'in-progress';
                        const levelColor = LEVEL_COLORS[test.level] || '#6366f1';
                        return (
                            <div key={test._id} className={`${styles.card} ${isCompleted ? styles.cardCompleted : ''}`}>
                                <div className={styles.cardHead}>
                                    <span className={styles.skillIcon}>{test.category?.icon || '📚'}</span>
                                    <div>
                                        <div className={styles.skillName}>{test.category?.name}</div>
                                        <span className={styles.levelBadge} style={{ background: levelColor + '20', color: levelColor }}>
                                            {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
                                        </span>
                                    </div>
                                    <div className={styles.statusBadge}>
                                        {isCompleted ? (
                                            test.passed
                                                ? <CheckCircle size={20} color="#10b981" />
                                                : <AlertCircle size={20} color="#f59e0b" />
                                        ) : isInProgress ? (
                                            <Clock size={20} color="#3b82f6" />
                                        ) : null}
                                    </div>
                                </div>

                                <div className={styles.badgeLabel}>{test.badgeLabel}</div>

                                <div className={styles.meta}>
                                    <span><Clock size={13} /> {test.config?.duration} min</span>
                                    <span><Star size={13} /> {test.config?.totalMarks} marks</span>
                                    <span>Pass: {test.config?.passingScore}+</span>
                                </div>

                                {isCompleted && (
                                    <div className={`${styles.resultBar} ${test.passed ? styles.resultPass : styles.resultFail}`}>
                                        {test.passed ? '🏅 Passed' : '❌ Did not pass'} — Score: {test.score}/100
                                    </div>
                                )}

                                <button
                                    className={`${styles.enrollBtn} ${isCompleted ? styles.btnOutline : isInProgress ? styles.enrollBtnResume : ''}`}
                                    onClick={() => {
                                        if (isCompleted) {
                                            window.location.href = `/dashboard/student/exams/${test.sessionId}/report`;
                                        } else if (isInProgress) {
                                            window.location.href = `/dashboard/student/exams/${test.sessionId}`;
                                        } else {
                                            setEnrollModal(test); setError('');
                                        }
                                    }}
                                >
                                    {isCompleted ? <>View Detailed Report <ChevronRight size={14} /></> :
                                        isInProgress ? <><Clock size={14} /> Resume Exam</> :
                                            <>Enroll <ChevronRight size={14} /></>}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Rules Modal */}
            {enrollModal && (
                <div className={styles.modal} onClick={() => { setEnrollModal(null); setError(''); }}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalIcon}>📋</div>
                        <h2 className={styles.modalTitle}>Exam Rules</h2>
                        <p className={styles.modalSkill}>{enrollModal.badgeLabel}</p>
                        <ul className={styles.rulesList}>
                            <li>⏱ You have <strong>{enrollModal.config?.duration} minutes</strong> to complete {enrollModal.config?.questionsCount} questions.</li>
                            <li>🔒 <strong>One attempt only</strong> — you cannot retake this test once started.</li>
                            <li>⚡ The exam <strong>auto-submits</strong> when the timer runs out.</li>
                            <li>✅ Passing score: <strong>{enrollModal.config?.passingScore}/100</strong> to earn the badge.</li>
                            <li>📵 Do not refresh or close the tab during the exam.</li>
                            <li>🔐 All answers are graded on the server. Results are instant.</li>
                        </ul>
                        {error && <p className={styles.ruleError}>{error}</p>}
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setEnrollModal(null)}>Cancel</button>
                            <button className={styles.startBtn} onClick={handleEnroll} disabled={enrolling}>
                                {enrolling ? 'Starting...' : '🚀 Start Exam'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
