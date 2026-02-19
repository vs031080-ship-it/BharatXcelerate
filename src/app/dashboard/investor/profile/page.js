'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Linkedin, Mail, Target, DollarSign, Calendar, ArrowRight, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from '../../account.module.css';

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'thesis', label: 'Thesis' },
];

const defaultFocusAreas = ['Deep Tech', 'AI/ML', 'AgriTech', 'HealthTech', 'Blockchain', 'EdTech'];

const recentInvestments = [
    { id: 1, title: 'AgriTech Drone Solution', domain: 'Agriculture', amount: '₹5,00,000', date: 'Dec 2025' },
    { id: 2, title: 'SkillSwap — Peer Learning', domain: 'EdTech', amount: '₹2,50,000', date: 'Jan 2026' },
    { id: 3, title: 'MedTrack Compliance App', domain: 'HealthTech', amount: '₹7,50,000', date: 'Oct 2025' },
    { id: 4, title: 'GreenChain Carbon NFTs', domain: 'Blockchain', amount: '₹3,00,000', date: 'Feb 2026' },
];

export default function InvestorProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const investorName = user?.name || 'Investor';
    const investorEmail = user?.email || 'investor@example.com';
    const investorBio = user?.bio || 'Experienced angel investor with a passion for deep tech and sustainability.';
    const investorLinkedin = user?.linkedin || 'linkedin.com/in/investor';
    const investorWebsite = user?.github || 'ventures.com';

    return (
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 className={styles.pageTitle}>{investorName}</h1>
                    <Link href="/dashboard/investor/settings" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8125rem' }}>Edit Profile</Link>
                </div>
                <p className={styles.pageSubtitle}>Angel Investor & Venture Partner</p>
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
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face" alt={investorName} className={styles.profileAvatar} />
                            <div>
                                <div className={styles.profileName}>{investorName}</div>
                                <div className={styles.profileId}>Investor</div>
                            </div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Contact</div>
                            <div className={styles.detailItem}><Mail size={14} /> <span>{investorEmail}</span></div>
                            <div className={styles.detailItem}><Linkedin size={14} /> <span>{investorLinkedin}</span></div>
                            <div className={styles.detailItem}><Globe size={14} /> <span>{investorWebsite}</span></div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Focus</div>
                            <div className={styles.detailItem}><Target size={14} /> <span>Pre-Seed, Seed</span></div>
                            <div className={styles.detailItem}><DollarSign size={14} /> <span>₹1L - ₹10L Check Size</span></div>
                        </div>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>About</div>
                            <p style={{ fontSize: '0.8125rem', color: '#475467', lineHeight: 1.6, margin: 0 }}>
                                {investorBio}
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={styles.profileRight}>
                        <div className={styles.profileRightTitle}>
                            Portfolio Summary
                        </div>
                        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#101828' }}>5</div>
                                <div style={{ fontSize: '0.75rem', color: '#98A2B3' }}>Investments</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#101828' }}>₹19.5L</div>
                                <div style={{ fontSize: '0.75rem', color: '#98A2B3' }}>Deployed</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#039855' }}>+18.5%</div>
                                <div style={{ fontSize: '0.75rem', color: '#98A2B3' }}>Avg ROI</div>
                            </div>
                        </div>

                        <div className={styles.profileRightTitle}>
                            Recent Investments
                        </div>
                        <table className={styles.infoTable}>
                            <thead>
                                <tr>
                                    <th>Startup</th>
                                    <th>Domain</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentInvestments.map(inv => (
                                    <tr key={inv.id}>
                                        <td style={{ fontWeight: 500 }}>{inv.title}</td>
                                        <td>{inv.domain}</td>
                                        <td><span className={styles.scoreBadge}><DollarSign size={12} fill="#6941C6" color="#6941C6" />{inv.amount}</span></td>
                                        <td style={{ color: '#98A2B3' }}>{inv.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Focus Sectors</div>
                            <div className={styles.skillTags}>
                                {defaultFocusAreas.map(s => <span key={s} className={styles.skill}>{s}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
                <div style={{ paddingTop: 24 }}>
                    <table className={styles.infoTable}>
                        <thead>
                            <tr>
                                <th>Startup</th>
                                <th>Domain</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentInvestments.map(inv => (
                                <tr key={inv.id}>
                                    <td style={{ fontWeight: 500 }}>{inv.title}</td>
                                    <td>{inv.domain}</td>
                                    <td>{inv.amount}</td>
                                    <td><button className={styles.viewAllLink} style={{ marginTop: 0 }}>View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
