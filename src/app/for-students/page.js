'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Award, Target, TrendingUp, Users, Lightbulb, ArrowRight, CheckCircle, Star, Briefcase } from 'lucide-react';
import styles from '../landing.module.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
    { icon: BookOpen, title: '100+ Real Projects', desc: 'Work on industry-grade projects in AI, Web Dev, Data Science, Blockchain, and more.', color: 'Blue' },
    { icon: Award, title: 'Verified Scorecard', desc: 'Build a proof-of-work portfolio that companies trust. Every project adds to your verified scorecard.', color: 'Violet' },
    { icon: Target, title: 'Get Hired', desc: 'Skip cold applications. Companies find YOU based on what you\'ve actually built.', color: 'Teal' },
    { icon: TrendingUp, title: 'Track Progress', desc: 'Visual dashboards showing your growth across skills, projects, and industry domains.', color: 'Blue' },
    { icon: Lightbulb, title: 'Submit Ideas', desc: 'Got a startup idea? Submit it and get feedback from real investors on the platform.', color: 'Violet' },
    { icon: Users, title: 'Community', desc: 'Join a community of ambitious builders. Collaborate, learn, and grow together.', color: 'Teal' },
];

export default function ForStudentsPage() {
    return (
        <>
            <section className={styles.hero} style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}>
                <div className="container">
                    <motion.div className={styles.heroContent} initial="hidden" animate="visible" variants={stagger}>
                        <motion.span className="section-label" variants={fadeUp}>For Students</motion.span>
                        <motion.h1 variants={fadeUp} custom={1}>Build your career through <span className="gradient-text">what you create</span></motion.h1>
                        <motion.p variants={fadeUp} custom={2}>Stop collecting certificates. Start executing real projects and building a portfolio that actually gets you hired.</motion.p>
                        <motion.div className={styles.heroCtas} variants={fadeUp} custom={3}>
                            <Link href="/signup" className="btn btn-primary btn-lg">Start Building <ArrowRight size={18} /></Link>
                            <Link href="/projects" className="btn btn-secondary btn-lg">Explore Projects</Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="section">
                <div className={`container ${styles.splitGrid}`}>
                    <motion.img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=420&fit=crop" alt="Students working" className={styles.splitImage} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} />
                    <motion.div className={styles.splitText} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <span className="section-label">Why Students Love Us</span>
                        <h2>Your resume says you can. Your <span className="gradient-text">scorecard proves</span> you did.</h2>
                        <p>Traditional resumes are full of buzzwords. Bharat Xcelerate replaces them with a verified scorecard built from real project execution.</p>
                        <p>Every project you complete is evaluated, scored, and added to your public profile — visible to 500+ hiring companies.</p>
                        <Link href="/signup" className="btn btn-primary">Get Started <ArrowRight size={16} /></Link>
                    </motion.div>
                </div>
            </section>

            <section className={`section ${styles.altBg}`}>
                <div className="container">
                    <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="section-label">Features</span>
                        <h2 className="section-title">Everything you need to <span className="gradient-text">stand out</span></h2>
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
                        <h2 className="section-title">From sign up to <span className="gradient-text">hired</span> in 4 steps</h2>
                    </motion.div>
                    <motion.div className={styles.stepsGrid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        {['Sign up for free', 'Pick a project', 'Execute & submit', 'Get discovered'].map((s, i) => (
                            <motion.div key={s} className={styles.stepCard} variants={fadeUp} custom={i}>
                                <div className={styles.stepNumber} style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary)' }}>{i + 1}</div>
                                <h4>{s}</h4>
                                <p>{['Create your account in 30 seconds.', 'Browse 100+ projects by domain.', 'Work at your pace, submit deliverables.', 'Companies find you by scorecard.'][i]}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className={`section ${styles.altBg}`}>
                <div className="container">
                    <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="section-label">Student Spotlight</span>
                    </motion.div>
                    <motion.div className={styles.testimonialBig} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <blockquote>&quot;I completed 5 projects on Bharat Xcelerate. Within 2 weeks, I had 3 interview calls from companies I never applied to. The scorecard concept is genius.&quot;</blockquote>
                        <div className={styles.testimonialAuthor}>
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" alt="Priya" className={styles.testimonialAvatar} />
                            <div><strong>Priya Sharma</strong><span>Computer Science, IIT Delhi</span></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2>Start building your future today</h2>
                        <p>Join thousands of students already proving their skills through execution.</p>
                        <Link href="/signup" className="btn btn-primary btn-lg">Join for Free <ArrowRight size={18} /></Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
