'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Plus, Search, Pencil, Trash2, X, CheckCircle, Shield } from 'lucide-react';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from '../admin.module.css';

const domains = ['Full Stack', 'AI/ML', 'Blockchain', 'Backend', 'Frontend', 'Data Science', 'Mobile', 'DevOps', 'Cloud', 'Cybersecurity'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const emptyForm = { title: '', description: '', domain: 'Full Stack', difficulty: 'Intermediate', points: 100, image: '', skills: '', startDate: '', deadline: '' };

export default function AdminProjectsPage() {
    const router = useRouter(); // Add router
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    const loadProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects', { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { loadProjects(); }, []);

    const openAdd = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (project) => {
        router.push(`/admin/projects/${project._id}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            ...form,
            points: Number(form.points),
            skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
        try {
            if (editingId) {
                payload.id = editingId;
                const res = await fetch('/api/admin/projects', {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    const data = await res.json();
                    setProjects(prev => prev.map(p => p._id === editingId ? data.project : p));
                    setToast('Project updated!');
                }
            } else {
                const res = await fetch('/api/admin/projects', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    const data = await res.json();
                    setProjects(prev => [data.project, ...prev]);
                    setToast('Project created! Redirecting...');
                    setTimeout(() => router.push(`/admin/projects/${data.project._id}`), 1000);
                }
            }
            setShowModal(false);
            setTimeout(() => setToast(''), 3000);
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/projects?id=${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                setProjects(prev => prev.filter(p => p._id !== id));
                setToast('Project deleted.');
                setTimeout(() => setToast(''), 3000);
            }
        } catch (e) { console.error(e); }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.domain.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <AnimatePresence>
                {toast && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <CheckCircle size={16} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Project Management</h1>
                    <p>Create and manage projects that students can explore and work on.</p>
                </div>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={openAdd}>
                    <Plus size={16} /> Add Project
                </button>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchInput}>
                    <Search size={18} />
                    <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className={styles.tableCard}>
                {loading ? (
                    <div className={styles.empty}><Shield size={32} /><h3>Loading projects...</h3></div>
                ) : filteredProjects.length === 0 ? (
                    <div className={styles.empty}>
                        <FolderKanban size={32} />
                        <h3>No projects yet</h3>
                        <p>Click &ldquo;Add Project&rdquo; to create one.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Domain</th>
                                <th>Difficulty</th>
                                <th>Points</th>
                                <th>Status</th>
                                <th>Deadline</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map(project => (
                                <tr key={project._id}>
                                    <td style={{ fontWeight: 500, color: '#0F172A' }}>{project.title}</td>
                                    <td><span className={`${styles.badge} ${styles.badgeCompany}`}>{project.domain}</span></td>
                                    <td><span className={`${styles.badge} ${project.difficulty === 'Beginner' ? styles.badgeActive :
                                        project.difficulty === 'Advanced' || project.difficulty === 'Expert' ? styles.badgePending :
                                            styles.badgeStudent
                                        }`}>{project.difficulty}</span></td>
                                    <td>{project.points}</td>
                                    <td><span className={`${styles.badge} ${project.status === 'active' ? styles.badgeActive : styles.badgePending}`}>{project.status}</span></td>
                                    <td>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No Deadline'}</td>
                                    <td>
                                        <div className={styles.btnGroup}>
                                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => openEdit(project)}><Pencil size={14} /></button>
                                            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(project._id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
                        <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>
                                <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.modalBody}>
                                    <div className={styles.formGroup}>
                                        <label>Project Title *</label>
                                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. E-Commerce Platform" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Description *</label>
                                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Describe what students will build..." />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div className={styles.formGroup}>
                                            <label>Domain *</label>
                                            <select value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })}>
                                                {domains.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Difficulty *</label>
                                            <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                                                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                                        <div className={styles.formGroup}>
                                            <label>Points</label>
                                            <input type="number" value={form.points} onChange={e => setForm({ ...form, points: e.target.value })} min="0" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Image URL</label>
                                            <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/..." />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Skills (comma-separated)</label>
                                        <input type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, MongoDB" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Project Deadline (Syncs to Student Calendar) *</label>
                                        <input type="date" value={form.deadline ? new Date(form.deadline).toISOString().split('T')[0] : ''} onChange={e => setForm({ ...form, deadline: e.target.value })} required />
                                    </div>
                                </div>
                                <div className={styles.formActions}>
                                    <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
                                        {saving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
