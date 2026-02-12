'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lightbulb, TrendingUp, Search, Eye, MessageCircle, Shield, ArrowRight } from 'lucide-react';
import styles from '../landing.module.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
    { icon: Search, title: 'Discover Student Ideas', desc: 'Browse a curated feed of innovative ideas from India\'s brightest engineering and business students.', color: 'Teal' },
    { icon: Eye, title: 'Track Interests', desc: 'Save and track ideas you\'re interested in. Get updates as student founders develop their concepts.', color: 'Blue' },
    { icon: MessageCircle, title: 'Direct Mentorship', desc: 'Connect with student founders directly. Provide mentorship, guidance, and industry insights.', color: 'Violet' },
    { icon: TrendingUp, title: 'Portfolio Management', desc: 'Track all your interests, investments, and mentee progress from a single dashboard.', color: 'Teal' },
    { icon: Shield, title: 'Verified Founders', desc: 'Every student founder on the platform has a verified scorecard proving their execution capability.', color: 'Blue' },
    { icon: Lightbulb, title: 'Early Access', desc: 'Get access to innovation at its earliest stage — before anyone else in the market sees it.', color: 'Violet' },
];

export default function ForInvestorsPage() {
    return (
        <>
            <section className={styles.hero} style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' }}>
                <div className="container">
                    <motion.div className={styles.heroContent} initial="hidden" animate="visible" variants={stagger}>
                        <motion.span className="section-label" variants={fadeUp}>For Investors</motion.span>
                        <motion.h1 variants={fadeUp} custom={1}>Discover innovation at <span className="gradient-text">its source</span></motion.h1>
                        <motion.p variants={fadeUp} custom={2}>Get early access to student-led ideas backed by verified execution. Find, mentor, and fund the next generation of founders.</motion.p>
                        <motion.div className={styles.heroCtas} variants={fadeUp} custom={3}>
                            <Link href="/signup" className="btn btn-accent btn-lg">Apply as Investor <ArrowRight size={18} /></Link>
                            <Link href="/how-it-works" className="btn btn-secondary btn-lg">How It Works</Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="section">
                <div className={`container ${styles.splitGrid}`}>
                    <motion.img src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=420&fit=crop" alt="Investor meeting" className={styles.splitImage} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} />
                    <motion.div className={styles.splitText} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <span className="section-label">Why Invest Here</span>
                        <h2>The best ideas start with <span className="gradient-text">the best builders</span></h2>
                        <p>Traditional idea competitions show slides. Bharat Xcelerate shows execution. Every student founder on the platform has a verified scorecard proving they can build what they promise.</p>
                        <p>You&apos;re not just investing in an idea — you&apos;re investing in a proven builder with a track record of execution.</p>
                        <Link href="/signup" className="btn btn-accent">Apply Now <ArrowRight size={16} /></Link>
                    </motion.div>
                </div>
            </section>

            <section className={`section ${styles.altBg}`}>
                <div className="container">
                    <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="section-label">Platform Features</span>
                        <h2 className="section-title">Your gateway to <span className="gradient-text">student innovation</span></h2>
                    </motion.div>
                    <motion.div className={styles.featuresGrid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        {features.map((f, i) => (
                            <motion.div key={f.title} className={styles.featureCard} variants={fadeUp} custom={i}>
                                <div className={`${styles.featureIcon} ${styles[`icon${f.color}`]}`}><f.icon size={24} /></div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="section-label">How It Works</span>
                        <h2 className="section-title">From discovery to <span className="gradient-text">investment</span> in 4 steps</h2>
                    </motion.div>
                    <motion.div className={styles.stepsGrid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        {['Apply & verify', 'Browse ideas', 'Mentor & evaluate', 'Fund innovation'].map((s, i) => (
                            <motion.div key={s} className={styles.stepCard} variants={fadeUp} custom={i}>
                                <div className={styles.stepNumber} style={{ background: 'var(--color-accent-50)', color: 'var(--color-accent)' }}>{i + 1}</div>
                                <h4>{s}</h4>
                                <p>{['Link LinkedIn and get admin-verified.', 'Explore student ideas by domain.', 'Connect directly with founders.', 'Support ideas you believe in.'][i]}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className={`section ${styles.altBg}`}>
                <div className="container">
                    <motion.div className={styles.testimonialBig} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <blockquote>&quot;I discovered three incredible student ideas on Bharat Xcelerate. One of them is now a funded startup with 50K users. This platform is where innovation begins.&quot;</blockquote>
                        <div className={styles.testimonialAuthor}>
                            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" alt="Ananya" className={styles.testimonialAvatar} />
                            <div><strong>Ananya Iyer</strong><span>Angel Investor, Mumbai</span></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2>Join India&apos;s innovation pipeline</h2>
                        <p>Get verified access to student-led ideas and the founders building them.</p>
                        <Link href="/signup" className="btn btn-accent btn-lg">Apply as Investor <ArrowRight size={18} /></Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
