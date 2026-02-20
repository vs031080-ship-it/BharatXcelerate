'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Github, Linkedin, Globe, Calendar, Star, ArrowRight, Briefcase, GraduationCap, Code2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from '../../account.module.css';

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
];

const defaultSkills = ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'GraphQL', 'Redis', 'Kubernetes'];

const education = [
    { degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2021 - 2025', gpa: '9.2 / 10' },
    { degree: 'Class XII — CBSE', institution: 'Delhi Public School, RK Puram', year: '2019 - 2021', gpa: '96.4%' },
];

const projects = [
    { id: 1, title: 'E-Commerce Platform', domain: 'Full Stack', score: 920, status: 'Completed', date: 'Jan 2025' },
    { id: 2, title: 'AI Resume Screener', domain: 'AI/ML', score: 880, status: 'Completed', date: 'Nov 2024' },
    { id: 3, title: 'DeFi Lending Protocol', domain: 'Blockchain', score: 840, status: 'Completed', date: 'Sep 2024' },
];

export default function StudentProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const userName = user?.name || 'Student';
    const userEmail = user?.email || 'student@example.com';
    const userPhone = user?.phone || '—';
    const userBio = user?.bio || 'No bio provided yet.';
    const userLocation = user?.location || '—';
    const userGithub = user?.github || '—';
    const userLinkedin = user?.linkedin || '—';
    const userSkills = user?.skills?.length > 0 ? user.skills : [];

    // New fields
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : userName;
    const occupation = user?.occupation || 'Student';
    const fatherName = user?.fatherName || '—';
    const motherName = user?.motherName || '—';
    const dob = user?.dob || '—';
    const gender = user?.gender || '—';
    const religion = user?.religion || '—';
    const admissionDate = user?.admissionDate || '—';
    const studentClass = user?.class || '—';
    const roll = user?.roll || '—';
    const studentId = user?.studentId || '—';
    const civilStatus = user?.civilStatus || '—';
    const subject = user?.subject || '—';
    const address = user?.address || '—';

    return (
        <div className={styles.container} style={{ maxWidth: '1200px' }}>
            {/* Page Header */}
            <div className={styles.pageHeader} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className={styles.pageTitle}>Admin Dashboard</h1>
                        <p className={styles.pageSubtitle} style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                            <span style={{ color: '#98A2B3' }}>Home</span>
                            <span style={{ color: '#98A2B3' }}>{'>'}</span>
                            <span style={{ color: '#6941C6' }}>Student About</span>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div className={styles.scoreBadge} style={{ background: '#F2F4F7', color: '#475467' }}>Notification - (20)</div>
                        <div className={styles.scoreBadge} style={{ background: '#F2F4F7', color: '#475467' }}>Events - (20)</div>
                        <div className={styles.scoreBadge} style={{ background: '#E0F2FE', color: '#026AA2' }}>Attendance - (98%)</div>
                    </div>
                </div>
            </div>

            {/* Profile Card Ref Design */}
            <div className={styles.card} style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                {/* Banner */}
                <div style={{ height: '160px', background: 'linear-gradient(90deg, #F9FAFB 0%, #EFF8FF 100%)', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '40px', bottom: '-40px' }}>
                        {/* Decorative circles from ref image */}
                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.1 }}>
                            <circle cx="100" cy="100" r="80" stroke="#6941C6" strokeWidth="40" />
                            <circle cx="130" cy="100" r="60" stroke="#7F56D9" strokeWidth="20" />
                        </svg>
                    </div>
                </div>

                <div style={{ padding: '0 40px 40px', marginTop: '-60px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '24px' }}>
                        <img
                            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face"}
                            alt={fullName}
                            style={{ width: '150px', height: '150px', borderRadius: '50%', border: '8px solid white', background: '#F2F4F7', objectFit: 'cover' }}
                        />
                        <div style={{ paddingBottom: '16px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#101828', marginBottom: '4px' }}>{fullName}</h2>
                            <p style={{ fontSize: '0.875rem', color: '#667085', maxWidth: '600px', lineHeight: '1.5' }}>
                                {userBio}
                            </p>
                            <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667085', fontSize: '0.8125rem' }}>
                                    <MapPin size={14} color="#F79009" /> {userLocation}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667085', fontSize: '0.8125rem' }}>
                                    <Phone size={14} color="#F79009" /> {userPhone}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667085', fontSize: '0.8125rem' }}>
                                    <Mail size={14} color="#F79009" /> {userEmail}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #EAECF0', paddingTop: '32px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px 60px' }}>
                            <DetailRow label="First Name" value={firstName || '—'} />
                            <DetailRow label="Last Name" value={lastName || '—'} />
                            <DetailRow label="Occupation" value={occupation} />

                            <DetailRow label="Father Name" value={fatherName} />
                            <DetailRow label="Mother Name" value={motherName} />
                            <DetailRow label="Date Of Birth" value={dob} icon={<Calendar size={14} color="#667085" />} />

                            <DetailRow label="Gender" value={gender} />
                            <DetailRow label="Religion" value={religion} />
                            <DetailRow label="Admission Date" value={admissionDate} icon={<Calendar size={14} color="#667085" />} />

                            <DetailRow label="Roll" value={roll} />
                            <DetailRow label="Class" value={studentClass} />
                            <DetailRow label="Student ID" value={studentId} />

                            <DetailRow label="Civil Status" value={civilStatus} />
                            <DetailRow label="Subject" value={subject} />
                            <DetailRow label="Address" value={address} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, icon }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
            <span style={{ fontSize: '1rem', fontWeight: '600', color: '#101828' }}>{label}</span>
            <div style={{
                background: '#F9FAFB',
                border: '1px solid #EAECF0',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '0.875rem',
                color: '#475467',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '45px'
            }}>
                {value}
                {icon}
            </div>
        </div>
    );
}

{/* Projects Tab */ }
{
    activeTab === 'projects' && (
        <div style={{ paddingTop: 24 }}>
            <table className={styles.infoTable}>
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Domain</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(proj => (
                        <tr key={proj.id}>
                            <td style={{ fontWeight: 500 }}>{proj.title}</td>
                            <td>{proj.domain}</td>
                            <td><span className={styles.scoreBadge}><Star size={12} fill="#6941C6" color="#6941C6" />{proj.score}</span></td>
                            <td><span style={{ color: '#039855' }}>{proj.status}</span></td>
                            <td style={{ color: '#98A2B3' }}>{proj.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

{/* Skills Tab */ }
{
    activeTab === 'skills' && (
        <div style={{ paddingTop: 24 }}>
            <div className={styles.card}>
                <h3>Technical Skills</h3>
                <div className={styles.skillTags}>
                    {userSkills.map(s => <span key={s} className={styles.skill}>{s}</span>)}
                </div>
            </div>
        </div>
    )
}

{/* Education Tab */ }
{
    activeTab === 'education' && (
        <div style={{ paddingTop: 24 }}>
            {education.map((edu, i) => (
                <div key={i} className={styles.card} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F9F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <GraduationCap size={20} color="#6941C6" />
                    </div>
                    <div>
                        <h3 style={{ marginBottom: 2 }}>{edu.degree}</h3>
                        <p style={{ fontSize: '0.75rem', color: '#98A2B3', margin: '4px 0 0' }}>{edu.year} · GPA: {edu.gpa}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

{
    activeTab === 'projects' && (
        <div style={{ paddingTop: 24 }}>
            <div className={styles.profileRightTitle}>Completed Projects</div>
            <table className={styles.infoTable}>
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Domain</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(proj => (
                        <tr key={proj.id}>
                            <td style={{ fontWeight: 500 }}>{proj.title}</td>
                            <td>{proj.domain}</td>
                            <td><span className={styles.scoreBadge}><Star size={12} fill="#6941C6" color="#6941C6" />{proj.score}</span></td>
                            <td style={{ color: '#98A2B3' }}>{proj.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
</div >
    );
}
