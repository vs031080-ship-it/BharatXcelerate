'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Eye, Camera, Save, Lock, Smartphone, Monitor, Globe, Plus, X, GraduationCap, Trash2, CheckCircle } from 'lucide-react';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';
import styles from '../../account.module.css';

const tabs = [
    { id: 'general', label: 'General' },
    { id: 'education', label: 'Education' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
];

export default function StudentSettingsPage() {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Editable State
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        github: '',
        linkedin: '',
    });

    // Skills
    const [skills, setSkills] = useState(['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS']);

    // Load real user data
    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                location: user.location || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
            });
            if (user.skills?.length > 0) setSkills(user.skills);
        }
    }, [user]);
    const [newSkill, setNewSkill] = useState('');

    // Education
    const [education, setEducation] = useState([
        { id: 1, degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2021 - 2025', gpa: '9.2 / 10' },
        { id: 2, degree: 'Class XII — CBSE', institution: 'Delhi Public School, RK Puram', year: '2019 - 2021', gpa: '96.4%' },
    ]);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const updates = {
                name: profile.name,
                phone: profile.phone,
                bio: profile.bio,
                location: profile.location,
                github: profile.github,
                linkedin: profile.linkedin,
                skills: skills,
            };

            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates),
            });

            if (res.ok) {
                const data = await res.json();
                updateUser(updates);
                setIsEditing(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save');
            }
        } catch (err) {
            // Fallback: save locally
            updateUser({ name: profile.name, phone: profile.phone, bio: profile.bio, location: profile.location, skills });
            setIsEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        setSaving(false);
    };

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            if (!skills.includes(newSkill.trim())) {
                setSkills([...skills, newSkill.trim()]);
            }
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className={styles.container}>
            {/* Toast */}
            <AnimatePresence>
                {saved && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <CheckCircle size={18} /> Changes saved successfully!
                    </motion.div>
                )}
                {error && (
                    <motion.div className={styles.toast} style={{ background: '#D92D20' }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{profile.name}</h1>
                <p className={styles.pageSubtitle}>Manage your details and personal preferences here.</p>
                {activeTab === 'general' && (
                    <div className={styles.headerActions}>
                        {isEditing ? (
                            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        ) : (
                            <button className={styles.editBtnPrimary} onClick={() => setIsEditing(true)}>Edit Profile</button>
                        )}
                    </div>
                )}
            </div>

            {/* Tab Bar */}
            <div className={styles.tabBar}>
                {tabs.map(tab => (
                    <button key={tab.id} className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className={styles.sectionHeading}>Basics</h3>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Photo</div>
                        <div className={styles.rowValue}>
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face" alt="Avatar" className={styles.avatarSmall} />
                        </div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Change</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Name</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.name} onChange={(e) => handleChange('name', e.target.value)} /> : profile.name}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Email address</div>
                        <div className={styles.rowValue}>{profile.email}</div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Phone</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)} /> : (profile.phone || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Bio</div>
                        <div className={styles.rowValue} style={{ maxWidth: 480 }}>
                            {isEditing ? <textarea className={styles.textarea} value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} /> : (profile.bio || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Location</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.location} onChange={(e) => handleChange('location', e.target.value)} /> : (profile.location || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>GitHub</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.github} placeholder="github.com/username" onChange={(e) => handleChange('github', e.target.value)} /> : (profile.github || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>LinkedIn</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.linkedin} placeholder="linkedin.com/in/username" onChange={(e) => handleChange('linkedin', e.target.value)} /> : (profile.linkedin || '—')}
                        </div>
                    </div>

                    <h3 className={styles.sectionHeading}>Skills</h3>
                    <div className={styles.settingsRow} style={{ alignItems: 'flex-start' }}>
                        <div className={styles.rowLabel}>Skills</div>
                        <div className={styles.rowValue} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                            <div className={styles.skillTags}>
                                {skills.map(skill => (
                                    <span key={skill} className={styles.skill} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingRight: 6 }}>
                                        {skill}
                                        {isEditing && (
                                            <button onClick={() => removeSkill(skill)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#98A2B3' }}>
                                                <X size={12} />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {isEditing && (
                                <input
                                    type="text"
                                    placeholder="Type a skill and press Enter..."
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={addSkill}
                                    style={{ maxWidth: 300, padding: '8px 12px', border: '1px solid #D0D5DD', borderRadius: '8px' }}
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles.saveActionRow}>
                        {isEditing && <button className={styles.saveBtn} onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}</button>}
                    </div>
                </motion.div>
            )}

            {activeTab === 'education' && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 16 }}>
                        <h3 className={styles.sectionHeading} style={{ padding: 0, margin: 0 }}>Education History</h3>
                        <button className="btn btn-secondary btn-sm"><Plus size={14} /> Add Education</button>
                    </div>
                    <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                        {education.map((edu, index) => (
                            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, borderBottom: index < education.length - 1 ? '1px solid #EAECF0' : 'none' }}>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F9F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <GraduationCap size={20} color="#6941C6" />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px', fontSize: '0.9375rem', fontWeight: 600, color: '#101828' }}>{edu.degree}</h4>
                                        <p style={{ margin: '0 0 4px', fontSize: '0.875rem', color: '#475467' }}>{edu.institution}</p>
                                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#98A2B3' }}>{edu.year} · GPA: {edu.gpa}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'privacy' && <PrivacyTab />}

        </div>
    );
}

function SecurityTab() {
    return (
        <div style={{ paddingTop: 24 }}>
            <div className={styles.card}>
                <h3>Change Password</h3>
                <div className={styles.formStack}>
                    <div className={styles.formGroup}>
                        <label>Current Password</label>
                        <input type="password" placeholder="Enter current password" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>New Password</label>
                        <input type="password" placeholder="Enter new password" />
                    </div>
                </div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}><Lock size={14} /> Update Password</button>
            </div>
        </div>
    );
}

function NotificationsTab() {
    return (
        <div style={{ paddingTop: 24 }}>
            <div className={styles.card}>
                <h3>Notification Preferences</h3>
                <ToggleRow label="Project updates & reminders" sub="Get notified when a project deadline is approaching" defaultChecked={true} />
                <ToggleRow label="Scorecard updates" sub="When your scorecard is recalculated" defaultChecked={true} />
            </div>
        </div>
    );
}

function PrivacyTab() {
    return (
        <div style={{ paddingTop: 24 }}>
            <div className={styles.card}>
                <h3>Privacy Settings</h3>
                <ToggleRow label="Public profile" sub="Allow companies and investors to discover your profile" defaultChecked={true} />
            </div>
        </div>
    );
}

function ToggleRow({ label, sub, defaultChecked }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}><strong>{label}</strong><span>{sub}</span></div>
            <label className={styles.toggle}>
                <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
                <span className={styles.slider}></span>
            </label>
        </div>
    );
}
