'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2, Plus, X, Globe, Video, FileText, Code, CheckCircle, AlertCircle } from 'lucide-react';
import { getAuthHeaders } from '@/context/AuthContext';
import Link from 'next/link';
import styles from '../../admin.module.css';

const domains = ['Full Stack', 'AI/ML', 'Blockchain', 'Backend', 'Frontend', 'Data Science', 'Mobile', 'DevOps', 'Cloud', 'Cybersecurity'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const resourceTypes = [
    { value: 'doc', label: 'Documentation', icon: FileText },
    { value: 'video', label: 'Video Tutorial', icon: Video },
    { value: 'repo', label: 'Repository', icon: Code },
    { value: 'other', label: 'Other', icon: Globe },
];

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [form, setForm] = useState({
        title: '', description: '', domain: 'Full Stack', difficulty: 'Intermediate',
        points: 100, image: '', skills: '', duration: '1 week', technologies: '',
        detailedDocument: '', requirements: [], resources: []
    });

    useEffect(() => {
        if (!id) return;
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/admin/projects?id=${id}`, { headers: getAuthHeaders() });
                if (res.ok) {
                    const data = await res.json();
                    const p = data.project;
                    setForm({
                        title: p.title,
                        description: p.description,
                        domain: p.domain,
                        difficulty: p.difficulty,
                        points: p.points,
                        image: p.image || '',
                        skills: (p.skills || []).join(', '),
                        duration: p.duration || '1 week',
                        technologies: (p.technologies || []).join(', '),
                        detailedDocument: p.detailedDocument || '',
                        requirements: p.requirements || [],
                        resources: p.resources || []
                    });
                } else {
                    setToast('Project not found');
                    setTimeout(() => router.push('/admin/projects'), 2000);
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchProject();
    }, [id, router]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...form[field]];
        newArray[index] = value;
        setForm(prev => ({ ...prev, [field]: newArray }));
    };

    const handleResourceChange = (index, key, value) => {
        const newResources = [...form.resources];
        newResources[index] = { ...newResources[index], [key]: value };
        setForm(prev => ({ ...prev, resources: newResources }));
    };

    const addArrayItem = (field, initialValue) => {
        setForm(prev => ({ ...prev, [field]: [...prev[field], initialValue] }));
    };

    const removeArrayItem = (field, index) => {
        setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                id,
                ...form,
                points: Number(form.points),
                skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
                technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
            };

            const res = await fetch('/api/admin/projects', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setToast('Project saved successfully!');
                setTimeout(() => setToast(''), 3000);
            } else {
                setToast('Failed to save project');
            }
        } catch (e) {
            console.error(e);
            setToast('Error saving project');
        }
        setSaving(false);
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div>
            {toast && <div className={styles.toast}>{toast}</div>}

            <div className={styles.pageHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link href="/admin/projects" className={styles.btnIcon}><ArrowLeft size={20} /></Link>
                    <h1>Edit Project</h1>
                </div>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave} disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <form className={styles.editForm} onSubmit={handleSave}>
                <div className={styles.card}>
                    <h3>Basic Information</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Domain</label>
                            <select value={form.domain} onChange={e => handleChange('domain', e.target.value)}>
                                {domains.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Difficulty</label>
                            <select value={form.difficulty} onChange={e => handleChange('difficulty', e.target.value)}>
                                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Duration</label>
                            <input type="text" value={form.duration} onChange={e => handleChange('duration', e.target.value)} placeholder="e.g. 1 week" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Points (XP)</label>
                            <input type="number" value={form.points} onChange={e => handleChange('points', e.target.value)} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Image URL</label>
                            <input type="text" value={form.image} onChange={e => handleChange('image', e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Detailed Document URL (PDF/Doc)</label>
                        <input type="text" value={form.detailedDocument} onChange={e => handleChange('detailedDocument', e.target.value)} placeholder="https://example.com/project-brief.pdf" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description (Markdown supported)</label>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <button type="button" className={styles.btnSmall} onClick={() => setForm(prev => ({ ...prev, description: prev.description + '**bold** ' }))}>Bold</button>
                            <button type="button" className={styles.btnSmall} onClick={() => setForm(prev => ({ ...prev, description: prev.description + '*italic* ' }))}>Italic</button>
                            <button type="button" className={styles.btnSmall} onClick={() => setForm(prev => ({ ...prev, description: prev.description + '\n- list item' }))}>List</button>
                        </div>
                        <textarea rows={8} value={form.description} onChange={e => handleChange('description', e.target.value)} required />
                    </div>
                </div>

                <div className={styles.card}>
                    <h3>Skills & Technologies</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Skills to Learn (comma separated)</label>
                            <input type="text" value={form.skills} onChange={e => handleChange('skills', e.target.value)} placeholder="React, Node.js..." />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tech Stack (comma separated)</label>
                            <input type="text" value={form.technologies} onChange={e => handleChange('technologies', e.target.value)} placeholder="MongoDB, Express..." />
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeaderAction}>
                        <h3>Key Requirements</h3>
                        <button type="button" className={`${styles.btn} ${styles.btnSmall}`} onClick={() => addArrayItem('requirements', '')}>
                            <Plus size={14} /> Add Requirement
                        </button>
                    </div>
                    <div className={styles.listContainer}>
                        {form.requirements.map((req, i) => (
                            <div key={i} className={styles.listItem}>
                                <span className={styles.listIndex}>{i + 1}.</span>
                                <input type="text" value={req} onChange={e => handleArrayChange('requirements', i, e.target.value)} placeholder="e.g. Implement user authentication" />
                                <button type="button" onClick={() => removeArrayItem('requirements', i)} className={styles.btnDangerIcon}><Trash2 size={16} /></button>
                            </div>
                        ))}
                        {form.requirements.length === 0 && <p className={styles.emptyText}>No requirements added yet.</p>}
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeaderAction}>
                        <h3>Learning Resources</h3>
                        <button type="button" className={`${styles.btn} ${styles.btnSmall}`} onClick={() => addArrayItem('resources', { title: '', type: 'doc', url: '' })}>
                            <Plus size={14} /> Add Resource
                        </button>
                    </div>
                    <div className={styles.listContainer}>
                        {form.resources.map((res, i) => (
                            <div key={i} className={styles.resourceItem}>
                                <select value={res.type} onChange={e => handleResourceChange(i, 'type', e.target.value)} className={styles.typeSelect}>
                                    {resourceTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                                <input type="text" value={res.title} onChange={e => handleResourceChange(i, 'title', e.target.value)} placeholder="Resource Title" style={{ flex: 1 }} />
                                <input type="text" value={res.url} onChange={e => handleResourceChange(i, 'url', e.target.value)} placeholder="URL" style={{ flex: 1 }} />
                                <button type="button" onClick={() => removeArrayItem('resources', i)} className={styles.btnDangerIcon}><Trash2 size={16} /></button>
                            </div>
                        ))}
                        {form.resources.length === 0 && <p className={styles.emptyText}>No resources added yet.</p>}
                    </div>
                </div>
            </form>
        </div>
    );
}
