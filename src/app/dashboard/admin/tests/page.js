'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Upload, ChevronDown, ChevronRight, BookOpen, ClipboardList, CheckCircle, Loader2, X, AlertCircle } from 'lucide-react';
import styles from './exams.module.css';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const LEVEL_COLORS = { beginner: '#3b82f6', intermediate: '#f59e0b', advanced: '#ef4444' };
const ICONS = ['📚', '🐍', '🟨', '⚛️', '🟢', '🍃', '🗄️', '🎨', '🔀', '📊', '🔗', '💻', '🧠', '🚀', '✨'];

export default function AdminExamsPage() {
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [questionTotal, setQuestionTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [qLoading, setQLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    // ── Create Test form
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ skillName: '', skillIcon: '📚', level: 'beginner', duration: 120, questionsCount: 50, passingScore: 40 });
    const [creating, setCreating] = useState(false);

    // ── Edit Description
    const [editingDesc, setEditingDesc] = useState(false);
    const [descForm, setDescForm] = useState('');
    const [savingDesc, setSavingDesc] = useState(false);

    // ── Add Question form
    const [qForm, setQForm] = useState({ text: '', a: '', b: '', c: '', d: '', correct: 'a' });
    const [addingQ, setAddingQ] = useState(false);

    // ── Bulk import
    const [bulkText, setBulkText] = useState('');
    const [bulkImporting, setBulkImporting] = useState(false);
    const [showBulk, setShowBulk] = useState(false);

    function flash(text, type = 'success') {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: '' }), 3500);
    }

    const fetchTests = useCallback(async () => {
        setLoading(true);
        const res = await fetch('/api/admin/tests');
        const data = await res.json();
        setTests(data.tests || []);
        setLoading(false);
    }, []);

    const fetchQuestions = useCallback(async (testId, page = 1) => {
        setQLoading(true);
        const res = await fetch(`/api/admin/tests/${testId}/questions?page=${page}`);
        const data = await res.json();
        setQuestions(data.questions || []);
        setQuestionTotal(data.total || 0);
        setCurrentPage(data.page || 1);
        setTotalPages(data.pages || 1);
        setQLoading(false);
    }, []);

    useEffect(() => { fetchTests(); }, [fetchTests]);

    useEffect(() => {
        if (selectedTest) fetchQuestions(selectedTest._id, 1);
    }, [selectedTest, fetchQuestions]);

    async function handleCreateTest(e) {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch('/api/admin/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { flash(data.error || 'Failed to create test', 'error'); return; }
            flash(`Test "${data.test.badgeLabel}" created!`);
            setShowCreate(false);
            setForm({ skillName: '', skillIcon: '📚', level: 'beginner', duration: 120, questionsCount: 50, passingScore: 40 });
            await fetchTests();
        } finally { setCreating(false); }
    }

    async function handleDeleteTest(testId) {
        if (!confirm('Delete this test paper and all its questions? This cannot be undone.')) return;
        const res = await fetch(`/api/admin/tests/${testId}`, { method: 'DELETE' });
        if (res.ok) {
            flash('Test deleted');
            setSelectedTest(null);
            setQuestions([]);
            await fetchTests();
        } else { flash('Failed to delete', 'error'); }
    }

    async function handleAddQuestion(e) {
        e.preventDefault();
        if (!selectedTest) return;
        setAddingQ(true);
        try {
            const options = [
                { text: qForm.a, isCorrect: qForm.correct === 'a' },
                { text: qForm.b, isCorrect: qForm.correct === 'b' },
                { text: qForm.c, isCorrect: qForm.correct === 'c' },
                { text: qForm.d, isCorrect: qForm.correct === 'd' },
            ];
            const res = await fetch(`/api/admin/tests/${selectedTest._id}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: qForm.text, options }),
            });
            const data = await res.json();
            if (!res.ok) { flash(data.error || 'Failed to add question', 'error'); return; }
            flash('Question added!');
            setQForm({ text: '', a: '', b: '', c: '', d: '', correct: 'a' });
            await fetchQuestions(selectedTest._id, 1);
            // Update question count in tests list
            setTests(prev => prev.map(t => t._id === selectedTest._id ? { ...t, questionCount: t.questionCount + 1 } : t));
        } finally { setAddingQ(false); }
    }

    async function handleDeleteQuestion(questionId) {
        const res = await fetch(`/api/admin/tests/${selectedTest._id}/questions?questionId=${questionId}`, { method: 'DELETE' });
        if (res.ok) {
            setQuestions(prev => prev.filter(q => q._id !== questionId));
            setQuestionTotal(prev => prev - 1);
            setTests(prev => prev.map(t => t._id === selectedTest._id ? { ...t, questionCount: Math.max(0, t.questionCount - 1) } : t));
            flash('Question deleted');
        } else { flash('Failed to delete', 'error'); }
    }

    async function handleSaveDesc() {
        setSavingDesc(true);
        try {
            const res = await fetch(`/api/admin/tests/${selectedTest._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: descForm }),
            });
            if (!res.ok) { flash('Failed to save description', 'error'); return; }
            const data = await res.json();
            setSelectedTest(data.test);
            setTests(prev => prev.map(t => t._id === selectedTest._id ? { ...t, description: data.test.description } : t));
            setEditingDesc(false);
            flash('Description updated');
        } finally { setSavingDesc(false); }
    }

    async function handleBulkImport() {
        if (!selectedTest) return;
        setBulkImporting(true);
        try {
            let parsed;
            try { parsed = JSON.parse(bulkText); } catch { flash('Invalid JSON format', 'error'); return; }
            if (!Array.isArray(parsed)) { flash('JSON must be an array of questions', 'error'); return; }
            const res = await fetch(`/api/admin/tests/${selectedTest._id}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions: parsed }),
            });
            const data = await res.json();
            if (!res.ok) { flash(data.error || 'Import failed', 'error'); return; }
            flash(`✅ Imported ${data.added} questions!`);
            setBulkText('');
            setShowBulk(false);
            await fetchQuestions(selectedTest._id, 1);
            setTests(prev => prev.map(t => t._id === selectedTest._id ? { ...t, questionCount: t.questionCount + data.added } : t));
        } finally { setBulkImporting(false); }
    }

    return (
        <div className={styles.page}>
            {/* ── Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Exam Management</h1>
                    <p className={styles.subtitle}>Create tests, upload questions, and manage the MCQ question bank</p>
                </div>
                <button className={styles.createBtn} onClick={() => setShowCreate(v => !v)}>
                    <Plus size={16} /> New Exam
                </button>
            </div>

            {/* ── Toast */}
            {msg.text && (
                <div className={`${styles.toast} ${msg.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
                    {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />} {msg.text}
                </div>
            )}

            {/* ── Create Test Panel */}
            {showCreate && (
                <div className={styles.createPanel}>
                    <div className={styles.createPanelHeader}>
                        <h3>Create New Exam</h3>
                        <button onClick={() => setShowCreate(false)}><X size={18} /></button>
                    </div>
                    <form onSubmit={handleCreateTest} className={styles.createForm}>
                        <div className={styles.createRow}>
                            <div className={styles.formGroup}>
                                <label>Skill Name *</label>
                                <input className={styles.input} placeholder="e.g. Python, React, SQL..." value={form.skillName}
                                    onChange={e => setForm(f => ({ ...f, skillName: e.target.value }))} required />
                            </div>
                            <div className={styles.formGroup} style={{ maxWidth: 140 }}>
                                <label>Icon</label>
                                <select className={styles.input} value={form.skillIcon} onChange={e => setForm(f => ({ ...f, skillIcon: e.target.value }))}>
                                    {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                            </div>
                            <div className={styles.formGroup} style={{ maxWidth: 160 }}>
                                <label>Level *</label>
                                <select className={styles.input} value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                                    {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className={styles.createRow}>
                            <div className={styles.formGroup}>
                                <label>Duration (minutes)</label>
                                <input className={styles.input} type="number" min={10} max={300} value={form.duration}
                                    onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Questions per attempt (random)</label>
                                <input className={styles.input} type="number" min={5} max={200} value={form.questionsCount}
                                    onChange={e => setForm(f => ({ ...f, questionsCount: +e.target.value }))} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Passing Score (out of 100)</label>
                                <input className={styles.input} type="number" min={0} max={100} value={form.passingScore}
                                    onChange={e => setForm(f => ({ ...f, passingScore: +e.target.value }))} />
                            </div>
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={creating}>
                            {creating ? <><Loader2 size={15} className={styles.spin} /> Creating...</> : <><Plus size={15} /> Create Exam</>}
                        </button>
                    </form>
                </div>
            )}

            {/* ── Main Two-panel */}
            <div className={styles.panels}>
                {/* Left: Tests List */}
                <div className={styles.leftPanel}>
                    <div className={styles.panelTitle}>
                        <ClipboardList size={16} />
                        <span>{tests.length} Exams</span>
                    </div>
                    {loading ? (
                        <div className={styles.loading}><Loader2 size={24} className={styles.spin} /></div>
                    ) : tests.length === 0 ? (
                        <div className={styles.empty}>No exams yet. Create one above.</div>
                    ) : (
                        <div className={styles.testList}>
                            {tests.map(t => {
                                const isSelected = selectedTest?._id === t._id;
                                const levelColor = LEVEL_COLORS[t.level];
                                return (
                                    <div
                                        key={t._id}
                                        className={`${styles.testCard} ${isSelected ? styles.testCardActive : ''}`}
                                        onClick={() => setSelectedTest(isSelected ? null : t)}
                                    >
                                        <div className={styles.testCardLeft}>
                                            <span className={styles.testIcon}>{t.category?.icon || '📚'}</span>
                                            <div>
                                                <div className={styles.testSkill}>{t.category?.name}</div>
                                                <span className={styles.levelBadge} style={{ background: levelColor + '20', color: levelColor }}>
                                                    {t.level}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.testCardRight}>
                                            <span className={`${styles.qCount} ${t.questionCount >= 100 ? styles.qCountGood : t.questionCount >= 50 ? styles.qCountOk : styles.qCountLow}`}>
                                                {t.questionCount} Q
                                            </span>
                                            {isSelected ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right: Question Management */}
                <div className={styles.rightPanel}>
                    {!selectedTest ? (
                        <div className={styles.noSelect}>
                            <BookOpen size={48} strokeWidth={1} />
                            <p>Select an exam on the left to manage its questions</p>
                        </div>
                    ) : (
                        <>
                            {/* Exam header */}
                            <div className={styles.examHeader}>
                                <div className={styles.examHeaderLeft}>
                                    <span className={styles.examIcon}>{selectedTest.category?.icon}</span>
                                    <div>
                                        <h2 className={styles.examTitle}>{selectedTest.badgeLabel}</h2>
                                        <div className={styles.examMeta}>
                                            <span>{selectedTest.config?.duration}min</span>
                                            <span>·</span>
                                            <span>{selectedTest.config?.questionsCount} random Q per attempt</span>
                                            <span>·</span>
                                            <span>Pass: {selectedTest.config?.passingScore}/100</span>
                                            <span>·</span>
                                            <span className={questionTotal >= 100 ? styles.poolGood : styles.poolWarn}>
                                                {questionTotal} in pool {questionTotal < 100 ? `(need ${100 - questionTotal} more)` : '✓'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className={styles.deleteTestBtn} onClick={() => handleDeleteTest(selectedTest._id)}>
                                    <Trash2 size={15} /> Delete Exam
                                </button>
                            </div>

                            {/* ── Exam Description ── */}
                            <div className={styles.sectionCard}>
                                <div className={styles.sectionTitleRow}>
                                    <h3 className={styles.sectionTitle}>Exam Description</h3>
                                    {!editingDesc && (
                                        <button className={styles.textBtn} onClick={() => { setDescForm(selectedTest.description || ''); setEditingDesc(true); }}>
                                            Edit
                                        </button>
                                    )}
                                </div>
                                {editingDesc ? (
                                    <div className={styles.descEditor}>
                                        <textarea
                                            className={styles.bulkTextarea}
                                            rows={4}
                                            value={descForm}
                                            onChange={e => setDescForm(e.target.value)}
                                            placeholder="Write a short description for this exam..."
                                        />
                                        <div className={styles.descActions}>
                                            <button className={styles.cancelBtn} onClick={() => setEditingDesc(false)}>Cancel</button>
                                            <button className={styles.saveBtn} onClick={handleSaveDesc} disabled={savingDesc}>
                                                {savingDesc ? <><Loader2 size={14} className={styles.spin} /> Saving...</> : 'Save'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className={styles.descDisplay}>
                                        {selectedTest.description ? selectedTest.description : <span className={styles.emptyText}>No description added yet.</span>}
                                    </p>
                                )}
                            </div>

                            {/* Add Question Form */}
                            <div className={styles.sectionCard}>
                                <h3 className={styles.sectionTitle}><Plus size={16} /> Add Question</h3>
                                <form onSubmit={handleAddQuestion} className={styles.qForm}>
                                    <textarea
                                        className={styles.qTextarea}
                                        placeholder="Enter the question text..."
                                        value={qForm.text}
                                        onChange={e => setQForm(f => ({ ...f, text: e.target.value }))}
                                        rows={3}
                                        required
                                    />
                                    <div className={styles.optionsGrid}>
                                        {['a', 'b', 'c', 'd'].map(opt => (
                                            <div key={opt} className={`${styles.optionRow} ${qForm.correct === opt ? styles.optionCorrect : ''}`}>
                                                <label className={styles.optionLabel}>
                                                    <input
                                                        type="radio"
                                                        name="correct"
                                                        value={opt}
                                                        checked={qForm.correct === opt}
                                                        onChange={() => setQForm(f => ({ ...f, correct: opt }))}
                                                    />
                                                    <span className={styles.optionLetter}>{opt.toUpperCase()}</span>
                                                </label>
                                                <input
                                                    className={styles.optionInput}
                                                    placeholder={`Option ${opt.toUpperCase()}`}
                                                    value={qForm[opt]}
                                                    onChange={e => setQForm(f => ({ ...f, [opt]: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.qFormFooter}>
                                        <p className={styles.qHint}>🔒 The correct answer is stored server-side only — never exposed to students</p>
                                        <button type="submit" className={styles.addQBtn} disabled={addingQ}>
                                            {addingQ ? <Loader2 size={14} className={styles.spin} /> : <Plus size={14} />} Add Question
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Bulk Import */}
                            <div className={styles.sectionCard}>
                                <button className={styles.bulkToggle} onClick={() => setShowBulk(v => !v)}>
                                    <Upload size={15} /> Bulk Import (JSON)
                                    {showBulk ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                </button>
                                {showBulk && (
                                    <div className={styles.bulkBody}>
                                        <pre className={styles.bulkExample}>{`// Paste JSON array in this format:\n[\n  {\n    "text": "What is X?",\n    "options": [\n      { "text": "Correct answer", "isCorrect": true },\n      { "text": "Wrong answer A", "isCorrect": false },\n      { "text": "Wrong answer B", "isCorrect": false },\n      { "text": "Wrong answer C", "isCorrect": false }\n    ]\n  }\n]`}</pre>
                                        <textarea
                                            className={styles.bulkTextarea}
                                            placeholder="Paste your JSON array here..."
                                            value={bulkText}
                                            onChange={e => setBulkText(e.target.value)}
                                            rows={8}
                                        />
                                        <button className={styles.bulkBtn} onClick={handleBulkImport} disabled={bulkImporting || !bulkText.trim()}>
                                            {bulkImporting ? <><Loader2 size={14} className={styles.spin} /> Importing...</> : <><Upload size={14} /> Import Questions</>}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Questions List */}
                            <div className={styles.sectionCard}>
                                <h3 className={styles.sectionTitle}><BookOpen size={16} /> Questions ({questionTotal})</h3>
                                {qLoading ? (
                                    <div className={styles.loading}><Loader2 size={20} className={styles.spin} /></div>
                                ) : questions.length === 0 ? (
                                    <div className={styles.empty}>No questions yet. Add some above or bulk import.</div>
                                ) : (
                                    <div className={styles.qList}>
                                        {questions.map((q, i) => {
                                            const correctOption = q.options?.find(o => o.isCorrect);
                                            return (
                                                <div key={q._id} className={styles.qItem}>
                                                    <div className={styles.qNum}>{(currentPage - 1) * 50 + i + 1}</div>
                                                    <div className={styles.qContent}>
                                                        <p className={styles.qText}>{q.text}</p>
                                                        <div className={styles.qOptions}>
                                                            {q.options?.map((o, idx) => (
                                                                <span key={idx} className={`${styles.qOpt} ${o.isCorrect ? styles.qOptCorrect : ''}`}>
                                                                    {String.fromCharCode(65 + idx)}. {o.text}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button className={styles.qDelete} onClick={() => handleDeleteQuestion(q._id)} title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        {totalPages > 1 && (
                                            <div className={styles.pagination}>
                                                <button
                                                    className={styles.pageBtn}
                                                    disabled={currentPage === 1}
                                                    onClick={() => fetchQuestions(selectedTest._id, currentPage - 1)}
                                                >
                                                    Previous
                                                </button>
                                                <span className={styles.pageInfo}>
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <button
                                                    className={styles.pageBtn}
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => fetchQuestions(selectedTest._id, currentPage + 1)}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                        <p className={styles.moreHint}>Total questions in pool: {questionTotal}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
