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
    const [isEditing, setIsEditing] = useState(true); // Default to editing as requested for fresh redirect
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        occupation: '',
        fatherName: '',
        motherName: '',
        dob: '',
        gender: '',
        religion: '',
        admissionDate: '',
        class: '',
        roll: '',
        studentId: '',
        civilStatus: '',
        subject: '',
        address: '',
        bio: '',
        phone: '',
        location: '',
        github: '',
        linkedin: '',
    });

    // Skills
    const [skills, setSkills] = useState([]);

    // Load real user data
    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                occupation: user.occupation || '',
                fatherName: user.fatherName || '',
                motherName: user.motherName || '',
                dob: user.dob || '',
                gender: user.gender || '',
                religion: user.religion || '',
                admissionDate: user.admissionDate || '',
                class: user.class || '',
                roll: user.roll || '',
                studentId: user.studentId || '',
                civilStatus: user.civilStatus || '',
                subject: user.subject || '',
                address: user.address || '',
                bio: user.bio || '',
                phone: user.phone || '',
                location: user.location || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
            });
            setSkills(user.skills || []);
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const updates = {
                ...profile,
                skills: skills,
            };

            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates),
            });

            if (res.ok) {
                updateUser(updates);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save');
            }
        } catch (err) {
            setError('An error occurred during save');
        }
        setSaving(false);
    };

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className={styles.container} style={{ maxWidth: '1200px' }}>
            {/* Toast */}
            <AnimatePresence>
                {saved && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <CheckCircle size={18} /> Profile updated successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.pageHeader} style={{ marginBottom: '24px' }}>
                <h1 className={styles.pageTitle}>Student Settings</h1>
                <p className={styles.pageSubtitle}>Update your profile information to reach 70% completion.</p>
            </div>

            <div className={styles.card} style={{ padding: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>

                    <div className={styles.formGroup}>
                        <label>First Name</label>
                        <input className={styles.input} value={profile.firstName} onChange={(e) => handleChange('firstName', e.target.value)} placeholder="Enter first name" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Last Name</label>
                        <input className={styles.input} value={profile.lastName} onChange={(e) => handleChange('lastName', e.target.value)} placeholder="Enter last name" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Occupation</label>
                        <input className={styles.input} value={profile.occupation} onChange={(e) => handleChange('occupation', e.target.value)} placeholder="e.g. Student, Developer" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Father Name</label>
                        <input className={styles.input} value={profile.fatherName} onChange={(e) => handleChange('fatherName', e.target.value)} placeholder="Enter father's name" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mother Name</label>
                        <input className={styles.input} value={profile.motherName} onChange={(e) => handleChange('motherName', e.target.value)} placeholder="Enter mother's name" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Date Of Birth</label>
                        <input type="date" className={styles.input} value={profile.dob} onChange={(e) => handleChange('dob', e.target.value)} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Gender</label>
                        <select className={styles.input} value={profile.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Religion</label>
                        <input className={styles.input} value={profile.religion} onChange={(e) => handleChange('religion', e.target.value)} placeholder="Enter religion" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Admission Date</label>
                        <input type="date" className={styles.input} value={profile.admissionDate} onChange={(e) => handleChange('admissionDate', e.target.value)} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Class</label>
                        <input className={styles.input} value={profile.class} onChange={(e) => handleChange('class', e.target.value)} placeholder="Enter class" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Roll Number</label>
                        <input className={styles.input} value={profile.roll} onChange={(e) => handleChange('roll', e.target.value)} placeholder="Enter roll number" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Student ID</label>
                        <input className={styles.input} value={profile.studentId} onChange={(e) => handleChange('studentId', e.target.value)} placeholder="Enter student ID" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Civil Status</label>
                        <select className={styles.input} value={profile.civilStatus} onChange={(e) => handleChange('civilStatus', e.target.value)}>
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Subject</label>
                        <input className={styles.input} value={profile.subject} onChange={(e) => handleChange('subject', e.target.value)} placeholder="Enter subject" />
                    </div>

                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                        <label>Address</label>
                        <textarea className={styles.textarea} value={profile.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Enter full address" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Phone</label>
                        <input className={styles.input} value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="Enter phone number" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Location (City, Country)</label>
                        <input className={styles.input} value={profile.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="e.g. New York, USA" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>GitHub Profile</label>
                        <input className={styles.input} value={profile.github} onChange={(e) => handleChange('github', e.target.value)} placeholder="github.com/username" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>LinkedIn Profile</label>
                        <input className={styles.input} value={profile.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} placeholder="linkedin.com/in/username" />
                    </div>

                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                        <label>Bio</label>
                        <textarea className={styles.textarea} value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} placeholder="Tell us about yourself" />
                    </div>
                </div>

                <div className={styles.saveActionRow} style={{ marginTop: '32px' }}>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </div>

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
