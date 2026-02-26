'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import styles from '../admin.module.css';

export default function SkillsAdminPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { fetchCategories(); }, []);

    async function fetchCategories() {
        setLoading(true);
        const res = await fetch('/api/admin/skills');
        const data = await res.json();
        setCategories(data.categories || []);
        setLoading(false);
    }

    function openNew() { setEditing(null); setForm({ name: '', slug: '', description: '', icon: '' }); setError(''); setShowModal(true); }
    function openEdit(cat) { setEditing(cat); setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || '' }); setError(''); setShowModal(true); }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            const url = editing ? `/api/admin/skills/${editing._id}` : '/api/admin/skills';
            const method = editing ? 'PATCH' : 'POST';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Error saving'); return; }
            setShowModal(false);
            fetchCategories();
        } finally { setSaving(false); }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this skill category? This will not delete existing questions.')) return;
        await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
        fetchCategories();
    }

    async function handleToggle(cat) {
        await fetch(`/api/admin/skills/${cat._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: !cat.active }),
        });
        fetchCategories();
    }

    function autoSlug(name) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    return (
        <div className={styles.page}>
            <div className={styles.topRow}>
                <div>
                    <h1 className={styles.title}>Skill Categories</h1>
                    <p className={styles.subtitle}>{categories.length} categories configured</p>
                </div>
                <button className={styles.btnPrimary} onClick={openNew}><Plus size={16} /> &nbsp;Add Category</button>
            </div>

            <div className={styles.tableWrap}>
                {loading ? <div className={styles.emptyState}>Loading...</div> : categories.length === 0 ? (
                    <div className={styles.emptyState}>No skill categories yet. Click "Add Category" to get started.</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Icon</th><th>Name</th><th>Slug</th><th>Description</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat._id}>
                                    <td style={{ fontSize: '1.4rem' }}>{cat.icon || '📚'}</td>
                                    <td><strong>{cat.name}</strong></td>
                                    <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: '0.8rem' }}>{cat.slug}</code></td>
                                    <td style={{ color: '#94a3b8' }}>{cat.description || '—'}</td>
                                    <td>
                                        <button className={`${styles.toggleBtn} ${cat.active ? styles.toggleOn : styles.toggleOff}`} onClick={() => handleToggle(cat)}>
                                            {cat.active ? <><ToggleRight size={14} />Active</> : <><ToggleLeft size={14} />Inactive</>}
                                        </button>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.btnEdit} onClick={() => openEdit(cat)}><Pencil size={13} /></button>
                                            <button className={styles.btnDanger} onClick={() => handleDelete(cat._id)}><Trash2 size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>{editing ? 'Edit Skill Category' : 'New Skill Category'}</h2>
                        <form onSubmit={handleSave}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Name *</label>
                                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : autoSlug(e.target.value) }))} placeholder="e.g. Python" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Icon (emoji)</label>
                                    <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🐍" maxLength={4} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Slug *</label>
                                <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="python" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" />
                            </div>
                            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{error}</p>}
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
