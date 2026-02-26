'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import styles from './exam.module.css';

export default function ActiveExamPage() {
    const { sessionId } = useParams();
    const router = useRouter();

    const [session, setSession] = useState(null);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
    const [currentQ, setCurrentQ] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null); // seconds
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const submitted = useRef(false);

    // Load session on mount
    useEffect(() => {
        async function loadSession() {
            const res = await fetch(`/api/student/exams/session/${sessionId}`);
            if (!res.ok) { router.push('/dashboard/student/exams'); return; }
            const data = await res.json();
            if (data.session.status !== 'in-progress') {
                // Already submitted — show result
                setResult({ score: data.session.score, passed: data.session.passed, alreadyDone: true });
                setLoading(false);
                return;
            }
            setSession(data.session);
            // Calculate remaining time
            const durationMs = (data.session.testPaper?.config?.duration || 120) * 60 * 1000;
            const elapsed = Date.now() - new Date(data.session.startTime).getTime();
            const remaining = Math.max(0, Math.floor((durationMs - elapsed) / 1000));
            setTimeLeft(remaining);
            setLoading(false);
        }
        loadSession();
    }, [sessionId]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    if (!submitted.current) handleSubmit(true); // auto-submit
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
                // Test was already locked in as submitted
                setResult({ alreadyDone: true, score: data.score, passed: data.passed });
            } else {
                setResult({ error: data.error });
            }
        } catch (e) {
            setResult({ error: 'Network error during submission. Please contact support.' });
        } finally {
            setSubmitting(false);
            setConfirmSubmit(false);
        }
    }, [answers, sessionId]);

    function formatTime(secs) {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    const questions = session?.questions || [];
    const q = questions[currentQ];
    const answeredCount = Object.keys(answers).length;
    const isLastQ = currentQ === questions.length - 1;
    const isTimeLow = timeLeft !== null && timeLeft < 300; // < 5 min

    if (loading) return <div className={styles.center}><div className={styles.spinner} /><p>Loading exam...</p></div>;

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
        <div className={styles.examPage}>
            {/* Header */}
            <div className={styles.examHeader}>
                <div className={styles.examTitle}>{session?.testPaper?.badgeLabel || 'Exam'}</div>
                <div className={`${styles.timer} ${isTimeLow ? styles.timerLow : ''}`}>
                    <Clock size={16} />
                    {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                </div>
                <button className={styles.submitHeaderBtn} onClick={() => setConfirmSubmit(true)} disabled={submitting}>
                    <Send size={15} /> Submit
                </button>
            </div>

            {/* Progress */}
            <div className={styles.progress}>
                <div className={styles.progressBar} style={{ width: `${((answeredCount) / questions.length) * 100}%` }} />
            </div>
            <div className={styles.progressText}>{answeredCount}/{questions.length} answered</div>

            {/* Question Navigator */}
            <div className={styles.qNav}>
                {questions.map((_, i) => (
                    <button
                        key={i}
                        className={`${styles.qNavBtn} ${i === currentQ ? styles.qNavActive : ''} ${answers[questions[i]?.questionId] !== undefined ? styles.qNavAnswered : ''}`}
                        onClick={() => setCurrentQ(i)}
                    >{i + 1}</button>
                ))}
            </div>

            {/* Question Card */}
            {q && (
                <div className={styles.questionCard}>
                    <div className={styles.qNum}>Question {currentQ + 1} of {questions.length}</div>
                    <div className={styles.qText}>{q.text}</div>
                    <div className={styles.options}>
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                className={`${styles.option} ${answers[q.questionId] === i ? styles.optionSelected : ''}`}
                                onClick={() => setAnswers(prev => ({ ...prev, [q.questionId]: i }))}
                            >
                                <span className={styles.optionLetter}>{['A', 'B', 'C', 'D'][i]}</span>
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className={styles.navRow}>
                <button className={styles.navBtn} disabled={currentQ === 0} onClick={() => setCurrentQ(q => q - 1)}>
                    <ChevronLeft size={18} /> Previous
                </button>
                {!isLastQ ? (
                    <button className={styles.navBtn} onClick={() => setCurrentQ(q => q + 1)}>
                        Next <ChevronRight size={18} />
                    </button>
                ) : (
                    <button className={`${styles.navBtn} ${styles.navBtnFinish}`} onClick={() => setConfirmSubmit(true)}>
                        Finish & Submit <Send size={16} />
                    </button>
                )}
            </div>

            {/* Confirm Submit Modal */}
            {confirmSubmit && !submitting && (
                <div className={styles.modal} onClick={() => setConfirmSubmit(false)}>
                    <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
                        <h3>Submit Exam?</h3>
                        <p>You have answered <strong>{answeredCount}/{questions.length}</strong> questions. Unanswered questions will be marked as incorrect.</p>
                        <p style={{ color: '#dc2626', fontWeight: 600 }}>⚠️ This action cannot be undone.</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.cancelBtn} onClick={() => setConfirmSubmit(false)}>Continue Exam</button>
                            <button className={styles.submitFinalBtn} onClick={() => handleSubmit(false)} disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Yes, Submit Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {submitting && (
                <div className={styles.modal}>
                    <div className={styles.confirmBox} style={{ textAlign: 'center' }}>
                        <div className={styles.spinner} style={{ margin: '0 auto 1rem' }} />
                        <p>Submitting and grading your exam...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
