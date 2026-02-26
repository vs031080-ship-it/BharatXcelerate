'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, CheckCircle, Upload, Plus, Trash2, ArrowRight, ArrowLeft,
    User, Shield, X, Image as ImageIcon, Camera, Lock, Mail as MailIcon
} from 'lucide-react';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';
import styles from './settings.module.css';

const steps = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'contact',  label: 'Contact Info'    },
    { id: 'education',label: 'Education & Skills' },
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

// ── sidebar nav items ──
const SETTINGS_TABS = [
    { id: 'profile',  label: 'Edit Profile',       icon: User   },
    { id: 'security', label: 'Security & Password', icon: Shield },
];

export default function StudentSettingsPage() {
    const router = useRouter();
    const { user, updateUser } = useAuth();
    const [saved, setSaved]   = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');

    const [currentStep, setCurrentStep]     = useState(0);
    const [isCompleteMode, setIsCompleteMode] = useState(false);
    const [activeTab, setActiveTab]         = useState('profile');

    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showBannerModal, setShowBannerModal] = useState(false);

    const [profile, setProfile] = useState({
        name: '', email: '', phone: '', bio: '', location: '', github: '', linkedin: '',
        avatar: '', banner: ''
    });
    const [skills, setSkills]   = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [education, setEducation] = useState([]);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '', email: user.email || '', phone: user.phone || '',
                bio: user.bio || '', location: user.location || '',
                github: user.github || '', linkedin: user.linkedin || '',
                avatar: user.avatar || '', banner: user.banner || '',
            });
            if (user.skills?.length > 0) setSkills(user.skills);
            if (user.education?.length > 0) setEducation(user.education);
            else setEducation([{ id: Date.now(), degree: '', institution: '', year: '', gpa: '' }]);

            let filledFields = 0;
            [user.phone, user.bio, user.location, user.github, user.linkedin,
             user.skills?.length > 0 ? true : '', user.education?.length > 0 ? true : ''
            ].forEach(f => { if (f && (typeof f === 'string' ? f.trim() !== '' : true)) filledFields++; });
            if (filledFields >= 5) setIsCompleteMode(true);
        }
    }, [user]);

    const handleChange = (f, v) => setProfile(p => ({ ...p, [f]: v }));
    const handleAvatarSelect = (url) => { setProfile(p => ({ ...p, avatar: url })); setShowAvatarModal(false); };
    const handleBannerSelect  = (url) => { setProfile(p => ({ ...p, banner: url })); setShowBannerModal(false); };

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(p => ({ ...p, [type === 'avatar' ? 'avatar' : 'banner']: reader.result }));
            type === 'avatar' ? setShowAvatarModal(false) : setShowBannerModal(false);
        };
        reader.readAsDataURL(file);
    };

    const addEducation    = () => setEducation([...education, { id: Date.now(), degree: '', institution: '', year: '', gpa: '' }]);
    const updateEducation = (id, field, value) => setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
    const removeEducation = (id) => setEducation(education.filter(e => e.id !== id));

    const addSkill    = (e) => { if (e.key === 'Enter' && newSkill.trim()) { e.preventDefault(); if (!skills.includes(newSkill.trim())) setSkills([...skills, newSkill.trim()]); setNewSkill(''); } };
    const removeSkill = (sk) => setSkills(skills.filter(s => s !== sk));

    const handleSaveProfile = async (e) => {
        if (e) e.preventDefault();
        setSaving(true); setError('');
        const wasWizard = !isCompleteMode;
        try {
            const updates = { ...profile, skills, education: education.filter(e => e.degree || e.institution) };
            const res = await fetch('/api/users/profile', {
                method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(updates),
            });
            if (res.ok) {
                updateUser(updates); setSaved(true); setTimeout(() => setSaved(false), 3000);
                if (wasWizard && typeof window !== 'undefined') {
                    localStorage.setItem('showWalkthroughAfterProfile', 'true');
                    router.push('/dashboard/student');
                }
            } else {
                const data = await res.json(); setError(data.error || 'Failed to save profile');
            }
        } catch {
            updateUser({ ...profile, skills, education }); setSaved(true); setTimeout(() => setSaved(false), 3000);
        }
        setSaving(false);
    };

    const handleSavePassword = (e) => {
        e.preventDefault(); setSaving(true);
        setTimeout(() => { setSaving(false); setSaved(true); setPasswords({ current: '', new: '', confirm: '' }); setTimeout(() => setSaved(false), 3000); }, 1200);
    };

    const nextStep = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };
    const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit:   { opacity: 0, x: -20, transition: { duration: 0.2 } }
    };

    const AvatarModal = ({ show, onClose }) => (
        <AnimatePresence>{show && (
            <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
                <motion.div className={styles.modal} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={e => e.stopPropagation()}>
                    <div className={styles.modalHead}>
                        <h2>Choose Avatar</h2>
                        <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={styles.uploadStrip}>
                            <div className={styles.uploadIcon}><Camera size={18} /></div>
                            <div><div className={styles.uploadLabel}>Upload Custom Photo</div><div className={styles.uploadSub}>JPG, PNG or SVG (Max 5MB)</div></div>
                            <button className={styles.uploadPickBtn} onClick={() => avatarInputRef.current.click()}>Choose File</button>
                        </div>
                        <div className={styles.avatarCat}><div className={styles.catLabel}>Male</div>
                            <div className={styles.avatarGrid}>
                                {maleAvatars.map((url, i) => <div key={i} className={`${styles.avatarThumb} ${profile.avatar === url ? styles.avatarSelected : ''}`} onClick={() => handleAvatarSelect(url)}><img src={url} alt="" /></div>)}
                            </div>
                        </div>
                        <div className={styles.avatarCat}><div className={styles.catLabel}>Female</div>
                            <div className={styles.avatarGrid}>
                                {femaleAvatars.map((url, i) => <div key={i} className={`${styles.avatarThumb} ${profile.avatar === url ? styles.avatarSelected : ''}`} onClick={() => handleAvatarSelect(url)}><img src={url} alt="" /></div>)}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}</AnimatePresence>
    );

    const BannerModal = ({ show, onClose }) => (
        <AnimatePresence>{show && (
            <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
                <motion.div className={styles.modal} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={e => e.stopPropagation()}>
                    <div className={styles.modalHead}>
                        <h2>Choose Banner</h2>
                        <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={styles.uploadStrip}>
                            <div className={styles.uploadIcon}><ImageIcon size={18} /></div>
                            <div><div className={styles.uploadLabel}>Upload Custom Banner</div><div className={styles.uploadSub}>JPG or PNG (Max 5MB)</div></div>
                            <button className={styles.uploadPickBtn} onClick={() => bannerInputRef.current.click()}>Choose File</button>
                        </div>
                        <div className={styles.bannerGrid}>
                            {bannerPresets.map((url, i) => <div key={i} className={`${styles.bannerThumb} ${profile.banner === url ? styles.avatarSelected : ''}`} onClick={() => handleBannerSelect(url)}><img src={url} alt="" /></div>)}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}</AnimatePresence>
    );

    /* ============================================================
       STANDARD MODE (profile already complete)
       ============================================================ */
    if (isCompleteMode) {
        return (
            <div className={styles.page}>
                <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                <input type="file" ref={bannerInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />

                <AnimatePresence>
                    {saved && (
                        <motion.div className={styles.toast} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <CheckCircle size={14} /> Settings updated successfully!
                        </motion.div>
                    )}
                </AnimatePresence>

                <AvatarModal show={showAvatarModal} onClose={() => setShowAvatarModal(false)} />
                <BannerModal show={showBannerModal} onClose={() => setShowBannerModal(false)} />

                {/* ── Page header ── */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Account Settings</h1>
                </div>

                {/* ── Body: sidebar + content ── */}
                <div className={styles.body}>
                    {/* Left nav */}
                    <aside className={styles.settingsSidebar}>
                        {/* mini profile */}
                        <div className={styles.sidebarProfile}>
                            <div className={styles.sidebarAvatarWrap} onClick={() => setShowAvatarModal(true)} title="Change photo">
                                <img
                                    src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6366f1&color=fff&size=80`}
                                    alt=""
                                    className={styles.sidebarAvatar}
                                />
                                <div className={styles.avatarOverlay}><Camera size={16} /></div>
                            </div>
                            <div className={styles.sidebarName}>{profile.name}</div>
                            <div className={styles.sidebarEmail}>{profile.email}</div>
                        </div>

                        <div className={styles.sidebarDivider} />

                        {SETTINGS_TABS.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    className={`${styles.sidebarTab} ${activeTab === tab.id ? styles.sidebarTabActive : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon size={15} /> {tab.label}
                                </button>
                            );
                        })}
                    </aside>

                    {/* Right content */}
                    <main className={styles.settingsContent}>
                        {activeTab === 'profile' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                {/* Banner */}
                                <div className={styles.bannerPicker} style={{ backgroundImage: profile.banner ? `url(${profile.banner})` : undefined }} onClick={() => setShowBannerModal(true)}>
                                    {!profile.banner && (
                                        <div className={styles.bannerPlaceholder}><ImageIcon size={20} /> <span>Click to choose banner</span></div>
                                    )}
                                    <div className={styles.bannerEditChip}><ImageIcon size={12} /> Change Banner</div>
                                </div>

                                <div className={styles.formSection}>
                                    <div className={styles.formSectionTitle}>Personal & Contact Information</div>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>Full Name</label>
                                            <input type="text" value={profile.name} onChange={e => handleChange('name', e.target.value)} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Location</label>
                                            <input type="text" value={profile.location} onChange={e => handleChange('location', e.target.value)} />
                                        </div>
                                        <div className={styles.formGroupFull}>
                                            <label>Professional Bio</label>
                                            <textarea value={profile.bio} onChange={e => handleChange('bio', e.target.value)} rows={3} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Phone Number</label>
                                            <input type="text" value={profile.phone} onChange={e => handleChange('phone', e.target.value)} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Email Address <span>(read-only)</span></label>
                                            <input type="email" value={profile.email} disabled className={styles.disabledInput} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>GitHub</label>
                                            <input type="text" value={profile.github} onChange={e => handleChange('github', e.target.value)} placeholder="github.com/username" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>LinkedIn</label>
                                            <input type="text" value={profile.linkedin} onChange={e => handleChange('linkedin', e.target.value)} placeholder="linkedin.com/in/username" />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.formSection}>
                                    <div className={styles.formSectionTitleRow}>
                                        <div className={styles.formSectionTitle}>Education History</div>
                                        <button type="button" className={styles.addEntryBtn} onClick={addEducation}><Plus size={13} /> Add Entry</button>
                                    </div>
                                    {education.map((edu) => (
                                        <div key={edu.id} className={styles.eduRow}>
                                            <div className={styles.eduRowFields}>
                                                <div className={styles.formGroup}><input type="text" placeholder="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                                                <div className={styles.formGroup}><input type="text" placeholder="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} /></div>
                                                <div className={styles.formGroup}><input type="text" placeholder="Year (e.g. 2021-2025)" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} /></div>
                                                <div className={styles.formGroup}><input type="text" placeholder="GPA / Percentage" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} /></div>
                                            </div>
                                            {education.length > 1 && (
                                                <button type="button" className={styles.removeBtn} onClick={() => removeEducation(edu.id)}><Trash2 size={14} /></button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.formSection}>
                                    <div className={styles.formSectionTitle}>Technical Skills</div>
                                    <div className={styles.skillInput}>
                                        <input
                                            type="text"
                                            placeholder="Type a skill and press Enter..."
                                            value={newSkill}
                                            onChange={e => setNewSkill(e.target.value)}
                                            onKeyDown={addSkill}
                                        />
                                    </div>
                                    <div className={styles.skillPills}>
                                        {skills.map(sk => (
                                            <span key={sk} className={styles.skillPill}>
                                                {sk} <button type="button" onClick={() => removeSkill(sk)}><X size={11} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {error && <p className={styles.errorMsg}>{error}</p>}
                                <div className={styles.formActions}>
                                    <button className={styles.saveBtn} onClick={handleSaveProfile} disabled={saving}>
                                        <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className={styles.formSection}>
                                    <div className={styles.formSectionTitle}>Change Password</div>
                                    <form onSubmit={handleSavePassword} className={styles.passwordForm}>
                                        <div className={styles.formGroup}>
                                            <label>Current Password</label>
                                            <div className={styles.inputWithIcon}>
                                                <Lock size={15} />
                                                <input type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" required />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>New Password</label>
                                            <div className={styles.inputWithIcon}>
                                                <Lock size={15} />
                                                <input type="password" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} placeholder="••••••••" required />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Confirm New Password</label>
                                            <div className={styles.inputWithIcon}>
                                                <Lock size={15} />
                                                <input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" required />
                                            </div>
                                        </div>
                                        {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
                                            <p className={styles.errorMsg}>Passwords do not match</p>
                                        )}
                                        <div className={styles.formActions}>
                                            <button type="submit" className={styles.saveBtn} disabled={saving || passwords.new !== passwords.confirm || !passwords.new}>
                                                <Shield size={15} /> {saving ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        );
    }

    /* ============================================================
       WIZARD MODE (first-time setup)
       ============================================================ */
    return (
        <div className={styles.page}>
            <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
            <input type="file" ref={bannerInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />

            <AnimatePresence>
                {saved && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <CheckCircle size={14} /> Profile updated successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <AvatarModal show={showAvatarModal} onClose={() => setShowAvatarModal(false)} />
            <BannerModal show={showBannerModal} onClose={() => setShowBannerModal(false)} />

            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Complete Your Profile</h1>
                <p className={styles.wizardSub}>Step {currentStep + 1} of {steps.length} — {steps[currentStep].label}</p>
            </div>

            <div className={styles.wizardBody}>
                <div className={styles.wizardContainer}>
                    {/* Stepper */}
                    <div className={styles.stepper}>
                        <div className={styles.stepTrack}><div className={styles.stepFill} style={{ '--progress': `${(currentStep / (steps.length - 1)) * 100}%` }} /></div>
                        {steps.map((step, idx) => {
                            const isActive    = currentStep === idx;
                            const isCompleted = currentStep > idx;
                            return (
                                <div key={step.id} className={`${styles.stepItem} ${isActive ? styles.stepActive : ''} ${isCompleted ? styles.stepDone : ''}`}>
                                    <div className={styles.stepCircle}>{isCompleted ? <CheckCircle size={14} /> : idx + 1}</div>
                                    <span className={styles.stepLabel}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Wizard card */}
                <motion.div layout className={styles.wizardCard}>
                    {/* Avatar / banner mini preview */}
                    <div className={styles.wizardBanner} style={{ backgroundImage: profile.banner ? `url(${profile.banner})` : undefined }} onClick={() => setShowBannerModal(true)}>
                        {!profile.banner && <div className={styles.bannerPlaceholder}><ImageIcon size={18} /><span>Click to add banner</span></div>}
                        <div className={styles.bannerEditChip}><ImageIcon size={12} /> Change</div>
                    </div>
                    <div className={styles.wizardAvatarRow}>
                        <div className={styles.wizardAvatarWrap} onClick={() => setShowAvatarModal(true)}>
                            <img
                                src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'U')}&background=6366f1&color=fff&size=80`}
                                alt=""
                                className={styles.wizardAvatar}
                            />
                            <div className={styles.wizardAvatarOverlay}><Camera size={13} /></div>
                        </div>
                    </div>

                    <form
                        className={styles.wizardForm}
                        onSubmit={(e) => { e.preventDefault(); if (currentStep === steps.length - 1) handleSaveProfile(); else nextStep(); }}
                    >
                        <AnimatePresence mode="wait">
                            {currentStep === 0 && (
                                <motion.div key="s0" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.wizardFormContent}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}><label>Full Name *</label><input type="text" value={profile.name} onChange={e => handleChange('name', e.target.value)} placeholder="John Doe" required /></div>
                                        <div className={styles.formGroup}><label>Location *</label><input type="text" value={profile.location} onChange={e => handleChange('location', e.target.value)} placeholder="New Delhi, India" required /></div>
                                        <div className={styles.formGroupFull}><label>Professional Bio *</label><textarea value={profile.bio} onChange={e => handleChange('bio', e.target.value)} placeholder="A brief description of your background and goals..." required rows={3} /></div>
                                    </div>
                                </motion.div>
                            )}
                            {currentStep === 1 && (
                                <motion.div key="s1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.wizardFormContent}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}><label>Email <span>(read-only)</span></label><input type="email" value={profile.email} disabled className={styles.disabledInput} /></div>
                                        <div className={styles.formGroup}><label>Phone *</label><input type="text" value={profile.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" required /></div>
                                        <div className={styles.formGroup}><label>GitHub *</label><input type="text" value={profile.github} onChange={e => handleChange('github', e.target.value)} placeholder="github.com/johndoe" required /></div>
                                        <div className={styles.formGroup}><label>LinkedIn *</label><input type="text" value={profile.linkedin} onChange={e => handleChange('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" required /></div>
                                    </div>
                                </motion.div>
                            )}
                            {currentStep === 2 && (
                                <motion.div key="s2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className={styles.wizardFormContent}>
                                    <div className={styles.formSectionTitleRow} style={{ marginBottom: 12 }}>
                                        <div className={styles.formSectionTitle}>Education</div>
                                        <button type="button" className={styles.addEntryBtn} onClick={addEducation}><Plus size={13} /> Add Entry</button>
                                    </div>
                                    {education.map((edu) => (
                                        <div key={edu.id} className={styles.eduRow}>
                                            <div className={styles.eduRowFields}>
                                                <div className={styles.formGroup}><input type="text" placeholder="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                                                <div className={styles.formGroup}><input type="text" placeholder="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} /></div>
                                                <div className={styles.formGroup}><input type="text" placeholder="Year (e.g. 2021-2025)" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} /></div>
                                                <div className={styles.formGroup}><input type="text" placeholder="GPA" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} /></div>
                                            </div>
                                            {education.length > 1 && <button type="button" className={styles.removeBtn} onClick={() => removeEducation(edu.id)}><Trash2 size={14} /></button>}
                                        </div>
                                    ))}
                                    <div className={styles.formSectionTitle} style={{ margin: '20px 0 10px' }}>Technical Skills</div>
                                    <div className={styles.skillInput}>
                                        <input type="text" placeholder="Type a skill and press Enter..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={addSkill} />
                                    </div>
                                    <div className={styles.skillPills}>
                                        {skills.map(sk => <span key={sk} className={styles.skillPill}>{sk}<button type="button" onClick={() => removeSkill(sk)}><X size={11} /></button></span>)}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className={styles.wizardActionRow}>
                            {currentStep > 0
                                ? <button type="button" className={styles.backBtn} onClick={prevStep}><ArrowLeft size={14} /> Back</button>
                                : <div />
                            }
                            {currentStep < steps.length - 1
                                ? <button type="submit" className={styles.nextBtn}>Next <ArrowRight size={14} /></button>
                                : <button type="button" className={styles.saveBtn} onClick={handleSaveProfile} disabled={saving}><Save size={14} /> {saving ? 'Finalizing...' : 'Save & Publish'}</button>
                            }
                        </div>
                    </form>
                </motion.div>
                </div>
            </div>
        </div>
    );
}
