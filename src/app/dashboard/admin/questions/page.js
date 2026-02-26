'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';
import styles from '../admin.module.css';

const LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function QuestionsAdminPage() {
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [total, setTotal] = useState(0);
    const [poolStats, setPoolStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', level: '' });
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [bulkJson, setBulkJson] = useState('');
    const [bulkResult, setBulkResult] = useState(null);
    const [form, setForm] = useState({ category: '', level: 'beginner', text: '', options: ['', '', '', ''], correctIndex: 0 });

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { fetchQuestions(); }, [filter, page]);

    async function fetchCategories() {
        const res = await fetch('/api/admin/skills');
        const data = await res.json();
        setCategories(data.categories || []);
    }

    async function fetchQuestions() {
        setLoading(true);
        const params = new URLSearchParams({ page, limit: 15 });
        if (filter.category) params.set('category', filter.category);
        if (filter.level) params.set('level', filter.level);
        const res = await fetch('/api/admin/questions?' + params);
        const data = await res.json();
        setQuestions(data.questions || []);
        setTotal(data.total || 0);
        setPoolStats(data.poolStats || []);
        setLoading(false);
    }

    function getPoolSize(catId, level) {
        const stat = poolStats.find(s => s._id.category?.toString() === catId && s._id.level === level);
        return stat?.count || 0;
    }

    async function handleSave(e) {
        e.preventDefault(); setSaving(true); setError('');
        const options = form.options.map((text, i) => ({ text, isCorrect: i === form.correctIndex }));
        try {
            const res = await fetch('/api/admin/questions', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: form.category, level: form.level, text: form.text, options }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Error'); return; }
            setShowModal(false); fetchQuestions();
        } finally { setSaving(false); }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this question?')) return;
        await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
        fetchQuestions();
    }

    async function handleBulkSubmit(e) {
        e.preventDefault(); setSaving(true); setBulkResult(null);
        try {
            const questions = JSON.parse(bulkJson);
            const res = await fetch('/api/admin/questions/bulk', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions }),
            });
            const data = await res.json();
            setBulkResult(data);
            fetchQuestions();
        } catch (err) {
            setBulkResult({ error: 'Invalid JSON: ' + err.message });
        } finally { setSaving(false); }
    }

    const pages = Math.ceil(total / 15);

    return (
        <div className={styles.page}>
            <div className={styles.topRow}>
                <div>
                    <h1 className={styles.title}>Question Bank</h1>
                    <p className={styles.subtitle}>{total} questions total</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className={styles.btnEdit} onClick={() => setShowBulkModal(true)}><Upload size={14} /> &nbsp;Bulk Import</button>
                    <button className={styles.btnPrimary} onClick={() => { setForm({ category: categories[0]?._id || '', level: 'beginner', text: '', options: ['', '', '', ''], correctIndex: 0 }); setError(''); setShowModal(true); }}><Plus size={16} /> &nbsp;Add Question</button>
                </div>
            </div>

            {/* Pool Stats */}
            {categories.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    {categories.slice(0, 5).map(cat => LEVELS.map(lvl => {
                        const count = getPoolSize(cat._id, lvl);
                        const pct = Math.min((count / 100) * 100, 100);
                        return (
                            <div key={cat._id + lvl} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.6rem 0.9rem', minWidth: 130 }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>{cat.icon} {cat.name} / <span className={`${styles.badge} ${styles['badge' + lvl.charAt(0).toUpperCase() + lvl.slice(1)]}`}>{lvl}</span></div>
                                <div className={styles.poolBar}><div className={styles.poolBarFill} style={{ width: pct + '%', background: pct >= 100 ? '#10b981' : '#6366f1' }} /></div>
                                <div className={styles.poolText}>{count}/100 questions</div>
                            </div>
                        );
                    }))}
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <select className={styles.searchBar} value={filter.category} onChange={e => { setFilter(f => ({ ...f, category: e.target.value })); setPage(1); }}>
                    <option value="">All Skills</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                </select>
                <select className={styles.searchBar} value={filter.level} onChange={e => { setFilter(f => ({ ...f, level: e.target.value })); setPage(1); }}>
                    <option value="">All Levels</option>
                    {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
            </div>

            <div className={styles.tableWrap}>
                {loading ? <div className={styles.emptyState}>Loading...</div> : questions.length === 0 ? (
                    <div className={styles.emptyState}>No questions found. Add some or run the seed.</div>
                ) : (
                    <table className={styles.table}>
                        <thead><tr><th>Question</th><th>Skill</th><th>Level</th><th>Options</th><th>Actions</th></tr></thead>
                        <tbody>
                            {questions.map(q => (
                                <tr key={q._id}>
                                    <td style={{ maxWidth: 360, lineHeight: 1.4 }}>{q.text.slice(0, 100)}{q.text.length > 100 ? '…' : ''}</td>
                                    <td>{q.category?.name || '—'}</td>
                                    <td><span className={`${styles.badge} ${styles['badge' + q.level.charAt(0).toUpperCase() + q.level.slice(1)]}`}>{q.level}</span></td>
                                    <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{q.options?.length} options</td>
                                    <td><button className={styles.btnDanger} onClick={() => handleDelete(q._id)}><Trash2 size={13} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {
                pages > 1 && (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                        {Array.from({ length: pages }, (_, i) => (
                            <button key={i} className={styles.btnEdit} style={{ fontWeight: page === i + 1 ? 700 : 400 }} onClick={() => setPage(i + 1)}>{i + 1}</button>
                        ))}
                    </div>
                )
            }

            {/* Add Single Question Modal */}
            {
                showModal && (
                    <div className={styles.modal} onClick={() => setShowModal(false)}>
                        <div className={styles.modalBox} onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
                            <h2 className={styles.modalTitle}>Add New Question</h2>
                            <form onSubmit={handleSave}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Skill *</label>
                                        <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                            <option value="">Select skill</option>
                                            {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Level *</label>
                                        <select required value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                                            {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Question Text *</label>
                                    <textarea required rows={3} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Enter the question..." style={{ resize: 'vertical' }} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Options (select correct)</label>
                                    {form.options.map((opt, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <input type="radio" name="correct" checked={form.correctIndex === i} onChange={() => setForm(f => ({ ...f, correctIndex: i }))} />
                                            <input style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.9rem' }} required value={opt} onChange={e => setForm(f => { const opts = [...f.options]; opts[i] = e.target.value; return { ...f, options: opts }; })} placeholder={`Option ${i + 1}${i === form.correctIndex ? ' (correct)' : ''}`} />
                                        </div>
                                    ))}
                                </div>
                                {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{error}</p>}
                                <div className={styles.modalActions}>
                                    <button type="button" className={styles.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Saving...' : 'Add Question'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Bulk Import Modal */}
            {
                showBulkModal && (
                    <div className={styles.modal} onClick={() => setShowBulkModal(false)}>
                        <div className={styles.modalBox} onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
                            <h2 className={styles.modalTitle}>Bulk Import Questions</h2>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem' }}>Paste a JSON array of questions. Each must have: <code>category</code> (ObjectId), <code>level</code>, <code>text</code>, and <code>options: [&#123;text, isCorrect&#125;]</code>.</p>
                            <form onSubmit={handleBulkSubmit}>
                                <div className={styles.formGroup}>
                                    <label>JSON Array</label>
                                    <textarea rows={10} value={bulkJson} onChange={e => setBulkJson(e.target.value)} placeholder='[{"category": "...", "level": "beginner", "text": "...", "options": [...]}]' style={{ fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }} />
                                </div>
                                {bulkResult && (
                                    <div className={`${styles.alert} ${bulkResult.error ? styles.alertError : styles.alertSuccess}`} style={{ marginBottom: '0.75rem' }}>
                                        {bulkResult.error || `Inserted: ${bulkResult.inserted}, Failed: ${bulkResult.failed}`}
                                    </div>
                                )}
                                <div className={styles.modalActions}>
                                    <button type="button" className={styles.btnCancel} onClick={() => setShowBulkModal(false)}>Close</button>
                                    <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Importing...' : 'Import'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
