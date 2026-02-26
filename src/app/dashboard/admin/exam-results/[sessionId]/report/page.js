'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, XCircle, Award } from 'lucide-react';
import styles from './report.module.css';

export default function AdminExamReportPage() {
    const { sessionId } = useParams();
    const router = useRouter();
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReport() {
            try {
                // The same API route checks if role === 'admin' so this is secure
                const res = await fetch(`/api/student/exams/session/${sessionId}`);
                if (!res.ok) {
                    router.push('/dashboard/admin/exam-results');
                    return;
                }
                const data = await res.json();
                setSessionData(data);
                setLoading(false);
            } catch (e) {
                console.error(e);
                router.push('/dashboard/admin/exam-results');
            }
        }
        fetchReport();
    }, [sessionId]);

    if (loading) {
        return (
            <div className={styles.loader}>
                <div className={styles.spinner} />
                <p>Loading detailed report for student...</p>
            </div>
        );
    }

    const { session, reportDetails } = sessionData;

    if (!reportDetails) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => router.push('/dashboard/admin/exam-results')}>
                        <ChevronLeft size={16} /> Back to Results
                    </button>
                    <h2>Detailed Report Not Available</h2>
                </div>
                <p>This exam may not be fully submitted yet or detailed reporting is unavailable.</p>
            </div>
        );
    }

    const correctCount = reportDetails.filter(r => r.isCorrect).length;
    const attemptedCount = reportDetails.length;
    const totalQuestions = session.questions?.length || 50;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.title}>
                    Report: {session.student?.name} ({session.testPaper?.category?.name})
                </div>
                <button className={styles.backBtn} onClick={() => router.push('/dashboard/admin/exam-results')}>
                    <ChevronLeft size={16} /> Back to Results
                </button>
            </div>

            <div className={`${styles.scoreBanner} ${session.passed ? styles.scoreBannerPass : styles.scoreBannerFail}`}>
                <div className={styles.scoreInfo}>
                    <div className={styles.scoreStat}>
                        <span>Status</span>
                        <span>{session.passed ? 'Passed' : 'Not Passed'}</span>
                    </div>
                    <div className={styles.scoreStat}>
                        <span>Overall Score</span>
                        <span>{session.score}/100</span>
                    </div>
                    <div className={styles.scoreStat}>
                        <span>Correct Answers</span>
                        <span>{correctCount} / {totalQuestions}</span>
                    </div>
                </div>
                {session.passed && session.testPaper?.badgeLabel && (
                    <div className={styles.badgeEarned}>
                        <Award size={20} /> Badge: {session.testPaper.badgeLabel}
                    </div>
                )}
            </div>

            <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Attempted Questions Analysis</h3>
            <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
                Student attempted {attemptedCount} out of {totalQuestions} questions. Unattempted questions are hidden from this report.
            </p>

            <div className={styles.reportList}>
                {reportDetails.map((q, i) => (
                    <div key={i} className={styles.questionCard}>
                        <div className={styles.qHeader}>
                            <div className={styles.qNumber}>{i + 1}</div>
                            <div className={styles.qText}>{q.questionText}</div>
                            <div className={styles.qStatusIcon}>
                                {q.isCorrect ? <CheckCircle2 size={24} color="#10b981" /> : <XCircle size={24} color="#ef4444" />}
                            </div>
                        </div>

                        <div className={styles.optionsList}>
                            {q.options.map((opt, optIdx) => {
                                const isSelected = q.selectedOptionIndex === optIdx;
                                const isCorrectOpt = q.correctOptionIndex === optIdx;

                                let optionClass = styles.option;
                                if (isCorrectOpt) {
                                    optionClass += ' ' + styles.optionCorrect;
                                } else if (isSelected && !q.isCorrect) {
                                    optionClass += ' ' + styles.optionIncorrect;
                                }

                                return (
                                    <div key={optIdx} className={optionClass}>
                                        <div className={styles.optionText}>{opt}</div>
                                        {isCorrectOpt && (
                                            <div className={`${styles.optionBadge} ${styles.badgeCorrect}`}>
                                                <CheckCircle2 size={14} /> Correct Answer
                                            </div>
                                        )}
                                        {isSelected && !q.isCorrect && (
                                            <div className={`${styles.optionBadge} ${styles.badgeIncorrect}`}>
                                                <XCircle size={14} /> Student Answer
                                            </div>
                                        )}
                                        {isSelected && q.isCorrect && (
                                            <div className={`${styles.optionBadge} ${styles.badgeCorrect}`}>
                                                <CheckCircle2 size={14} /> Student Selected
                                            </div>
                                        )}
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
