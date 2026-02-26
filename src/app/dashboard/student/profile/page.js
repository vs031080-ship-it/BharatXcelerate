'use client';
import { useState } from 'react';
import {
    MapPin, Phone, Mail, Github, Linkedin,
    Calendar, Star, GraduationCap, Code2, Edit,
    User, BookOpen, Layers
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './profile.module.css';

const NAV_TABS = [
    { id: 'overview',  label: 'Overview' },
    { id: 'education', label: 'Education' },
    { id: 'skills',    label: 'Skills'    },
];

const defaultSkills = ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'GraphQL'];

export default function StudentProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const userName    = user?.name     || 'Your Name';
    const userEmail   = user?.email    || 'email@example.com';
    const userPhone   = user?.phone    || 'Not provided';
    const userBio     = user?.bio      || 'Add a short bio about yourself to help companies understand you better.';
    const userLocation= user?.location || 'Not provided';
    const userGithub  = user?.github   || '';
    const userLinkedin= user?.linkedin || '';
    const userSkills  = user?.skills?.length > 0 ? user.skills : defaultSkills;
    const education   = user?.education?.length > 0 ? user.education : [
        { degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2021 - 2025', gpa: '9.2 / 10' }
    ];

    const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className={styles.page}>
            {/* ── Page header ── */}
            <div className={styles.pageHeader}>
                <div className={styles.pageHeaderLeft}>
                    <h1 className={styles.pageTitle}>Profile</h1>
                </div>
                <Link href="/dashboard/student/settings" className={styles.editBtn}>
                    <Edit size={15} /> Edit Profile
                </Link>
            </div>

            {/* ── Tab bar (inspired by reference) ── */}
            <div className={styles.tabBar}>
                {NAV_TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Profile card: banner + sidebar + content all wrapped ── */}
            <div className={styles.profileCard}>

                {/* Banner */}
                <div
                    className={styles.bannerArea}
                    style={{
                        backgroundImage: user?.banner
                            ? `url(${user.banner})`
                            : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)'
                    }}
                />

                {/* 2-column: sidebar overlaps banner with negative margin */}
                <div className={styles.body}>

                {/* ── Left: Identity card ── */}
                <aside className={styles.identityCard}>
                    {/* Avatar — lifts up over the banner */}
                    <div className={styles.avatarBlock}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt={userName} className={styles.avatarImg} />
                        ) : (
                            <div className={styles.avatarInitials}>{initials}</div>
                        )}
                    </div>

                    <h2 className={styles.idName}>{userName}</h2>
                    <p className={styles.idRole}>Student Developer</p>

                    <div className={styles.divider} />

                    {/* About section */}
                    <div className={styles.idSection}>
                        <div className={styles.idSectionTitle}>About</div>
                        <div className={styles.idRow}><Phone size={13} /><span>{userPhone}</span></div>
                        <div className={styles.idRow}><Mail size={13} /><span>{userEmail}</span></div>
                        {userLocation !== 'Not provided' && (
                            <div className={styles.idRow}><MapPin size={13} /><span>{userLocation}</span></div>
                        )}
                    </div>

                    <div className={styles.divider} />

                    {/* Links */}
                    <div className={styles.idSection}>
                        <div className={styles.idSectionTitle}>Links</div>
                        {userGithub ? (
                            <a href={`https://${userGithub.replace('https://', '')}`} target="_blank" rel="noreferrer" className={styles.idLink}>
                                <Github size={13} /> {userGithub.replace('https://github.com/', 'github.com/')}
                            </a>
                        ) : <div className={styles.idMuted}><Github size={13} /> Not provided</div>}
                        {userLinkedin ? (
                            <a href={`https://${userLinkedin.replace('https://', '')}`} target="_blank" rel="noreferrer" className={styles.idLink}>
                                <Linkedin size={13} /> {userLinkedin.replace('https://linkedin.com/in/', 'linkedin/')}
                            </a>
                        ) : <div className={styles.idMuted}><Linkedin size={13} /> Not provided</div>}
                    </div>
                </aside>

                {/* ── Right: Tab content ── */}
                <main className={styles.contentArea}>
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div>
                            {/* Bio */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <User size={15} />
                                    <h3>Personal Information</h3>
                                </div>
                                <div className={styles.infoTable}>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>Full Name</div>
                                        <div className={styles.infoValue}>{userName}</div>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>Email</div>
                                        <div className={styles.infoValue}>{userEmail}</div>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>Phone</div>
                                        <div className={styles.infoValue}>{userPhone}</div>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>Location</div>
                                        <div className={styles.infoValue}>{userLocation}</div>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>GitHub</div>
                                        <div className={styles.infoValue}>
                                            {userGithub
                                                ? <a href={`https://${userGithub.replace('https://', '')}`} target="_blank" rel="noreferrer" className={styles.linkText}>{userGithub}</a>
                                                : <span className={styles.muted}>Not provided</span>}
                                        </div>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>LinkedIn</div>
                                        <div className={styles.infoValue}>
                                            {userLinkedin
                                                ? <a href={`https://${userLinkedin.replace('https://', '')}`} target="_blank" rel="noreferrer" className={styles.linkText}>{userLinkedin}</a>
                                                : <span className={styles.muted}>Not provided</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio box */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <BookOpen size={15} />
                                    <h3>Bio</h3>
                                </div>
                                <p className={styles.bioText}>{userBio}</p>
                            </div>

                            {/* Quick skills preview */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <Layers size={15} />
                                    <h3>Skills</h3>
                                    <button className={styles.viewMoreLink} onClick={() => setActiveTab('skills')}>
                                        View all →
                                    </button>
                                </div>
                                <div className={styles.skillPillsRow}>
                                    {userSkills.slice(0, 6).map((s, i) => (
                                        <span key={i} className={styles.skillPill}>{s}</span>
                                    ))}
                                    {userSkills.length > 6 && (
                                        <span className={styles.skillMore}>+{userSkills.length - 6} more</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EDUCATION TAB */}
                    {activeTab === 'education' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <GraduationCap size={15} />
                                <h3>Education History</h3>
                            </div>
                            <div className={styles.eduList}>
                                {education.map((edu, i) => (
                                    <div key={i} className={styles.eduCard}>
                                        <div className={styles.eduIcon}>
                                            <GraduationCap size={22} color="#4F46E5" />
                                        </div>
                                        <div className={styles.eduInfo}>
                                            <div className={styles.eduDegree}>{edu.degree || 'Degree Title'}</div>
                                            <div className={styles.eduInstitution}>{edu.institution || 'Institution Name'}</div>
                                            <div className={styles.eduMeta}>
                                                <span className={styles.eduChip}><Calendar size={11} /> {edu.year || 'Year'}</span>
                                                {edu.gpa && <span className={styles.eduChip}><Star size={11} /> GPA: {edu.gpa}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SKILLS TAB */}
                    {activeTab === 'skills' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Code2 size={15} />
                                <h3>Technical Skills</h3>
                            </div>
                            <div className={styles.skillsGrid}>
                                {userSkills.map((s, i) => (
                                    <div key={i} className={styles.skillCard}>
                                        <div className={styles.skillCardIcon}>{s.charAt(0)}</div>
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>{/* end .body */}
            </div>{/* end .profileCard */}
        </div>
    );
}
