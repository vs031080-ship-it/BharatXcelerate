'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, XCircle, Award, MinusCircle } from 'lucide-react';
import styles from './report.module.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function ExamReportPage() {
    const { sessionId } = useParams();
    const router = useRouter();
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReport() {
            try {
                const res = await fetch(`/api/student/exams/session/${sessionId}`);
                if (!res.ok) { router.push('/dashboard/student/exams'); return; }
                const data = await res.json();
                setSessionData(data);
                setLoading(false);
            } catch (e) {
                console.error(e);
                router.push('/dashboard/student/exams');
            }
        }
        fetchReport();
    }, [sessionId]);

    if (loading) return (
        <div className={styles.loader}>
            <div className={styles.spinner} />
            <p>Loading your detailed report...</p>
        </div>
    );

    const { session, reportDetails } = sessionData;

    if (!reportDetails) return (
        <div className={styles.page}>
            <button className={styles.backBtn} onClick={() => router.push('/dashboard/student/exams')}>
                <ChevronLeft size={16} /> Back to Exams
            </button>
            <h2>Detailed Report Not Available</h2>
            <p>This exam may not be fully submitted yet or detailed reporting is unavailable.</p>
        </div>
    );

    const correctCount   = reportDetails.filter(r => r.isCorrect).length;
    const incorrectCount = reportDetails.filter(r => !r.isCorrect).length;
    const attemptedCount = reportDetails.length;
    const totalQuestions = session.questions?.length || 50;
    const accuracy       = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.topBar}>
                <button className={styles.backBtn} onClick={() => router.push('/dashboard/student/exams')}>
                    <ChevronLeft size={16} /> Back to Exams
                </button>
                <h1 className={styles.pageTitle}>
                    {session.testPaper?.badgeLabel || session.testPaper?.category?.name || 'Exam'} — Report
                </h1>
            </div>

            {/* Score banner */}
            <div className={`${styles.scoreBanner} ${session.passed ? styles.scoreBannerPass : styles.scoreBannerFail}`}>
                <div className={styles.scoreInfo}>
                    <div className={styles.scoreStat}>
                        <span>Status</span>
                        <span>{session.passed ? '✅ Passed' : '❌ Not Passed'}</span>
                    </div>
                    <div className={styles.scoreDivider} />
                    <div className={styles.scoreStat}>
                        <span>Overall Score</span>
                        <span>{session.score}/100</span>
                    </div>
                    <div className={styles.scoreDivider} />
                    <div className={styles.scoreStat}>
                        <span>Correct</span>
                        <span style={{ color: '#86EFAC' }}>{correctCount}</span>
                    </div>
                    <div className={styles.scoreDivider} />
                    <div className={styles.scoreStat}>
                        <span>Incorrect</span>
                        <span style={{ color: '#FCA5A5' }}>{incorrectCount}</span>
                    </div>
                    <div className={styles.scoreDivider} />
                    <div className={styles.scoreStat}>
                        <span>Accuracy</span>
                        <span>{accuracy}%</span>
                    </div>
                </div>
                {session.passed && session.testPaper?.badgeLabel && (
                    <div className={styles.badgeEarned}>
                        <Award size={18} /> Badge Earned: <strong>{session.testPaper.badgeLabel}</strong>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.dotCorrect}`} /> Correct Answer
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.dotWrong}`} /> Your Wrong Answer
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.dotNeutral}`} /> Not Selected
                </div>
            </div>

            {/* Section header */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Question-by-Question Review</h2>
                <p className={styles.sectionSub}>
                    You attempted {attemptedCount} of {totalQuestions} questions. Unattempted questions are hidden.
                </p>
            </div>

            {/* Question cards */}
            <div className={styles.reportList}>
                {reportDetails.map((q, i) => (
                    <div
                        key={i}
                        className={`${styles.questionCard} ${q.isCorrect ? styles.cardCorrect : styles.cardIncorrect}`}
                    >
                        {/* Q header */}
                        <div className={styles.qHeader}>
                            <div className={styles.qMeta}>
                                <span className={styles.qNum}>Q{i + 1}</span>
                                <span className={`${styles.qResult} ${q.isCorrect ? styles.resultPass : styles.resultFail}`}>
                                    {q.isCorrect
                                        ? <><CheckCircle2 size={14} /> Correct</>
                                        : <><XCircle size={14} /> Incorrect</>
                                    }
                                </span>
                            </div>
                            <p className={styles.qText}>{q.questionText}</p>
                        </div>

                        {/* Options */}
                        <div className={styles.optionsList}>
                            {q.options.map((opt, optIdx) => {
                                const isSelected   = q.selectedOptionIndex === optIdx;
                                const isCorrectOpt = q.correctOptionIndex === optIdx;
                                const isWrongPick  = isSelected && !isCorrectOpt;

                                // Determine row type
                                let type = 'neutral';
                                if (isCorrectOpt) type = 'correct';
                                else if (isWrongPick) type = 'wrong';

                                return (
                                    <div
                                        key={optIdx}
                                        className={`${styles.optionRow}
                                            ${type === 'correct' ? styles.optCorrect : ''}
                                            ${type === 'wrong'   ? styles.optWrong   : ''}
                                            ${type === 'neutral' ? styles.optNeutral : ''}`}
                                    >
                                        {/* Letter badge */}
                                        <span className={`${styles.optLetter}
                                            ${type === 'correct' ? styles.letterCorrect : ''}
                                            ${type === 'wrong'   ? styles.letterWrong   : ''}
                                            ${type === 'neutral' ? styles.letterNeutral  : ''}`}>
                                            {LETTERS[optIdx]}
                                        </span>

                                        {/* Option text */}
                                        <span className={styles.optText}>{opt}</span>

                                        {/* Right-side tag */}
                                        <span className={styles.optTag}>
                                            {isCorrectOpt && isSelected && (
                                                <span className={styles.tagCorrectYours}>
                                                    <CheckCircle2 size={13} /> Your Answer · Correct ✓
                                                </span>
                                            )}
                                            {isCorrectOpt && !isSelected && (
                                                <span className={styles.tagCorrect}>
                                                    <CheckCircle2 size={13} /> Correct Answer
                                                </span>
                                            )}
                                            {isWrongPick && (
                                                <span className={styles.tagWrong}>
                                                    <XCircle size={13} /> Your Answer · Wrong ✗
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
