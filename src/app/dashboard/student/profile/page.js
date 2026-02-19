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
    const userPhone = user?.phone || '+91 98765 43210';
    const userBio = user?.bio || 'Passionate about building products that solve real-world problems.';
    const userLocation = user?.location || 'New Delhi, India';
    const userGithub = user?.github || 'github.com/arjunsharma';
    const userLinkedin = user?.linkedin || 'linkedin.com/in/arjunsharma';
    const userSkills = user?.skills?.length > 0 ? user.skills : defaultSkills;

    const activity = [
        { name: userName, action: 'completed E-Commerce Platform project', time: 'Jan 15, 2025 · 3:40 PM' },
        { name: userName, action: 'updated profile skills', time: 'Jan 10, 2025 · 11:20 AM' },
        { name: userName, action: 'submitted AI Resume Screener', time: 'Nov 22, 2024 · 5:36 PM' },
    ];

    return (
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 className={styles.pageTitle}>Profile</h1>
                    <Link href="/dashboard/student/settings" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8125rem' }}>Edit Profile</Link>
                </div>
            </div>

            {/* Tab Bar */}
            <div className={styles.tabBar}>
                {tabs.map(tab => (
                    <button key={tab.id} className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab — Two column layout */}
            {activeTab === 'overview' && (
                <div className={styles.profileGrid}>
                    {/* Left Column — Personal Details */}
                    <div className={styles.profileLeft}>
                        <div className={styles.profileIdentity}>
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face" alt={userName} className={styles.profileAvatar} />
                            <div>
                                <div className={styles.profileName}>{userName}</div>
                                <div className={styles.profileId}>Full Stack Developer & AI Enthusiast</div>
                            </div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>About</div>
                            <div className={styles.detailItem}><Phone size={14} /> <span>{userPhone}</span></div>
                            <div className={styles.detailItem}><Mail size={14} /> <span>{userEmail}</span></div>
                            <div className={styles.detailItem}><Globe size={14} /> <span>{userGithub}</span></div>
                            <div className={styles.detailItem}><Linkedin size={14} /> <span>{userLinkedin}</span></div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Address</div>
                            <div className={styles.detailItem}><MapPin size={14} /> <span>{userLocation}</span></div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Scorecard</div>
                            <div className={styles.detailItem}>
                                <Star size={14} />
                                <span className={styles.detailLabel}>Score:</span>
                                <span className={styles.detailValue}>850 / 1000</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Code2 size={14} />
                                <span className={styles.detailLabel}>Execution:</span>
                                <span className={styles.detailValue}>90%</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Code2 size={14} />
                                <span className={styles.detailLabel}>Code Quality:</span>
                                <span className={styles.detailValue}>80%</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Code2 size={14} />
                                <span className={styles.detailLabel}>Innovation:</span>
                                <span className={styles.detailValue}>88%</span>
                            </div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Bio</div>
                            <p style={{ fontSize: '0.8125rem', color: '#475467', lineHeight: 1.6, margin: 0 }}>
                                {userBio}
                            </p>
                        </div>
                    </div>

                    {/* Right Column — Projects & Activity */}
                    <div className={styles.profileRight}>
                        <div className={styles.profileRightTitle}>
                            Completed Projects
                        </div>
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

                        <div className={styles.profileColumns}>
                            <div>
                                <div className={styles.profileColTitle}>Activity</div>
                                {activity.map((item, i) => (
                                    <div key={i} className={styles.activityItem}>
                                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face" alt="" className={styles.activityAvatar} />
                                        <div className={styles.activityText}>
                                            <strong>{item.name}</strong> {item.action}
                                            <span>{item.time}</span>
                                        </div>
                                    </div>
                                ))}
                                <span className={styles.viewAllLink}>View all</span>
                            </div>
                            <div>
                                <div className={styles.profileColTitle}>Skills</div>
                                <div className={styles.skillTags}>
                                    {userSkills.map(s => <span key={s} className={styles.skill}>{s}</span>)}
                                </div>
                                <div style={{ marginTop: 20 }}>
                                    <div className={styles.profileColTitle}>Education</div>
                                    {education.map((edu, i) => (
                                        <div key={i} className={styles.activityItem}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F9F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <GraduationCap size={16} color="#6941C6" />
                                            </div>
                                            <div className={styles.activityText}>
                                                <strong>{edu.degree}</strong>
                                                <span>{edu.institution} · {edu.year} · GPA: {edu.gpa}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
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
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <div style={{ paddingTop: 24 }}>
                    <div className={styles.card}>
                        <h3>Technical Skills</h3>
                        <div className={styles.skillTags}>
                            {userSkills.map(s => <span key={s} className={styles.skill}>{s}</span>)}
                        </div>
                    </div>
                </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
                <div style={{ paddingTop: 24 }}>
                    {education.map((edu, i) => (
                        <div key={i} className={styles.card} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F9F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <GraduationCap size={20} color="#6941C6" />
                            </div>
                            <div>
                                <h3 style={{ marginBottom: 2 }}>{edu.degree}</h3>
                                <p style={{ fontSize: '0.8125rem', color: '#475467', margin: 0 }}>{edu.institution}</p>
                                <p style={{ fontSize: '0.75rem', color: '#98A2B3', margin: '4px 0 0' }}>{edu.year} · GPA: {edu.gpa}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
