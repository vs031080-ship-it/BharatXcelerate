'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Shield, BarChart3, Clock, Users, Filter, ArrowRight, CheckCircle } from 'lucide-react';
import styles from '../landing.module.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
    { icon: Search, title: 'Smart Talent Discovery', desc: 'Search students by skill, domain, scorecard rating, and project portfolio — not just keywords.', color: 'Violet' },
    { icon: Shield, title: 'Verified Skills', desc: 'Every candidate\'s scorecard is built from real project execution. No exaggeration, no fluff.', color: 'Blue' },
    { icon: BarChart3, title: 'Scorecard Analytics', desc: 'Compare candidates side-by-side using objective metrics like execution quality, speed, and complexity.', color: 'Teal' },
    { icon: Clock, title: '60% Faster Hiring', desc: 'Skip the lengthy screening stages. Candidates come pre-vetted with verifiable proof of work.', color: 'Violet' },
    { icon: Users, title: 'Shortlist & Connect', desc: 'Build shortlists, review portfolios, and connect directly with candidates on the platform.', color: 'Blue' },
    { icon: Filter, title: 'Custom Filters', desc: 'Set exact hiring criteria — domains, difficulty levels, project types — and find perfect matches.', color: 'Teal' },
];

export default function ForCompaniesPage() {
    return (
        <>
            <section className={styles.hero} style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)' }}>
                <div className="container">
                    <motion.div className={styles.heroContent} initial="hidden" animate="visible" variants={stagger}>
                        <motion.span className="section-label" variants={fadeUp}>For Companies</motion.span>
                        <motion.h1 variants={fadeUp} custom={1}>Hire talent that has <span className="gradient-text">already proven it</span></motion.h1>
                        <motion.p variants={fadeUp} custom={2}>Stop guessing from resumes. Discover, evaluate, and hire candidates based on their verified project execution and scorecard.</motion.p>
                        <motion.div className={styles.heroCtas} variants={fadeUp} custom={3}>
                            <Link href="/signup" className="btn btn-primary btn-lg">Start Hiring <ArrowRight size={18} /></Link>
                            <Link href="/how-it-works" className="btn btn-secondary btn-lg">See How It Works</Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="section">
                <div className={`container ${styles.splitGrid}`}>
                    <motion.div className={styles.splitText} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <span className="section-label">The Problem</span>
                        <h2>Resumes lie. <span className="gradient-text">Scorecards don&apos;t.</span></h2>
                        <p>82% of hiring managers say traditional resumes are unreliable indicators of actual performance. Most candidates overstate their skills.</p>
                        <p>Bharat Xcelerate changes this. Every student on our platform has a verified scorecard built from real project execution. You see exactly what they&apos;ve built, how well they executed, and how they compare to peers.</p>
                        <Link href="/signup" className="btn btn-primary">Register as Employer <ArrowRight size={16} /></Link>
                    </motion.div>
                    <motion.img src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=420&fit=crop" alt="Office meeting" className={styles.splitImage} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} />
                </div>
            </section>

            <section className={`section ${styles.altBg}`}>
                <div className="container">
                    <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="section-label">Hiring Advantages</span>
                        <h2 className="section-title">Why top companies choose <span className="gradient-text">Bharat Xcelerate</span></h2>
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
                        <h2 className="section-title">Find your next hire in <span className="gradient-text">4 steps</span></h2>
                    </motion.div>
                    <motion.div className={styles.stepsGrid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        {['Register & verify', 'Set criteria', 'Browse scorecards', 'Hire with confidence'].map((s, i) => (
                            <motion.div key={s} className={styles.stepCard} variants={fadeUp} custom={i}>
                                <div className={styles.stepNumber} style={{ background: 'var(--color-secondary-50)', color: 'var(--color-secondary)' }}>{i + 1}</div>
                                <h4>{s}</h4>
                                <p>{['Verify your company domain.', 'Define skills and scorecard thresholds.', 'Review verified student portfolios.', 'Connect and make offers directly.'][i]}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className={`section ${styles.altBg}`}>
                <div className="container">
                    <motion.div className={styles.testimonialBig} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <blockquote>&quot;We reduced hiring time by 60% and found developers who could contribute from day one. The verified scorecard eliminated all guesswork from our process.&quot;</blockquote>
                        <div className={styles.testimonialAuthor}>
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="Rajesh" className={styles.testimonialAvatar} />
                            <div><strong>Rajesh Mehta</strong><span>CTO, TechFlow Solutions</span></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2>Start hiring proven talent today</h2>
                        <p>Join 500+ companies already discovering execution-ready candidates.</p>
                        <Link href="/signup" className="btn btn-primary btn-lg">Register as Employer <ArrowRight size={18} /></Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
