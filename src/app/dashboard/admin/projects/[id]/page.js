'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, Save, Trash2, Plus, X, Bold, Italic, List,
    Link as LinkIcon, Image as ImageIcon, Check, Calendar,
    Layout, Type, Target, Clock, Zap, FileText, Globe, Video, Code as CodeIcon
} from 'lucide-react';
import { getAuthHeaders } from '@/context/AuthContext';
import Link from 'next/link';
import styles from './edit.module.css';

const domains = ['Full Stack', 'AI/ML', 'Blockchain', 'Backend', 'Frontend', 'Data Science', 'Mobile', 'DevOps', 'Cloud', 'Cybersecurity'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const resourceTypes = [
    { value: 'doc', label: 'Documentation', icon: FileText },
    { value: 'video', label: 'Video Tutorial', icon: Video },
    { value: 'repo', label: 'Repository', icon: CodeIcon },
    { value: 'other', label: 'Other', icon: Globe },
];

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const textareaRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [reqInput, setReqInput] = useState('');

    const [form, setForm] = useState({
        title: '', description: '', domain: 'Full Stack', difficulty: 'Intermediate',
        points: 100, image: '', skills: '', deadline: '', technologies: '',
        detailedDocument: '', requirements: [], resources: [],
        steps: []
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
                        deadline: p.deadline ? new Date(p.deadline).toISOString().split('T')[0] : '',
                        technologies: (p.technologies || []).join(', '),
                        detailedDocument: p.detailedDocument || '',
                        requirements: p.requirements || [],
                        resources: p.resources || [],
                        steps: p.steps || []
                    });
                } else {
                    setToast('Project not found');
                    setTimeout(() => router.push('/dashboard/admin/projects'), 2000);
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchProject();
    }, [id, router]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...form.steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setForm(prev => ({ ...prev, steps: newSteps }));
    };

    const addStep = () => {
        setForm(prev => ({
            ...prev,
            steps: [...prev.steps, { title: '', description: '', points: 50 }]
        }));
    };

    const removeStep = (index) => {
        setForm(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index)
        }));
    };

    const handleReqKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (reqInput.trim()) {
                setForm(prev => ({ ...prev, requirements: [...prev.requirements, reqInput.trim()] }));
                setReqInput('');
            }
        }
    };

    const removeRequirement = (index) => {
        setForm(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }));
    };

    const insertMarkdown = (syntax, placeholder = 'text') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = form.description;
        const selection = text.substring(start, end) || placeholder;

        let insertion = '';
        if (syntax === '**') insertion = `**${selection}**`;
        else if (syntax === '*') insertion = `*${selection}*`;
        else if (syntax === '- ') insertion = `\n- ${selection}`;
        else if (syntax === '# ') insertion = `\n### ${selection}`;
        else if (syntax === 'link') insertion = `[${selection}](url)`;
        else if (syntax === 'image') insertion = `![${selection}](url)`;

        const newText = text.substring(0, start) + insertion + text.substring(end);
        setForm(prev => ({ ...prev, description: newText }));
        setTimeout(() => textarea.focus(), 0);
    };

    const handleSave = async () => {
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
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            {toast && <div className={styles.toast}><Check size={18} /> {toast}</div>}

            {/* Header */}
            <div className={styles.header}>
                <div>
                    <div className={styles.breadcrumb}>
                        <Link href="/dashboard/admin/projects" className={styles.backLink}>Projects</Link>
                        <span>/</span>
                        <span>{form.title || 'Untitled Project'}</span>
                    </div>
                    <h1 className={styles.title}>{form.title || 'Edit Project'}</h1>
                </div>
                <div className={styles.actions}>
                    <Link href="/dashboard/admin/projects" className={`${styles.btn} ${styles.btnSecondary}`}>Cancel</Link>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                    </button>
                </div>
            </div>

            {/* Main Layout */}
            <div className={styles.grid}>
                {/* Left Column: Content & Steps */}
                <div className={styles.mainCol}>

                    {/* Overview & Editor */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}><Layout size={18} /> Project Overview</h3>

                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input
                                className={styles.input}
                                value={form.title}
                                onChange={e => handleChange('title', e.target.value)}
                                placeholder="Project Title"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <div className={styles.editorWrapper}>
                                <div className={styles.toolbar}>
                                    <button className={styles.toolBtn} onClick={() => insertMarkdown('**')} title="Bold"><Bold size={16} /></button>
                                    <button className={styles.toolBtn} onClick={() => insertMarkdown('*')} title="Italic"><Italic size={16} /></button>
                                    <button className={styles.toolBtn} onClick={() => insertMarkdown('# ')} title="Heading"><Type size={16} /></button>
                                    <div style={{ width: 1, background: '#E2E8F0', margin: '0 4px' }} />
                                    <button className={styles.toolBtn} onClick={() => insertMarkdown('- ')} title="List"><List size={16} /></button>
                                    <button className={styles.toolBtn} onClick={() => insertMarkdown('link')} title="Link"><LinkIcon size={16} /></button>
                                    <button className={styles.toolBtn} onClick={() => insertMarkdown('image')} title="Image"><ImageIcon size={16} /></button>
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    className={styles.textarea}
                                    value={form.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                    placeholder="Write a detailed project overview..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}><Target size={18} /> Requirements</h3>
                        <div className={styles.formGroup}>
                            <label>Add Requirements (Press Enter)</label>
                            <div className={styles.pillInputContainer}>
                                {form.requirements.map((req, i) => (
                                    <span key={i} className={styles.pill}>
                                        {req}
                                        <span className={styles.pillRemove} onClick={() => removeRequirement(i)}><X size={12} /></span>
                                    </span>
                                ))}
                                <input
                                    className={styles.transparentInput}
                                    value={reqInput}
                                    onChange={e => setReqInput(e.target.value)}
                                    onKeyDown={handleReqKeyDown}
                                    placeholder={form.requirements.length === 0 ? "e.g. React.js knowledge" : "Add another..."}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Steps Workflow */}
                    <div className={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 className={styles.cardTitle} style={{ margin: 0 }}><List size={18} /> Project Workflow (Steps)</h3>
                        </div>

                        <div className={styles.timeline}>
                            {form.steps.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>
                                    No steps defined yet. Start building the workflow.
                                </div>
                            )}

                            {form.steps.map((step, i) => (
                                <div key={i} className={styles.stepItem}>
                                    <div className={styles.stepDot}>{i + 1}</div>
                                    <div className={styles.stepCard}>
                                        <div className={styles.stepHeader}>
                                            <input
                                                className={styles.stepTitleInput}
                                                value={step.title}
                                                onChange={e => handleStepChange(i, 'title', e.target.value)}
                                                placeholder="Step Title"
                                            />
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                <input
                                                    className={styles.stepPointsInput}
                                                    type="number"
                                                    value={step.points}
                                                    onChange={e => handleStepChange(i, 'points', e.target.value)}
                                                    title="Points (XP)"
                                                />
                                                <button className={styles.btnIconDanger} onClick={() => removeStep(i)} title="Remove Step">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            className={styles.stepDescInput}
                                            value={step.description}
                                            onChange={e => handleStepChange(i, 'description', e.target.value)}
                                            placeholder="Describe what the student needs to do in this step..."
                                        />
                                    </div>
                                </div>
                            ))}

                            <button className={styles.addStepBtn} onClick={addStep}>
                                <Plus size={16} /> Add Next Step
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Metadata */}
                <div className={styles.sideCol}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Properties</h3>

                        <div className={styles.formGroup}>
                            <label>Domain</label>
                            <select className={styles.select} value={form.domain} onChange={e => handleChange('domain', e.target.value)}>
                                {domains.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Difficulty</label>
                            <select className={styles.select} value={form.difficulty} onChange={e => handleChange('difficulty', e.target.value)}>
                                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Deadline (Admin Selection)</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={16} style={{ position: 'absolute', left: 10, top: 12, color: '#94A3B8' }} />
                                <input
                                    type="date"
                                    className={styles.input}
                                    style={{ paddingLeft: 34 }}
                                    value={form.deadline}
                                    onChange={e => handleChange('deadline', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Total Points</label>
                            <div style={{ position: 'relative' }}>
                                <Zap size={16} style={{ position: 'absolute', left: 10, top: 12, color: '#F59E0B' }} />
                                <input
                                    type="number"
                                    className={styles.input}
                                    style={{ paddingLeft: 34 }}
                                    value={form.points}
                                    onChange={e => handleChange('points', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Cover Image URL</label>
                            <input
                                className={styles.input}
                                value={form.image}
                                onChange={e => handleChange('image', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Tags</h3>
                        <div className={styles.formGroup}>
                            <label>Skills</label>
                            <input
                                className={styles.input}
                                value={form.skills}
                                onChange={e => handleChange('skills', e.target.value)}
                                placeholder="React, Node.js..."
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Technologies</label>
                            <input
                                className={styles.input}
                                value={form.technologies}
                                onChange={e => handleChange('technologies', e.target.value)}
                                placeholder="VS Code, Docker..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
