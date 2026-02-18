'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Eye, Save, Lock, Target, DollarSign } from 'lucide-react';
import styles from '../../account.module.css';

const tabs = [
    { id: 'general', label: 'Investor Profile' },
    { id: 'preferences', label: 'Investment Preferences' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
];

export default function InvestorSettingsPage() {
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
                <h1 className={styles.pageTitle}>Rajesh Kumar</h1>
                <p className={styles.pageSubtitle}>Manage your investor profile and deal flow preferences.</p>
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
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face" alt="Rajesh" className={styles.avatarSmall} />
                        </div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Change</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Full Name</div>
                        <div className={styles.rowValue}>Rajesh Kumar</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Email</div>
                        <div className={styles.rowValue}>rajesh@example.com</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Title</div>
                        <div className={styles.rowValue}>Angel Investor</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Bio</div>
                        <div className={styles.rowValue} style={{ maxWidth: 480 }}>Experienced angel investor with a passion for deep tech and sustainability. Former CTO at a unicorn startup.</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
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
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Max Check Size</div>
                        <div className={styles.rowValue}>₹10,00,000</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Preferred Stage</div>
                        <div className={styles.rowValue}>Pre-Seed, Seed</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
                    </div>

                    <div className={styles.settingsRow}>
                        <div className={styles.rowLabel}>Focus Sectors</div>
                        <div className={styles.rowValue}>Deep Tech, AI/ML, AgriTech, HealthTech</div>
                        <div className={styles.rowAction}><button className={styles.editBtn}>Edit</button></div>
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
