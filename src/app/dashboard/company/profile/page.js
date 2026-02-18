'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Globe, Linkedin, Mail, ExternalLink, Calendar, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import styles from '../../account.module.css';

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'jobs', label: 'Open Roles' },
    { id: 'culture', label: 'Culture & Benefits' },
    { id: 'team', label: 'Team' },
];

const openRoles = [
    { id: 1, title: 'Senior Full Stack Developer', type: 'Full-time', location: 'Mumbai', applicants: 24, posted: 'Feb 10, 2026' },
    { id: 2, title: 'Data Science Intern', type: 'Internship', location: 'Remote', applicants: 67, posted: 'Feb 5, 2026' },
    { id: 3, title: 'Blockchain Developer', type: 'Contract', location: 'Bangalore', applicants: 12, posted: 'Jan 28, 2026' },
];

const hiringStats = [
    { label: 'Total Hires', value: '12' },
    { label: 'Active Jobs', value: '3' },
    { label: 'Interviews', value: '8' },
];

export default function CompanyProfilePage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 className={styles.pageTitle}>TechNova Solutions</h1>
                    <Link href="/dashboard/company/settings" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8125rem' }}>Edit Profile</Link>
                </div>
                <p className={styles.pageSubtitle}>Enterprise Software & AI Solutions</p>
            </div>

            {/* Tab Bar */}
            <div className={styles.tabBar}>
                {tabs.map(tab => (
                    <button key={tab.id} className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className={styles.profileGrid}>
                    {/* Left Column */}
                    <div className={styles.profileLeft}>
                        <div className={styles.profileIdentity}>
                            <div style={{ width: 64, height: 64, borderRadius: '12px', background: 'linear-gradient(135deg, #10B981, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Building2 size={28} color="white" />
                            </div>
                            <div>
                                <div className={styles.profileName}>TechNova</div>
                                <div className={styles.profileId}>Est. 2018</div>
                            </div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Contact</div>
                            <div className={styles.detailItem}><Globe size={14} /> <span>technova.com</span></div>
                            <div className={styles.detailItem}><Mail size={14} /> <span>careers@technova.com</span></div>
                            <div className={styles.detailItem}><Linkedin size={14} /> <span>linkedin.com/company/technova</span></div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Headquarters</div>
                            <div className={styles.detailItem}><MapPin size={14} /> <span>Mumbai, Maharashtra</span></div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>About</div>
                            <p style={{ fontSize: '0.8125rem', color: '#475467', lineHeight: 1.6, margin: 0 }}>
                                TechNova Solutions is a leading enterprise software company specializing in AI-driven automation, cloud infrastructure, and digital transformation. With a team of 200+ engineers.
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={styles.profileRight}>
                        <div className={styles.profileRightTitle}>
                            Hiring Performance
                        </div>
                        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                            {hiringStats.map(stat => (
                                <div key={stat.label}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#101828' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#98A2B3' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.profileRightTitle}>
                            Open Roles
                        </div>
                        <table className={styles.infoTable}>
                            <thead>
                                <tr>
                                    <th>Role Title</th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Applicants</th>
                                    <th>Posted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {openRoles.map(role => (
                                    <tr key={role.id}>
                                        <td style={{ fontWeight: 500 }}>{role.title}</td>
                                        <td><span className={styles.skill}>{role.type}</span></td>
                                        <td>{role.location}</td>
                                        <td><span className={styles.scoreBadge}><Users size={12} fill="#6941C6" color="#6941C6" />{role.applicants}</span></td>
                                        <td style={{ color: '#98A2B3' }}>{role.posted}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Tech Stack</div>
                            <div className={styles.skillTags}>
                                {['React', 'Python', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'GraphQL', 'TensorFlow'].map(s => (
                                    <span key={s} className={styles.skill}>{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
                <div style={{ paddingTop: 24 }}>
                    <table className={styles.infoTable}>
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Applicants</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {openRoles.map(role => (
                                <tr key={role.id}>
                                    <td style={{ fontWeight: 500 }}>{role.title}</td>
                                    <td><span className={styles.skill}>{role.type}</span></td>
                                    <td>{role.location}</td>
                                    <td>{role.applicants} applicants</td>
                                    <td><button className={styles.viewAllLink} style={{ marginTop: 0 }}>Manage</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
