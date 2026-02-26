'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Bookmark, BookMarked, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './exam.module.css';

export default function ActiveExamPage() {
    const { sessionId } = useParams();
    const router = useRouter();

    const [session, setSession]           = useState(null);
    const [answers, setAnswers]           = useState({});
    const [bookmarked, setBookmarked]     = useState({});
    const [currentQ, setCurrentQ]         = useState(0);
    const [timeLeft, setTimeLeft]         = useState(null);
    const [loading, setLoading]           = useState(true);
    const [submitting, setSubmitting]     = useState(false);
    const [result, setResult]             = useState(null);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const submitted = useRef(false);

    // Track visited questions
    const [visited, setVisited] = useState({});

    useEffect(() => {
        async function loadSession() {
            const res = await fetch(`/api/student/exams/session/${sessionId}`);
            if (!res.ok) { router.push('/dashboard/student/exams'); return; }
            const data = await res.json();
            if (data.session.status !== 'in-progress') {
                setResult({ score: data.session.score, passed: data.session.passed, alreadyDone: true });
                setLoading(false);
                return;
            }
            setSession(data.session);
            const durationMs = (data.session.testPaper?.config?.duration || 120) * 60 * 1000;
            const elapsed = Date.now() - new Date(data.session.startTime).getTime();
            const remaining = Math.max(0, Math.floor((durationMs - elapsed) / 1000));
            setTimeLeft(remaining);
            setVisited({ 0: true });
            setLoading(false);
        }
        loadSession();
    }, [sessionId]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    if (!submitted.current) handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleSubmit = useCallback(async (isAuto = false) => {
        if (submitted.current) return;
        submitted.current = true;
        setSubmitting(true);
        const answersArray = Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({ questionId, selectedOptionIndex }));
        try {
            const res = await fetch(`/api/student/exams/${sessionId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: answersArray }),
            });
            const data = await res.json();
            if (res.ok) {
                setResult({ ...data, isAuto });
            } else if (res.status === 409) {
                setResult({ alreadyDone: true, score: data.score, passed: data.passed });
            } else {
                setResult({ error: data.error });
            }
        } catch {
            setResult({ error: 'Network error during submission. Please contact support.' });
        } finally {
            setSubmitting(false);
            setConfirmSubmit(false);
        }
    }, [answers, sessionId]);

    function formatTimePart(secs) {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return { h: h.toString().padStart(2,'0'), m: m.toString().padStart(2,'0'), s: s.toString().padStart(2,'0') };
    }

    function goTo(i) {
        setCurrentQ(i);
        setVisited(prev => ({ ...prev, [i]: true }));
    }

    const questions = session?.questions || [];
    const q = questions[currentQ];
    const answeredCount = Object.keys(answers).length;
    const visitedCount  = Object.keys(visited).length;
    const notVisited    = questions.length - visitedCount;
    const notAnswered   = questions.length - answeredCount;
    const bookmarkCount = Object.values(bookmarked).filter(Boolean).length;
    const isLastQ = currentQ === questions.length - 1;
    const isTimeLow = timeLeft !== null && timeLeft < 300;
    const timeParts = timeLeft !== null ? formatTimePart(timeLeft) : { h: '--', m: '--', s: '--' };

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} />
            <p>Loading exam...</p>
        </div>
    );

    if (result) {
        return (
            <div className={styles.resultPage}>
                <div className={styles.resultCard}>
                    {result.error ? (
                        <>
                            <div className={styles.resultEmoji}>⚠️</div>
                            <h2 className={styles.resultTitle}>Submission Error</h2>
                            <p className={styles.resultMsg}>{result.error}</p>
                        </>
                    ) : result.alreadyDone ? (
                        <>
                            <div className={styles.resultEmoji}>{result.passed ? '🏅' : '📝'}</div>
                            <h2 className={styles.resultTitle}>Exam Already Submitted</h2>
                            <p className={styles.resultMsg}>Your score was <strong>{result.score}/100</strong>. {result.passed ? 'You passed!' : 'You did not reach the passing score.'}</p>
                        </>
                    ) : (
                        <>
                            <div className={styles.resultEmoji}>{result.passed ? '🎉' : '📝'}</div>
                            <h2 className={styles.resultTitle}>{result.passed ? 'Congratulations!' : 'Exam Submitted'}</h2>
                            {result.isAuto && <p className={styles.autoNote}>⏱ Time expired — exam was auto-submitted.</p>}
                            <div className={styles.scoreCircle} style={{ borderColor: result.passed ? '#10b981' : '#f59e0b' }}>
                                <span className={styles.scoreNum}>{result.score}</span>
                                <span className={styles.scoreDen}>/100</span>
                            </div>
                            <p className={styles.resultMsg}>
                                Correct: {result.correctCount}/{result.totalQuestions} · Overall avg: {result.overallAverage}%
                            </p>
                            {result.passed && result.badgeEarned && (
                                <div className={styles.badgeEarned}>🏅 Badge Earned: <strong>{result.badgeEarned}</strong></div>
                            )}
                            {!result.passed && <p className={styles.failNote}>You did not reach the passing score (40/100). Check your scorecard for details.</p>}
                        </>
                    )}
                    <button className={styles.doneBtn} onClick={() => router.push('/dashboard/student/scorecard')}>View My Scorecard →</button>
                    <button className={styles.backBtn} onClick={() => router.push('/dashboard/student/exams')}>← Back to Exams</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.examRoot}>
            {/* ── TOP BAR ── */}
            <header className={styles.topBar}>
                <div className={styles.topLeft}>
                    <span className={styles.topBreadcrumb}>
                        Skill Exam &rsaquo; <strong>{session?.testPaper?.badgeLabel || 'Exam'}</strong>
                    </span>
                </div>
                <div className={styles.topRight}>
                    <button className={styles.exitBtn} onClick={() => router.push('/dashboard/student/exams')}>Exit</button>
                    <button
                        className={styles.reviewBtn}
                        onClick={() => setConfirmSubmit(true)}
                        disabled={submitting}
                    >
                        Review and Submit ›
                    </button>
                </div>
            </header>

            <div className={styles.examBody}>
                {/* ── LEFT PANEL: Question Navigator ── */}
                <aside className={styles.leftPanel}>
                    <div className={styles.navTitle}>Questions</div>
                    <div className={styles.qGrid}>
                        {questions.map((qItem, i) => {
                            const isAnswered = answers[qItem.questionId] !== undefined;
                            const isCurrentQ = i === currentQ;
                            const isMarked   = bookmarked[i];
                            const isVisitedQ = visited[i];
                            return (
                                <button
                                    key={i}
                                    className={`${styles.qBtn}
                                        ${isCurrentQ  ? styles.qCurrent  : ''}
                                        ${isAnswered  ? styles.qAnswered  : ''}
                                        ${isMarked    ? styles.qMarked    : ''}
                                        ${!isVisitedQ && !isAnswered ? styles.qNotVisited : ''}`}
                                    onClick={() => goTo(i)}
                                    title={`Q${i + 1}${isAnswered ? ' ✓' : ''}${isMarked ? ' 🔖' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className={styles.legend}>
                        <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotAnswered}`} /> Answered</div>
                        <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotCurrent}`} /> Current</div>
                        <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotMarked}`} /> Bookmarked</div>
                        <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotNot}`} /> Not Visited</div>
                    </div>
                </aside>

                {/* ── CENTER PANEL: Question ── */}
                <main className={styles.centerPanel}>
                    {q && (
                        <>
                            <div className={styles.qHeader}>
                                <span className={styles.qLabel}>Q: {currentQ + 1}</span>
                                <button
                                    className={`${styles.bookmarkBtn} ${bookmarked[currentQ] ? styles.bookmarkBtnOn : ''}`}
                                    onClick={() => setBookmarked(prev => ({ ...prev, [currentQ]: !prev[currentQ] }))}
                                >
                                    {bookmarked[currentQ] ? <BookMarked size={16} /> : <Bookmark size={16} />}
                                    <span>{bookmarked[currentQ] ? 'Bookmarked' : 'Bookmark'}</span>
                                </button>
                            </div>

                            <div className={styles.questionBox}>
                                <p className={styles.questionText}>{q.text}</p>
                            </div>

                            <div className={styles.optionsList}>
                                {q.options.map((opt, i) => {
                                    const letter = ['a', 'b', 'c', 'd'][i];
                                    const isSelected = answers[q.questionId] === i;
                                    return (
                                        <button
                                            key={i}
                                            className={`${styles.optionRow} ${isSelected ? styles.optionSelected : ''}`}
                                            onClick={() => setAnswers(prev => ({ ...prev, [q.questionId]: i }))}
                                        >
                                            <span className={styles.optionLetterBadge}>{letter})</span>
                                            <span className={styles.optionText}>{opt.text}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Bottom nav */}
                            <div className={styles.bottomNav}>
                                <button
                                    className={styles.clearBtn}
                                    onClick={() => {
                                        setAnswers(prev => {
                                            const next = { ...prev };
                                            delete next[q.questionId];
                                            return next;
                                        });
                                    }}
                                >
                                    ✕ Clear Response
                                </button>
                                <div className={styles.navBtns}>
                                    <button
                                        className={styles.prevBtn}
                                        disabled={currentQ === 0}
                                        onClick={() => goTo(currentQ - 1)}
                                    >
                                        ‹ Prev
                                    </button>
                                    {!isLastQ ? (
                                        <button
                                            className={styles.nextBtn}
                                            onClick={() => goTo(currentQ + 1)}
                                        >
                                            Save and Next ›
                                        </button>
                                    ) : (
                                        <button
                                            className={styles.submitNavBtn}
                                            onClick={() => setConfirmSubmit(true)}
                                        >
                                            Review and Submit ›
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </main>

                {/* ── RIGHT PANEL: Timer + Overview ── */}
                <aside className={styles.rightPanel}>
                    {/* Timer */}
                    <div className={`${styles.timerCard} ${isTimeLow ? styles.timerLow : ''}`}>
                        <div className={styles.timerDisplay}>
                            <span className={styles.timePart}>{timeParts.h}</span>
                            <span className={styles.timeColon}>:</span>
                            <span className={styles.timePart}>{timeParts.m}</span>
                            <span className={styles.timeColon}>:</span>
                            <span className={styles.timePart}>{timeParts.s}</span>
                        </div>
                        <div className={styles.timerLabels}>
                            <span>Hrs</span><span></span><span>Min</span><span></span><span>Sec</span>
                        </div>
                        {isTimeLow && <div className={styles.timerWarning}>⚠️ Time running low!</div>}
                    </div>

                    <button className={styles.aboutTestBtn} onClick={() => setConfirmSubmit(true)}>
                        About Test
                    </button>

                    {/* Overview */}
                    <div className={styles.overviewCard}>
                        <h4 className={styles.overviewTitle}>Overview</h4>
                        <div className={styles.overviewRows}>
                            <div className={styles.overviewRow}>
                                <span>Total Questions</span><span className={styles.ovNum}>{questions.length}</span>
                            </div>
                            <div className={styles.overviewRow}>
                                <span>Visited</span><span className={styles.ovNum} style={{ color: '#4F46E5' }}>{visitedCount}</span>
                            </div>
                            <div className={styles.overviewRow}>
                                <span>Not Visited</span><span className={styles.ovNum} style={{ color: '#6B7280' }}>{notVisited}</span>
                            </div>
                            <div className={styles.overviewRow}>
                                <span>Answered</span><span className={styles.ovNum} style={{ color: '#10B981' }}>{answeredCount}</span>
                            </div>
                            <div className={styles.overviewRow}>
                                <span>Not Answered</span><span className={styles.ovNum} style={{ color: '#EF4444' }}>{notAnswered}</span>
                            </div>
                            <div className={styles.overviewRow}>
                                <span>Bookmarked</span><span className={styles.ovNum} style={{ color: '#F59E0B' }}>{bookmarkCount}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* ── Confirm Submit Modal ── */}
            {confirmSubmit && !submitting && (
                <div className={styles.modalOverlay} onClick={() => setConfirmSubmit(false)}>
                    <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.confirmIcon}><AlertCircle size={28} color="#F59E0B" /></div>
                        <h3 className={styles.confirmTitle}>Submit Exam?</h3>
                        <p className={styles.confirmMsg}>
                            You have answered <strong>{answeredCount}/{questions.length}</strong> questions.
                            Unanswered questions will be marked as incorrect.
                        </p>
                        <p className={styles.confirmWarning}>⚠️ This action cannot be undone.</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.cancelBtn} onClick={() => setConfirmSubmit(false)}>Continue Exam</button>
                            <button className={styles.submitFinalBtn} onClick={() => handleSubmit(false)}>
                                Yes, Submit Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {submitting && (
                <div className={styles.modalOverlay}>
                    <div className={styles.confirmBox} style={{ textAlign: 'center' }}>
                        <div className={styles.spinner} style={{ margin: '0 auto 16px' }} />
                        <p>Submitting and grading your exam...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
