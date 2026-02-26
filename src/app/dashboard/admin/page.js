'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Users, ClipboardList, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ skills: 0, questions: 0, tests: 0, activeTests: 0 });
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [seedResult, setSeedResult] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            const [skillsRes, questionsRes, testsRes] = await Promise.all([
                fetch('/api/admin/skills'),
                fetch('/api/admin/questions?limit=1'),
                fetch('/api/admin/tests'),
            ]);
            const [skillsData, questionsData, testsData] = await Promise.all([
                skillsRes.json(), questionsRes.json(), testsRes.json(),
            ]);
            setStats({
                skills: skillsData.categories?.length || 0,
                questions: questionsData.total || 0,
                tests: testsData.tests?.length || 0,
                activeTests: testsData.tests?.filter(t => t.active).length || 0,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function runSeed() {
        setSeeding(true);
        setSeedResult(null);
        try {
            const res = await fetch('/api/seed/mcq');
            const data = await res.json();
            setSeedResult(data);
            fetchStats();
        } catch (e) {
            setSeedResult({ error: e.message });
        } finally {
            setSeeding(false);
        }
    }

    const cards = [
        { label: 'Skill Categories', value: stats.skills, icon: BookOpen, color: '#6366f1' },
        { label: 'Total Questions', value: stats.questions, icon: ClipboardList, color: '#10b981' },
        { label: 'Test Papers', value: stats.tests, icon: Users, color: '#f59e0b' },
        { label: 'Active Tests', value: stats.activeTests, icon: TrendingUp, color: '#3b82f6' },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Admin Dashboard</h1>
                    <p className={styles.subtitle}>Manage the MCQ Assessment System</p>
                </div>
                <button className={styles.seedBtn} onClick={runSeed} disabled={seeding}>
                    {seeding ? 'Seeding...' : '🌱 Seed Sample Questions'}
                </button>
            </div>

            {seedResult && (
                <div className={`${styles.alert} ${seedResult.error ? styles.alertError : styles.alertSuccess}`}>
                    {seedResult.error ? (
                        <><AlertCircle size={16} /> Error: {seedResult.error}</>
                    ) : (
                        <><CheckCircle size={16} /> Seeded: {seedResult.seeded?.skills} skills, {seedResult.seeded?.questions} questions, {seedResult.seeded?.tests} test papers</>
                    )}
                </div>
            )}

            <div className={styles.statsGrid}>
                {cards.map(card => (
                    <div key={card.label} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: card.color + '20', color: card.color }}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <div className={styles.statValue}>{loading ? '...' : card.value}</div>
                            <div className={styles.statLabel}>{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.infoBox}>
                <h3>Quick Actions</h3>
                <ul>
                    <li>Go to <strong>Skill Categories</strong> to add new tech skills</li>
                    <li>Go to <strong>Question Bank</strong> to add or bulk import questions</li>
                    <li>A skill+level pool needs <strong>100 active questions</strong> before the test paper can be activated</li>
                    <li>Go to <strong>Test Papers</strong> to activate a paper once the pool is ready</li>
                </ul>
            </div>
        </div>
    );
}
