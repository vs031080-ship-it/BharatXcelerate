'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowRight, Clock, Star, Briefcase, BarChart3 } from 'lucide-react';
import styles from './portfolio.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const investments = [
    { id: 1, title: 'AgriTech Drone Solution', student: 'Rohan Gupta', domain: 'Agriculture', stage: 'Seed', invested: '₹5,00,000', roi: '+22%', roiPositive: true, date: 'Dec 2025', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop' },
    { id: 2, title: 'SkillSwap — Peer Learning', student: 'Priya Sharma', domain: 'EdTech', stage: 'Pre-Seed', invested: '₹2,50,000', roi: '+15%', roiPositive: true, date: 'Jan 2026', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop' },
    { id: 3, title: 'MedTrack Compliance App', student: 'Amit Patel', domain: 'HealthTech', stage: 'Seed', invested: '₹7,50,000', roi: '+35%', roiPositive: true, date: 'Oct 2025', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop' },
    { id: 4, title: 'GreenChain Carbon NFTs', student: 'Vikram Mehta', domain: 'Blockchain', stage: 'Pre-Seed', invested: '₹3,00,000', roi: '-5%', roiPositive: false, date: 'Feb 2026', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop' },
    { id: 5, title: 'FarmSense IoT Dashboard', student: 'Sneha Reddy', domain: 'AgriTech', stage: 'Pre-Seed', invested: '₹1,50,000', roi: '+8%', roiPositive: true, date: 'Jan 2026', image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=100&h=100&fit=crop' },
];

export default function PortfolioPage() {
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
                        <span className={styles.statValue}>₹19,50,000</span>
                        <span className={styles.statLabel}>Total Invested</span>
                    </div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#2563EB' }}><TrendingUp size={22} /></div>
                    <div>
                        <span className={styles.statValue}>+18.5%</span>
                        <span className={styles.statLabel}>Avg. ROI</span>
                    </div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <div className={styles.statIcon} style={{ background: '#F5F3FF', color: '#7C3AED' }}><PieChart size={22} /></div>
                    <div>
                        <span className={styles.statValue}>5</span>
                        <span className={styles.statLabel}>Active Investments</span>
                    </div>
                </motion.div>
                <motion.div className={styles.statCard} initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                    <div className={styles.statIcon} style={{ background: '#FEF3C7', color: '#D97706' }}><BarChart3 size={22} /></div>
                    <div>
                        <span className={styles.statValue}>3</span>
                        <span className={styles.statLabel}>Domains</span>
                    </div>
                </motion.div>
            </div>

            {/* Performance Overview */}
            <motion.div className={styles.performanceCard} initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                <div className={styles.perfHeader}>
                    <h3>Portfolio Performance</h3>
                    <div className={styles.perfPeriod}>
                        <button className={styles.periodActive}>6M</button>
                        <button>1Y</button>
                        <button>All</button>
                    </div>
                </div>
                <div className={styles.perfChart}>
                    {/* Simple visual chart bars */}
                    <div className={styles.chartGrid}>
                        {[40, 55, 45, 70, 65, 82].map((val, i) => (
                            <div key={i} className={styles.chartBar}>
                                <div className={styles.chartBarFill} style={{ height: `${val}%` }}></div>
                                <span className={styles.chartLabel}>{['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][i]}</span>
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
                    <motion.div key={inv.id} className={styles.investmentCard} initial="hidden" animate="visible" variants={fadeUp} custom={i + 5}>
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
                        <button className={styles.viewBtn}>View <ArrowRight size={14} /></button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
