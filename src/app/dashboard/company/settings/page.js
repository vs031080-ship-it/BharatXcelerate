'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Eye, Camera, Save, Lock, Smartphone, Monitor } from 'lucide-react';
import styles from '../../account.module.css';

const tabs = [
    { id: 'general', label: 'Company Info' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
];

export default function CompanySettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>TechNova Solutions</h1>
                <p className={styles.pageSubtitle}>Manage your company details and hiring preferences.</p>
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
                                <span style={{ color: 'white', fontWeight: 700 }}>TN</span>
                            </div>
                        </div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Change</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Company Name</div>
                        <div className={styles.rowValue}>TechNova Solutions</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Industry</div>
                        <div className={styles.rowValue}>Enterprise Software</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Website</div>
                        <div className={styles.rowValue}>technova.com</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Location</div>
                        <div className={styles.rowValue}>Mumbai, India</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Overview</div>
                        <div className={styles.rowValue} style={{ maxWidth: 480 }}>Leading enterprise software company specializing in AI-driven automation and cloud infrastructure.</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <h3 className={styles.sectionHeading}>Team Members</h3>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Admin</div>
                        <div className={styles.rowValue}>
                            <div className={styles.teamRow} style={{ padding: 0 }}>
                                <div className={styles.teamIcon} style={{ width: 32, height: 32, fontSize: 12 }}>JD</div>
                                <span>John Doe (You)</span>
                            </div>
                        </div>
                        <div className={styles.rowAction}><span style={{ fontSize: '0.8125rem', color: '#98A2B3' }}>Owner</span></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Recruiters</div>
                        <div className={styles.rowValue}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div className={styles.teamRow} style={{ padding: 0 }}>
                                    <div className={styles.teamIcon} style={{ width: 32, height: 32, fontSize: 12 }}>AS</div>
                                    <span>Alice Smith</span>
                                </div>
                                <div className={styles.teamRow} style={{ padding: 0 }}>
                                    <div className={styles.teamIcon} style={{ width: 32, height: 32, fontSize: 12 }}>RK</div>
                                    <span>Raj Kapoor</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Manage</button></div>
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
