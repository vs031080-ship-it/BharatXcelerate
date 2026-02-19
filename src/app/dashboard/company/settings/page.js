'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Eye, Camera, Save, Lock, Smartphone, Monitor, CheckCircle } from 'lucide-react';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';
import styles from '../../account.module.css';

const tabs = [
    { id: 'general', label: 'Company Info' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
];

export default function CompanySettingsPage() {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        bio: '',
        location: '',
        github: '',
        linkedin: '',
    });

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                location: user.location || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
            });
        }
    }, [user]);

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = {
                name: profile.name,
                bio: profile.bio,
                location: profile.location,
                github: profile.github,
                linkedin: profile.linkedin,
            };
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const data = await res.json();
                updateUser(data.user || updates);
            } else {
                updateUser(updates);
            }
        } catch {
            updateUser({
                name: profile.name,
                bio: profile.bio,
                location: profile.location,
                github: profile.github,
                linkedin: profile.linkedin,
            });
        }
        setSaving(false);
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
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
            </AnimatePresence>

            {/* Page Header */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{profile.name || 'Company'}</h1>
                <p className={styles.pageSubtitle}>Manage your company details and hiring preferences.</p>
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
                <div>
                    <h3 className={styles.sectionHeading}>Company Profile</h3>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Logo</div>
                        <div className={styles.rowValue}>
                            <div className={styles.companyAvatar} style={{ background: 'linear-gradient(135deg, #10B981, #2563EB)' }}>
                                <span style={{ color: 'white', fontWeight: 700 }}>{(profile.name || 'CO').slice(0, 2).toUpperCase()}</span>
                            </div>
                        </div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Change</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Company Name</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.name} onChange={(e) => handleChange('name', e.target.value)} /> : (profile.name || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Email</div>
                        <div className={styles.rowValue}>{profile.email || '—'}</div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Website</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.github} placeholder="company.com" onChange={(e) => handleChange('github', e.target.value)} /> : (profile.github || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>LinkedIn</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.linkedin} placeholder="linkedin.com/company/name" onChange={(e) => handleChange('linkedin', e.target.value)} /> : (profile.linkedin || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Location</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.location} onChange={(e) => handleChange('location', e.target.value)} /> : (profile.location || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Overview</div>
                        <div className={styles.rowValue} style={{ maxWidth: 480 }}>
                            {isEditing ? <textarea className={styles.textarea} value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} /> : (profile.bio || '—')}
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
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
                            <div className={styles.formGroup}>
                                <label>Confirm New Password</label>
                                <input type="password" placeholder="Confirm new password" />
                            </div>
                        </div>
                        <button className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}><Lock size={14} /> Update Password</button>
                    </div>
                    <div className={styles.card}>
                        <h3>Two-Factor Authentication</h3>
                        <p className={styles.cardDesc}>Secure your company account with an extra layer of protection.</p>
                        <ToggleRow label="Enable 2FA" sub="Use an authenticator app for login verification" defaultChecked={true} />
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div style={{ paddingTop: 24 }}>
                    <div className={styles.card}>
                        <h3>Hiring Notifications</h3>
                        <p className={styles.cardDesc}>Manage alerts for job applications and candidate milestones.</p>
                        <ToggleRow label="New applications" sub="Get notified when a candidate applies to a job" defaultChecked={true} />
                        <ToggleRow label="Candidate messages" sub="When a candidate replies to your message" defaultChecked={true} />
                        <ToggleRow label="Shortlist updates" sub="Daily summary of shortlisted candidates" defaultChecked={false} />
                        <ToggleRow label="Interview reminders" sub="Reminders for upcoming scheduled interviews" defaultChecked={true} />
                    </div>
                </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
                <div style={{ paddingTop: 24 }}>
                    <div className={styles.card}>
                        <h3>Public Visibility</h3>
                        <ToggleRow label="Public company profile" sub="Allow students and investors to view your company profile" defaultChecked={true} />
                        <ToggleRow label="Show team members" sub="Display key team members on public profile" defaultChecked={true} />
                        <ToggleRow label="Allow direct messages" sub="Students can send initial messages (without applying)" defaultChecked={false} />
                    </div>
                </div>
            )}
        </div>
    );
}

function ToggleRow({ label, sub, defaultChecked }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
                <strong>{label}</strong>
                <span>{sub}</span>
            </div>
            <label className={styles.toggle}>
                <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
                <span className={styles.slider}></span>
            </label>
        </div>
    );
}
