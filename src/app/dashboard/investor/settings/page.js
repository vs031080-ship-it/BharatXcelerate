'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Eye, Save, Lock, Target, DollarSign, CheckCircle } from 'lucide-react';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';
import styles from '../../account.module.css';

const tabs = [
    { id: 'general', label: 'Investor Profile' },
    { id: 'preferences', label: 'Investment Preferences' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
];

export default function InvestorSettingsPage() {
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
                <h1 className={styles.pageTitle}>{profile.name || 'Investor'}</h1>
                <p className={styles.pageSubtitle}>Manage your investor profile and deal flow preferences.</p>
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
                    <h3 className={styles.sectionHeading}>Profile Details</h3>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Photo</div>
                        <div className={styles.rowValue}>
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face" alt="Avatar" className={styles.avatarSmall} />
                        </div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Change</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Full Name</div>
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
                            {isEditing ? <input className={styles.input} value={profile.github} placeholder="ventures.com" onChange={(e) => handleChange('github', e.target.value)} /> : (profile.github || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>LinkedIn</div>
                        <div className={styles.rowValue}>
                            {isEditing ? <input className={styles.input} value={profile.linkedin} placeholder="linkedin.com/in/username" onChange={(e) => handleChange('linkedin', e.target.value)} /> : (profile.linkedin || '—')}
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Bio</div>
                        <div className={styles.rowValue} style={{ maxWidth: 480 }}>
                            {isEditing ? <textarea className={styles.textarea} value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} /> : (profile.bio || '—')}
                        </div>
                    </div>
                </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
                <div>
                    <h3 className={styles.sectionHeading}>Investment Thesis</h3>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Min Check Size</div>
                        <div className={styles.rowValue}>₹1,00,000</div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Max Check Size</div>
                        <div className={styles.rowValue}>₹10,00,000</div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Preferred Stage</div>
                        <div className={styles.rowValue}>Pre-Seed, Seed</div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Focus Sectors</div>
                        <div className={styles.rowValue}>Deep Tech, AI/ML, AgriTech, HealthTech</div>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div style={{ paddingTop: 24 }}>
                    <div className={styles.card}>
                        <h3>Deal Flow Alerts</h3>
                        <ToggleRow label="New idea matches" sub="When student ideas match your focus areas" defaultChecked={true} />
                        <ToggleRow label="Pitch deck submissions" sub="When founders submit updated pitch decks" defaultChecked={true} />
                        <ToggleRow label="Portfolio updates" sub="ROI changes and milestone updates from investments" defaultChecked={true} />
                    </div>
                </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
                <div style={{ paddingTop: 24 }}>
                    <div className={styles.card}>
                        <h3>Visibility</h3>
                        <ToggleRow label="Public investor profile" sub="Allow students and companies to view your profile" defaultChecked={true} />
                        <ToggleRow label="Show portfolio publicly" sub="Display your investment history on your public profile" defaultChecked={false} />
                        <ToggleRow label="Allow direct pitches" sub="Students can send you pitch decks directly" defaultChecked={true} />
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
