'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, Upload, Plus, Trash2, ArrowRight, ArrowLeft, User, Shield, X, Image as ImageIcon, Camera } from 'lucide-react';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';
import styles from './settingsUI.module.css';

const steps = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'education', label: 'Education & Skills' }
];

const maleAvatars = [
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM1&top=shortFlat&clothing=blazerAndShirt&mouth=smile&eyes=default&eyebrows=default&backgroundColor=f8fafc',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM2&top=shortRound&clothing=collarAndSweater&mouth=smile&eyes=default&eyebrows=default&backgroundColor=c0aede',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM3&top=shortCurly&clothing=shirtCrewNeck&mouth=smile&eyes=default&eyebrows=default&backgroundColor=b6e3f4',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM4&top=theCaesar&clothing=blazerAndSweater&mouth=smile&eyes=default&eyebrows=default&backgroundColor=d1d4f9',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM5&top=sides&clothing=shirtVNeck&mouth=smile&eyes=default&eyebrows=default&backgroundColor=ffd5dc',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM6&top=shavedSides&clothing=blazerAndShirt&mouth=smile&eyes=default&eyebrows=default&backgroundColor=f8fafc',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM7&top=shortWaved&clothing=collarAndSweater&mouth=smile&eyes=default&eyebrows=default&backgroundColor=c0aede',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM8&top=theCaesarAndSidePart&clothing=shirtCrewNeck&mouth=smile&eyes=default&eyebrows=default&backgroundColor=b6e3f4',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM9&top=shortFlat&clothing=blazerAndSweater&mouth=smile&eyes=default&eyebrows=default&backgroundColor=d1d4f9',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=ProfessionalM10&top=shortRound&clothing=shirtVNeck&mouth=smile&eyes=default&eyebrows=default&backgroundColor=ffd5dc',
];

const femaleAvatars = [
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F1&top=bob&clothing=blazerAndShirt&mouth=smile&eyes=default&eyebrows=default&backgroundColor=f8fafc',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F2&top=bun&clothing=shirtVNeck&mouth=smile&eyes=default&eyebrows=default&backgroundColor=c0aede',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F3&top=curvy&clothing=collarAndSweater&mouth=smile&eyes=default&eyebrows=default&backgroundColor=b6e3f4',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F4&top=longButNotTooLong&clothing=shirtCrewNeck&mouth=smile&eyes=default&eyebrows=default&backgroundColor=d1d4f9',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F5&top=miaWallace&clothing=blazerAndSweater&mouth=smile&eyes=default&eyebrows=default&backgroundColor=ffd5dc',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F6&top=straight01&clothing=blazerAndShirt&mouth=smile&eyes=default&eyebrows=default&backgroundColor=f8fafc',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F7&top=straight02&clothing=shirtVNeck&mouth=smile&eyes=default&eyebrows=default&backgroundColor=c0aede',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F8&top=bigHair&clothing=collarAndSweater&mouth=smile&eyes=default&eyebrows=default&backgroundColor=b6e3f4',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F9&top=frizzle&clothing=shirtCrewNeck&mouth=smile&eyes=default&eyebrows=default&backgroundColor=d1d4f9',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=F10&top=froBand&clothing=blazerAndSweater&mouth=smile&eyes=default&eyebrows=default&backgroundColor=ffd5dc',
];

const bannerPresets = [
    'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000',
    'https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=1000',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
];

export default function StudentSettingsWizard() {
    const { user, updateUser } = useAuth();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleteMode, setIsCompleteMode] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Refs for file uploads
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    // Selection Modal State
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showBannerModal, setShowBannerModal] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        name: '', email: '', phone: '', bio: '', location: '', github: '', linkedin: '',
        avatar: '', banner: ''
    });
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [education, setEducation] = useState([]);

    // Security State
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

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
                avatar: user.avatar || '',
                banner: user.banner || '',
            });
            if (user.skills?.length > 0) setSkills(user.skills);
            if (user.education?.length > 0) setEducation(user.education);
            else setEducation([{ id: Date.now(), degree: '', institution: '', year: '', gpa: '' }]);

            // Completeness check logic
            let filledFields = 0;
            const fieldsToCheck = [
                user.phone, user.bio, user.location, user.github, user.linkedin,
                user.skills?.length > 0 ? true : '', user.education?.length > 0 ? true : ''
            ];
            fieldsToCheck.forEach(field => {
                if (field && typeof field === 'string' && field.trim() !== '') filledFields++;
                else if (field === true) filledFields++;
            });

            if (filledFields >= 5) {
                setIsCompleteMode(true);
            }
        }
    }, [user]);

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleAvatarSelect = (url) => {
        setProfile(prev => ({ ...prev, avatar: url }));
        setShowAvatarModal(false);
    };

    const handleBannerSelect = (url) => {
        setProfile(prev => ({ ...prev, banner: url }));
        setShowBannerModal(false);
    };

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'avatar') {
                    setProfile(prev => ({ ...prev, avatar: reader.result }));
                    setShowAvatarModal(false);
                } else {
                    setProfile(prev => ({ ...prev, banner: reader.result }));
                    setShowBannerModal(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Education Handlers
    const addEducation = () => setEducation([...education, { id: Date.now(), degree: '', institution: '', year: '', gpa: '' }]);
    const updateEducation = (id, field, value) => setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    const removeEducation = (id) => setEducation(education.filter(edu => edu.id !== id));

    // Skill Handlers
    const addSkill = (e) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            e.preventDefault();
            if (!skills.includes(newSkill.trim())) setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };
    const removeSkill = (sk) => setSkills(skills.filter(s => s !== sk));

    // Save Profile Base API Call
    const handleSaveProfile = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const updates = { ...profile, skills, education: education.filter(e => e.degree || e.institution) };
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
                setError(data.error || 'Failed to save profile');
            }
        } catch (err) {
            updateUser({ ...profile, skills, education });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        setSaving(false);
    };

    const handleSavePassword = (e) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setPasswords({ current: '', new: '', confirm: '' });
            setTimeout(() => setSaved(false), 3000);
        }, 1200);
    };

    const nextStep = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };
    const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
    };

    const SelectionModal = ({ title, show, onClose, children }) => (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={styles.selectionModal}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={styles.selectionContent}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={styles.selectionHeader}>
                            <h2>{title}</h2>
                            <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                        </div>
                        <div className={styles.selectionBody} style={{ padding: 0 }}>
                            {/* Upload Section (Pinned at Top) */}
                            <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', padding: '20px 24px 16px' }}>
                                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                            <Camera size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Upload Custom Photo</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>JPG, PNG or SVG (Max 5MB)</div>
                                        </div>
                                    </div>
                                    <button className={styles.saveBtn} style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => title.toLowerCase().includes('avatar') ? avatarInputRef.current.click() : bannerInputRef.current.click()}>
                                        Choose File
                                    </button>
                                </div>
                                <div className={styles.divider} style={{ margin: '16px 0 0 0', width: '100%' }}></div>
                            </div>

                            {/* Scrollable List */}
                            <div style={{ padding: '0 24px 24px' }}>
                                {children}
                            </div>
                        </div>
                        <div className={styles.selectionFooter}>
                            <button className={styles.cancelBtn} onClick={onClose}>Close</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // =========================================================================
    // STANDARD MODE
    // =========================================================================
    if (isCompleteMode) {
        return (
            <div className={styles.appContainer}>
                <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                <input type="file" ref={bannerInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />
                <AnimatePresence>
                    {saved && (
                        <motion.div className={styles.toast} initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <CheckCircle size={18} /> Settings updated successfully!
                        </motion.div>
                    )}
                </AnimatePresence>

                <SelectionModal title="Select Avatar" show={showAvatarModal} onClose={() => setShowAvatarModal(false)}>
                    <div className={styles.avatarCategory}>
                        <h4>Male Avatars</h4>
                        <div className={styles.selectionGrid}>
                            {maleAvatars.map((url, i) => (
                                <div key={i} className={`${styles.avatarOption} ${profile.avatar === url ? styles.selected : ''}`} onClick={() => handleAvatarSelect(url)}>
                                    <img src={url} alt={`Male ${i}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.avatarCategory}>
                        <h4>Female Avatars</h4>
                        <div className={styles.selectionGrid}>
                            {femaleAvatars.map((url, i) => (
                                <div key={i} className={`${styles.avatarOption} ${profile.avatar === url ? styles.selected : ''}`} onClick={() => handleAvatarSelect(url)}>
                                    <img src={url} alt={`Female ${i}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </SelectionModal>

                <SelectionModal title="Select Banner" show={showBannerModal} onClose={() => setShowBannerModal(false)}>
                    <div className={styles.selectionGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                        {bannerPresets.map((url, i) => (
                            <div key={i} className={`${styles.bannerOption} ${profile.banner === url ? styles.selected : ''}`} onClick={() => handleBannerSelect(url)}>
                                <img src={url} alt={`Banner ${i}`} />
                            </div>
                        ))}
                    </div>
                </SelectionModal>

                <div className={styles.headerArea}>
                    <h2 className={styles.pageTitle}>Account Settings</h2>
                </div>

                <div className={styles.cardContainer}>
                    <div
                        className={styles.coverBanner}
                        style={{
                            height: '140px',
                            backgroundImage: profile.banner ? `url(${profile.banner})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={() => setShowBannerModal(true)}
                    >
                        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.4)', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ImageIcon size={14} /> Change Banner
                        </div>
                    </div>

                    <div className={styles.profileHeaderContent} style={{ marginTop: '-60px' }}>
                        <div className={styles.avatarWrapper} style={{ width: '110px', height: '110px', border: '5px solid white' }}>
                            <img
                                src={profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face"}
                                alt="Avatar"
                                className={styles.avatar}
                            />
                            <button className={styles.uploadBtn} title="Change Photo" onClick={() => setShowAvatarModal(true)}>
                                <Upload size={14} />
                            </button>
                        </div>
                        <div className={styles.headerInfo} style={{ marginTop: '68px' }}>
                            <h1 className={styles.userName} style={{ fontSize: '1.25rem' }}>{profile.name}</h1>
                            <p className={styles.userBioText} style={{ margin: 0 }}>Manage your profile settings and secure your account.</p>
                        </div>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.settingsLayout}>
                        {/* Tab Sidebar */}
                        <div className={styles.settingsSidebar}>
                            <button className={`${styles.settingsTab} ${activeTab === 'profile' ? styles.active : ''}`} onClick={() => setActiveTab('profile')}>
                                <User size={18} /> Edit Profile
                            </button>
                            <button className={`${styles.settingsTab} ${activeTab === 'security' ? styles.active : ''}`} onClick={() => setActiveTab('security')}>
                                <Shield size={18} /> Security & Password
                            </button>
                        </div>

                        {/* Setting Views */}
                        <div className={styles.settingsContent}>
                            {activeTab === 'profile' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

                                    <div className={styles.settingsSection}>
                                        <h3>Personal & Contact Information</h3>
                                        <div className={styles.formGrid}>
                                            <div className={styles.inputGroup}>
                                                <label>Full Name</label>
                                                <input type="text" value={profile.name} onChange={e => handleChange('name', e.target.value)} required />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Location</label>
                                                <input type="text" value={profile.location} onChange={e => handleChange('location', e.target.value)} />
                                            </div>
                                            <div className={styles.inputGroupFull}>
                                                <label>Professional Bio</label>
                                                <textarea value={profile.bio} onChange={e => handleChange('bio', e.target.value)} style={{ minHeight: '80px' }} />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Phone Number</label>
                                                <input type="text" value={profile.phone} onChange={e => handleChange('phone', e.target.value)} />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Email Address</label>
                                                <input type="email" value={profile.email} disabled className={styles.disabledInput} />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>GitHub</label>
                                                <input type="text" value={profile.github} onChange={e => handleChange('github', e.target.value)} />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>LinkedIn</label>
                                                <input type="text" value={profile.linkedin} onChange={e => handleChange('linkedin', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.divider}></div>

                                    <div className={styles.settingsSection}>
                                        <div className={styles.sectionTitle}>
                                            Education History
                                            <button type="button" className={styles.addBtnSmall} onClick={addEducation}><Plus size={14} /> Add New Entry</button>
                                        </div>
                                        {education.map((edu) => (
                                            <div key={edu.id} className={styles.educationItem}>
                                                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                    <div className={styles.inputGroup}><input type="text" placeholder="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                                                    <div className={styles.inputGroup}><input type="text" placeholder="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} /></div>
                                                    <div className={styles.inputGroup}><input type="text" placeholder="Year (e.g. 2021-2025)" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} /></div>
                                                    <div className={styles.inputGroup}><input type="text" placeholder="GPA" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} /></div>
                                                </div>
                                                {education.length > 1 && (
                                                    <button type="button" className={styles.removeBtn} onClick={() => removeEducation(edu.id)} style={{ marginLeft: 16 }} title="Remove Entry"><Trash2 size={16} /></button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.settingsSection}>
                                        <div className={styles.sectionTitle}>Technical Skills</div>
                                        <div className={styles.skillsContainer}>
                                            <div className={styles.skillTags}>
                                                {skills.map(skill => (
                                                    <span key={skill} className={styles.skillBadge}>
                                                        {skill} <button type="button" onClick={() => removeSkill(skill)}><X size={12} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input type="text" className={styles.skillInput} placeholder="Type a skill and press Enter..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={addSkill} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                                        <button className={styles.saveBtn} onClick={handleSaveProfile} disabled={saving}>
                                            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
                                        </button>
                                    </div>

                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className={styles.settingsSection}>
                                        <h3>Change Password</h3>
                                        <form onSubmit={handleSavePassword} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div className={styles.inputGroup}>
                                                <label>Current Password</label>
                                                <input type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" required />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>New Password</label>
                                                <input type="password" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} placeholder="••••••••" required />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Confirm New Password</label>
                                                <input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" required />
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                                                <button type="submit" className={styles.saveBtn} disabled={saving || passwords.new !== passwords.confirm || !passwords.new}>
                                                    <Shield size={16} /> {saving ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // WIZARD MODE
    // =========================================================================
    return (
        <div className={styles.appContainer}>
            <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
            <input type="file" ref={bannerInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />
            <AnimatePresence>
                {saved && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <CheckCircle size={18} /> Profile updated successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <SelectionModal title="Select Avatar" show={showAvatarModal} onClose={() => setShowAvatarModal(false)}>
                <div className={styles.avatarCategory}>
                    <h4>Male Avatars</h4>
                    <div className={styles.selectionGrid}>
                        {maleAvatars.map((url, i) => (
                            <div key={i} className={`${styles.avatarOption} ${profile.avatar === url ? styles.selected : ''}`} onClick={() => handleAvatarSelect(url)}>
                                <img src={url} alt={`Male ${i}`} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.avatarCategory}>
                    <h4>Female Avatars</h4>
                    <div className={styles.selectionGrid}>
                        {femaleAvatars.map((url, i) => (
                            <div key={i} className={`${styles.avatarOption} ${profile.avatar === url ? styles.selected : ''}`} onClick={() => handleAvatarSelect(url)}>
                                <img src={url} alt={`Female ${i}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </SelectionModal>

            <SelectionModal title="Select Banner" show={showBannerModal} onClose={() => setShowBannerModal(false)}>
                <div className={styles.selectionGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {bannerPresets.map((url, i) => (
                        <div key={i} className={`${styles.bannerOption} ${profile.banner === url ? styles.selected : ''}`} onClick={() => handleBannerSelect(url)}>
                            <img src={url} alt={`Banner ${i}`} />
                        </div>
                    ))}
                </div>
            </SelectionModal>

            <div className={styles.headerArea}>
                <h2 className={styles.pageTitle}>Complete Your Profile</h2>
            </div>

            <div className={styles.cardContainer}>
                <div
                    className={styles.coverBanner}
                    style={{
                        backgroundImage: profile.banner ? `url(${profile.banner})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={() => setShowBannerModal(true)}
                >
                    <div className={styles.bannerDecor1}></div>
                    <div className={styles.bannerDecor2}></div>
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.4)', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ImageIcon size={14} /> Change Banner
                    </div>
                </div>

                <div className={styles.profileHeaderContent}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face"}
                            alt="Avatar"
                            className={styles.avatar}
                        />
                        <button className={styles.uploadBtn} title="Change Photo" onClick={() => setShowAvatarModal(true)}>
                            <Upload size={14} />
                        </button>
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.userName}>{profile.name || 'Setup Profile'}</h1>
                        <p className={styles.userBioText}>{profile.bio || 'Enhance your discoverability by completing the steps below.'}</p>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.wizardContainer}>
                    <div className={styles.stepperOverlay}>
                        <div className={styles.stepLine}>
                            <div className={styles.stepLineFill} style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
                        </div>
                        {steps.map((step, index) => {
                            const isActive = currentStep === index;
                            const isCompleted = currentStep > index;
                            return (
                                <div key={step.id} className={`${styles.stepNode} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
                                    {isCompleted ? <CheckCircle size={16} /> : index + 1}
                                    <label>{step.label}</label>
                                </div>
                            );
                        })}
                    </div>

                    <form className={styles.stepContentArea} onSubmit={(e) => { e.preventDefault(); if (currentStep === steps.length - 1) handleSaveProfile(); else nextStep(); }}>
                        <AnimatePresence mode="wait">

                            {/* STEP 1 */}
                            {currentStep === 0 && (
                                <motion.div key="step0" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.animateStep}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.inputGroup}>
                                            <label>Full Name</label>
                                            <input type="text" value={profile.name} onChange={e => handleChange('name', e.target.value)} placeholder="John Doe" required />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Location</label>
                                            <input type="text" value={profile.location} onChange={e => handleChange('location', e.target.value)} placeholder="New Delhi, India" required />
                                        </div>
                                        <div className={styles.inputGroupFull}>
                                            <label>Professional Bio</label>
                                            <textarea value={profile.bio} onChange={e => handleChange('bio', e.target.value)} placeholder="A brief description of your background and goals..." required />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2 */}
                            {currentStep === 1 && (
                                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.animateStep}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.inputGroup}>
                                            <label>Email Address</label>
                                            <input type="email" value={profile.email} disabled className={styles.disabledInput} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Phone Number</label>
                                            <input type="text" value={profile.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" required />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>GitHub Link</label>
                                            <input type="text" value={profile.github} onChange={e => handleChange('github', e.target.value)} placeholder="github.com/johndoe" required />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>LinkedIn Link</label>
                                            <input type="text" value={profile.linkedin} onChange={e => handleChange('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" required />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3 */}
                            {currentStep === 2 && (
                                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.animateStep}>
                                    <div className={styles.sectionTitle}>
                                        Education History
                                        <button type="button" className={styles.addBtnSmall} onClick={addEducation}><Plus size={14} /> Add New</button>
                                    </div>
                                    {education.map((edu, idx) => (
                                        <div key={edu.id} className={styles.educationItem}>
                                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <div className={styles.inputGroup}><input type="text" placeholder="Degree (e.g. B.Tech CS)" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                                                <div className={styles.inputGroup}><input type="text" placeholder="Institution Name" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} /></div>
                                                <div className={styles.inputGroup}><input type="text" placeholder="Year (e.g. 2021-2025)" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} /></div>
                                                <div className={styles.inputGroup}><input type="text" placeholder="CGPA/Percentage" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} /></div>
                                            </div>
                                            {education.length > 1 && (
                                                <button type="button" className={styles.removeBtn} onClick={() => removeEducation(edu.id)} style={{ marginLeft: 16 }} title="Remove Entry"><Trash2 size={16} /></button>
                                            )}
                                        </div>
                                    ))}

                                    <div className={styles.sectionDivider}><h3>Technical Skills</h3></div>
                                    <div className={styles.skillsContainer}>
                                        <div className={styles.skillTags}>
                                            {skills.map(skill => (<span key={skill} className={styles.skillBadge}>{skill}<button type="button" onClick={() => removeSkill(skill)}><X size={12} /></button></span>))}
                                        </div>
                                        <input type="text" className={styles.skillInput} placeholder="Type a skill and press Enter..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={addSkill} />
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>

                        <div className={styles.wizardActions}>
                            {currentStep > 0 ? (
                                <button type="button" className={styles.cancelBtn} onClick={prevStep}><ArrowLeft size={16} /> Back</button>
                            ) : <div></div>}

                            {currentStep < steps.length - 1 ? (
                                <button type="submit" className={styles.nextBtn}>Next <ArrowRight size={16} /></button>
                            ) : (
                                <button type="button" className={styles.saveBtn} onClick={handleSaveProfile} disabled={saving}>
                                    <Save size={16} /> {saving ? 'Finalizing...' : 'Save & Publish Profile'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
