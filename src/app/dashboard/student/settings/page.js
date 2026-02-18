'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Eye, Camera, Save, Lock, Smartphone, Monitor, Globe, Plus, X, GraduationCap, Trash2 } from 'lucide-react';
import styles from '../../account.module.css';

const tabs = [
    { id: 'general', label: 'General' },
    { id: 'education', label: 'Education' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
];

export default function StudentSettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);

    // State for Skills
    const [skills, setSkills] = useState(['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS']);
    const [newSkill, setNewSkill] = useState('');

    // State for Education
    const [education, setEducation] = useState([
        { id: 1, degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2021 - 2025', gpa: '9.2 / 10' },
        { id: 2, degree: 'Class XII — CBSE', institution: 'Delhi Public School, RK Puram', year: '2019 - 2021', gpa: '96.4%' },
    ]);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
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

    const removeEducation = (id) => {
        setEducation(education.filter(edu => edu.id !== id));
    };

    return (
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Arjun Sharma</h1>
                <p className={styles.pageSubtitle}>Manage your details and personal preferences here.</p>
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
                    <h3 className={styles.sectionHeading}>Basics</h3>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Photo</div>
                        <div className={styles.rowValue}>
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face" alt="Arjun" className={styles.avatarSmall} />
                        </div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Name</div>
                        <div className={styles.rowValue}>Arjun Sharma</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Email address</div>
                        <div className={styles.rowValue}>arjun@example.com</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Phone</div>
                        <div className={styles.rowValue}>+91 98765 43210</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Bio</div>
                        <div className={styles.rowValue} style={{ maxWidth: 480 }}>Passionate about building products that solve real-world problems. Currently exploring the intersection of AI and blockchain.</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Location</div>
                        <div className={styles.rowValue}>New Delhi, India</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <h3 className={styles.sectionHeading}>Skills</h3>
                    <div className={styles.settingsRow} style={{ alignItems: 'flex-start' }}>
                        <div className={styles.rowLabel}>Skills</div>
                        <div className={styles.rowValue} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                            <div className={styles.skillTags}>
                                {skills.map(skill => (
                                    <span key={skill} className={styles.skill} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingRight: 6 }}>
                                        {skill}
                                        <button onClick={() => removeSkill(skill)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#98A2B3' }}>
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Type a skill and press Enter..."
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={addSkill}
                                style={{ maxWidth: 300 }}
                            />
                        </div>
                    </div>

                    <h3 className={styles.sectionHeading}>Preferences</h3>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Language</div>
                        <div className={styles.rowValue}>
                            <select defaultValue="en">
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Timezone</div>
                        <div className={styles.rowValue}>
                            <ToggleInline label="Automatic time zone" value="GMT +05:30" />
                        </div>
                    </div>
                </div>
            )}

            {/* Education Tab */}
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
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className={styles.editBtn} style={{ padding: '6px' }}><X size={16} color="#98A2B3" /></button>
                                </div>
                            </div>
                        ))}
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
                        <p className={styles.cardDesc}>Add an extra layer of security to your account by enabling two-factor authentication.</p>
                        <ToggleRow label="Enable 2FA" sub="Use an authenticator app for login verification" defaultChecked={false} />
                    </div>
                    <div className={styles.card}>
                        <h3>Active Sessions</h3>
                        <div className={styles.sessionList}>
                            <div className={styles.sessionItem}>
                                <Monitor size={18} />
                                <div>
                                    <strong>Chrome on Windows</strong>
                                    <span>New Delhi, India · Current Session</span>
                                </div>
                            </div>
                            <div className={styles.sessionItem}>
                                <Smartphone size={18} />
                                <div>
                                    <strong>Safari on iPhone</strong>
                                    <span>Last active 2 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div style={{ paddingTop: 24 }}>
                    <div className={styles.card}>
                        <h3>Notification Preferences</h3>
                        <p className={styles.cardDesc}>Choose how you want to be notified about activity on your account.</p>
                        <ToggleRow label="Project updates & reminders" sub="Get notified when a project deadline is approaching" defaultChecked={true} />
                        <ToggleRow label="Scorecard updates" sub="When your scorecard is recalculated after completing a project" defaultChecked={true} />
                        <ToggleRow label="New project recommendations" sub="Personalized project recommendations based on your skills" defaultChecked={true} />
                        <ToggleRow label="Company interest alerts" sub="When a company views or shortlists your profile" defaultChecked={true} />
                        <ToggleRow label="Idea Lab activity" sub="Likes, comments, and feedback on your submitted ideas" defaultChecked={false} />
                        <ToggleRow label="Marketing & newsletters" sub="Product updates, tips, and promotional content" defaultChecked={false} />
                    </div>
                </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
                <div style={{ paddingTop: 24 }}>
                    <div className={styles.card}>
                        <h3>Privacy Settings</h3>
                        <p className={styles.cardDesc}>Control who can see your profile and how your data is used.</p>
                        <ToggleRow label="Public profile" sub="Allow companies and investors to discover your profile" defaultChecked={true} />
                        <ToggleRow label="Show scorecard on profile" sub="Display your scorecard rating on your public profile" defaultChecked={true} />
                        <ToggleRow label="Show projects on profile" sub="Display completed projects on your public profile" defaultChecked={true} />
                        <ToggleRow label="Allow contact from companies" sub="Companies can send you messages and interview requests" defaultChecked={true} />
                        <ToggleRow label="Analytics & usage data" sub="Help us improve by sharing anonymous usage data" defaultChecked={false} />
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

function ToggleInline({ label, value }) {
    const [checked, setChecked] = useState(true);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <label className={styles.toggle}>
                <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
                <span className={styles.slider}></span>
            </label>
            <span style={{ fontSize: '0.875rem', color: '#475467' }}>{value}</span>
        </div>
    );
}
