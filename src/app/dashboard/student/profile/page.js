'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, Github, Linkedin, Globe, Calendar, Star, ArrowRight, Briefcase, GraduationCap, Code2, Edit } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from '../settings/settingsUI.module.css';

const defaultSkills = ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'GraphQL'];

export default function StudentProfilePage() {
    const { user } = useAuth();

    // Fallbacks
    const userName = user?.name || 'Your Name';
    const userEmail = user?.email || 'email@example.com';
    const userPhone = user?.phone || 'Not provided';
    const userBio = user?.bio || 'Add a short bio about yourself to help companies understand you better.';
    const userLocation = user?.location || 'Not provided';
    const userGithub = user?.github || 'Not provided';
    const userLinkedin = user?.linkedin || 'Not provided';
    const userSkills = user?.skills?.length > 0 ? user.skills : defaultSkills;

    const education = user?.education?.length > 0 ? user.education : [
        { degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2021 - 2025', gpa: '9.2 / 10' }
    ];

    return (
        <div className={styles.appContainer}>
            <div className={styles.headerArea} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className={styles.pageTitle}>Student Profile</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href="/dashboard/student/settings" style={{ padding: '8px 16px', background: '#f1f5f9', color: '#0f172a', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Code2 size={16} /> Portfolio
                    </Link>
                    <Link href="/dashboard/student/settings" className={styles.saveBtn} style={{ textDecoration: 'none', background: '#e2e8f0', color: '#0f172a', boxShadow: 'none' }}>
                        <Edit size={16} /> Edit Profile
                    </Link>
                </div>
            </div>

            <div className={styles.cardContainer}>
                {/* Banner & Avatar (Clean Look) */}
                <div
                    className={styles.coverBanner}
                    style={{
                        height: '140px',
                        background: user?.banner ? `url(${user.banner})` : 'linear-gradient(to right, #f8fafc, #e2e8f0)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderBottom: '1px solid #cbd5e1'
                    }}
                >
                    {!user?.banner && (
                        <>
                            <div style={{ position: 'absolute', right: '40px', bottom: '-40px', width: '200px', height: '200px', borderRadius: '50%', border: '4px solid rgba(226, 232, 240, 0.4)' }}></div>
                            <div style={{ position: 'absolute', right: '120px', bottom: '-20px', width: '150px', height: '150px', borderRadius: '50%', border: '4px solid rgba(241, 245, 249, 0.6)' }}></div>
                        </>
                    )}
                </div>

                <div className={styles.profileHeaderContent} style={{ marginTop: '-60px' }}>
                    <div className={styles.avatarWrapper} style={{ width: '120px', height: '120px', border: '6px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <img
                            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face"}
                            alt={userName}
                            className={styles.avatar}
                        />
                    </div>
                    <div className={styles.headerInfo} style={{ marginTop: '72px', paddingBottom: '24px' }}>
                        <h1 className={styles.userName} style={{ fontSize: '1.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {userName}
                            <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#f1f5f9', color: '#475467', borderRadius: '20px', fontWeight: 600 }}>Student Developer</span>
                        </h1>
                        <p className={styles.userBioText} style={{ color: '#475467', maxWidth: '800px', marginBottom: '16px' }}>{userBio}</p>

                        <div className={styles.headerContact} style={{ gap: '24px' }}>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}><MapPin size={16} color="#94a3b8" /> {userLocation}</span>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}><Phone size={16} color="#94a3b8" /> {userPhone}</span>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}><Mail size={16} color="#94a3b8" /> {userEmail}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div style={{ padding: '0 32px 32px 32px' }}>

                    {/* Data Grid matching screenshot */}
                    <div className={styles.infoGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        <div className={styles.infoCard} style={{ gridColumn: 'span 2' }}>
                            <div className={styles.infoCardLabel} style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none' }}>Full Name</div>
                            <div className={styles.infoCardValue} style={{ color: '#64748b', fontSize: '0.9rem' }}>{userName}</div>
                        </div>
                        <div className={styles.infoCard} style={{ gridColumn: 'span 2' }}>
                            <div className={styles.infoCardLabel} style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none' }}>Email Address</div>
                            <div className={styles.infoCardValue} style={{ color: '#64748b', fontSize: '0.9rem' }}>{userEmail}</div>
                        </div>

                        <div className={styles.infoCard} style={{ gridColumn: 'span 2' }}>
                            <div className={styles.infoCardLabel} style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none' }}>Phone Number</div>
                            <div className={styles.infoCardValue} style={{ color: '#64748b', fontSize: '0.9rem' }}>{userPhone}</div>
                        </div>
                        <div className={styles.infoCard} style={{ gridColumn: 'span 2' }}>
                            <div className={styles.infoCardLabel} style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none' }}>Current Location</div>
                            <div className={styles.infoCardValue} style={{ color: '#64748b', fontSize: '0.9rem' }}>{userLocation}</div>
                        </div>

                        <div className={styles.infoCard} style={{ gridColumn: 'span 2' }}>
                            <div className={styles.infoCardLabel} style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none' }}>GitHub Profile</div>
                            <div className={styles.infoCardValue} style={{ fontSize: '0.9rem' }}>
                                {userGithub !== 'Not provided' ? <a href={`https://${userGithub.replace('https://', '')}`} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>{userGithub}</a> : <span style={{ color: '#64748b' }}>Not provided</span>}
                            </div>
                        </div>
                        <div className={styles.infoCard} style={{ gridColumn: 'span 2' }}>
                            <div className={styles.infoCardLabel} style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none' }}>LinkedIn Profile</div>
                            <div className={styles.infoCardValue} style={{ fontSize: '0.9rem' }}>
                                {userLinkedin !== 'Not provided' ? <a href={`https://${userLinkedin.replace('https://', '')}`} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>{userLinkedin}</a> : <span style={{ color: '#64748b' }}>Not provided</span>}
                            </div>
                        </div>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.sectionDivider} style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600 }}>Technical Skills</h3>
                    </div>
                    <div className={styles.skillsContainer}>
                        <div className={styles.skillTags}>
                            {userSkills.map((s, idx) => (
                                <span key={idx} className={styles.skillBadge} style={{ padding: '6px 16px', background: '#f8fafc', color: '#475467', borderColor: '#e2e8f0', borderRadius: '4px', fontWeight: 500 }}>{s}</span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.divider} style={{ margin: '32px 0' }}></div>

                    <div className={styles.sectionDivider} style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600 }}>Education Journey</h3>
                    </div>

                    <div>
                        {education.map((edu, i) => (
                            <div key={i} className={styles.eduDisplayCard} style={{ padding: '24px', alignItems: 'center' }}>
                                <div className={styles.eduIcon} style={{ background: '#f1f5f9', width: '56px', height: '56px' }}>
                                    <GraduationCap size={28} color="#64748b" />
                                </div>
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>{edu.degree || 'Degree Title'}</h4>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#64748b' }}>{edu.institution || 'Institution Name'}</p>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#475467', fontWeight: '600', background: '#f8fafc', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                            <Star size={14} fill="#cbd5e1" color="#cbd5e1" /> GPA: {edu.gpa || 'N/A'}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#475467', fontWeight: '500', background: '#f1f5f9', padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                        <Calendar size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                                        {edu.year || 'YYYY - YYYY'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
