'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowRight, Clock, Star, Briefcase, BarChart3, X } from 'lucide-react';
import styles from './portfolio.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const investments = [
    { id: 1, title: 'AgriTech Drone Solution', student: 'Rohan Gupta', domain: 'Agriculture', stage: 'Seed', invested: '₹5,00,000', roi: '+22%', roiPositive: true, date: 'Dec 2025', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop', description: 'AI-powered drones for precision agriculture and crop monitoring.', equity: '2%', valuation: '₹2.5 Cr' },
    { id: 2, title: 'SkillSwap — Peer Learning', student: 'Priya Sharma', domain: 'EdTech', stage: 'Pre-Seed', invested: '₹2,50,000', roi: '+15%', roiPositive: true, date: 'Jan 2026', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop', description: 'P2P skill exchange platform for college students.', equity: '1.5%', valuation: '₹1.6 Cr' },
    { id: 3, title: 'MedTrack Compliance App', student: 'Amit Patel', domain: 'HealthTech', stage: 'Seed', invested: '₹7,50,000', roi: '+35%', roiPositive: true, date: 'Oct 2025', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop', description: 'HIPAA compliant tracking for medical supply chains.', equity: '3%', valuation: '₹3.0 Cr' },
];

export default function PortfolioPage() {
    const [period, setPeriod] = useState('6M');
    const [selectedInvestment, setSelectedInvestment] = useState(null);

    // Mock chart data switch based on period
    const chartData = {
        '6M': [40, 55, 45, 70, 65, 82],
        '1Y': [30, 45, 40, 55, 60, 75, 65, 80, 85, 90, 88, 95],
        'All': [20, 35, 50, 45, 60, 55, 70, 85, 80, 95, 100, 110],
    };

    const currentData = chartData[period] || chartData['6M'];

    return (
        <div className={styles.container}>
            {/* Banner */}
            <motion.div className={styles.banner} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1>My Portfolio 💰</h1>
                    <p>Track and manage your investment portfolio across student ventures.</p>
                </div>
            </motion.div>

            {/* Stats */}
            <div className={styles.statsRow}>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <div className={styles.statIcon} style={{ background: '#D1FAE5', color: '#059669' }}><DollarSign size={22} /></div>
                    <div>
                        <span className={styles.statValue}>₹15,00,000</span>
                        <span className={styles.statLabel}>Total Invested</span>
                    </div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#2563EB' }}><TrendingUp size={22} /></div>
                    <div>
                        <span className={styles.statValue}>+24%</span>
                        <span className={styles.statLabel}>Avg. ROI</span>
                    </div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <div className={styles.statIcon} style={{ background: '#F5F3FF', color: '#7C3AED' }}><PieChart size={22} /></div>
                    <div>
                        <span className={styles.statValue}>{investments.length}</span>
                        <span className={styles.statLabel}>Active Deals</span>
                    </div>
                </motion.div>
            </div>

            {/* Performance Overview */}
            <motion.div className={styles.performanceCard} initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                <div className={styles.perfHeader}>
                    <h3>Portfolio Performance</h3>
                    <div className={styles.perfPeriod}>
                        {['6M', '1Y', 'All'].map(p => (
                            <button key={p} className={period === p ? styles.periodActive : ''} onClick={() => setPeriod(p)}>{p}</button>
                        ))}
                    </div>
                </div>
                <div className={styles.perfChart}>
                    <div className={styles.chartGrid}>
                        {currentData.map((val, i) => (
                            <div key={i} className={styles.chartBar}>
                                <div className={styles.chartBarFill} style={{ height: `${val}%` }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Investment List */}
            <div className={styles.sectionHeader}>
                <h3>Investments</h3>
            </div>
            <div className={styles.investmentList}>
                {investments.map((inv, i) => (
                    <motion.div key={inv.id} className={styles.investmentCard} initial="hidden" animate="visible" variants={fadeUp} custom={i + 5} layoutId={`inv-${inv.id}`}>
                        <img src={inv.image} alt={inv.title} className={styles.investImg} />
                        <div className={styles.investContent}>
                            <div className={styles.investTop}>
                                <div>
                                    <h4>{inv.title}</h4>
                                    <p>By {inv.student} • {inv.domain}</p>
                                </div>
                                <span className={styles.stageBadge}>{inv.stage}</span>
                            </div>
                            <div className={styles.investBottom}>
                                <span className={styles.investAmount}><DollarSign size={14} /> {inv.invested}</span>
                                <span className={`${styles.roiBadge} ${inv.roiPositive ? styles.roiPositive : styles.roiNegative}`}>
                                    {inv.roiPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {inv.roi}
                                </span>
                                <span className={styles.investDate}><Clock size={14} /> {inv.date}</span>
                            </div>
                        </div>
                        <button className={styles.viewBtn} onClick={() => setSelectedInvestment(inv)}>View <ArrowRight size={14} /></button>
                    </motion.div>
                ))}
            </div>

            {/* Investment Modal */}
            <AnimatePresence>
                {selectedInvestment && (
                    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedInvestment(null)}>
                        <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Investment Details</h2>
                                <button className={styles.closeBtn} onClick={() => setSelectedInvestment(null)}><X size={20} /></button>
                            </div>
                            <div className={styles.modalContent}>
                                <div className={styles.modalTop}>
                                    <img src={selectedInvestment.image} alt="" className={styles.modalImg} />
                                    <div>
                                        <h3>{selectedInvestment.title}</h3>
                                        <p>{selectedInvestment.student} · {selectedInvestment.domain}</p>
                                    </div>
                                </div>
                                <div className={styles.modalStats}>
                                    <div className={styles.modalStat}><span>Invested</span><strong>{selectedInvestment.invested}</strong></div>
                                    <div className={styles.modalStat}><span>Equity</span><strong>{selectedInvestment.equity}</strong></div>
                                    <div className={styles.modalStat}><span>Valuation</span><strong>{selectedInvestment.valuation}</strong></div>
                                    <div className={styles.modalStat}><span>ROI</span><strong style={{ color: selectedInvestment.roiPositive ? '#027A48' : '#B42318' }}>{selectedInvestment.roi}</strong></div>
                                </div>
                                <div className={styles.modalDesc}>
                                    <h4>Description</h4>
                                    <p>{selectedInvestment.description}</p>
                                </div>
                                <div className={styles.modalActions}>
                                    <button className={styles.secondaryBtn}>Contact Founder</button>
                                    <button className={styles.primaryBtn}>Add Funding</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
