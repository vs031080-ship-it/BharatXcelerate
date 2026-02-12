'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, Briefcase, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';
import styles from './how.module.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };

const journeys = [
    {
        role: 'Student', icon: Users, color: 'blue', link: '/for-students',
        steps: [
            { title: 'Sign Up for Free', desc: 'Create your account in 30 seconds. No credit card, no fees, ever.' },
            { title: 'Browse 100+ Projects', desc: 'Explore projects across AI, Web Dev, Data Science, Blockchain & more.' },
            { title: 'Execute & Submit', desc: 'Work on real-world projects at your own pace. Submit code, reports, and demos.' },
            { title: 'Build Your Scorecard', desc: 'Every completed project adds to your verified Scorecard — your proof of work.' },
            { title: 'Get Discovered', desc: 'Companies and investors browse the platform and find YOU based on what you built.' },
        ]
    },
    {
        role: 'Company', icon: Briefcase, color: 'violet', link: '/for-companies',
        steps: [
            { title: 'Register as Hiring Partner', desc: 'Verify your company domain and set up your employer profile.' },
            { title: 'Set Hiring Criteria', desc: 'Define the skills, domains, and scorecard thresholds you\'re looking for.' },
            { title: 'Discover Talent', desc: 'Search and filter students by their verified project portfolios and scorecards.' },
            { title: 'Shortlist & Connect', desc: 'Save candidates, review their work, and reach out directly on the platform.' },
            { title: 'Hire with Confidence', desc: 'Every candidate you find has proven their skills through real execution.' },
        ]
    },
    {
        role: 'Investor', icon: Lightbulb, color: 'teal', link: '/for-investors',
        steps: [
            { title: 'Apply & Get Verified', desc: 'Link your LinkedIn, state your investment focus, and get admin-approved.' },
            { title: 'Browse Student Ideas', desc: 'Explore innovative ideas submitted by students across different domains.' },
            { title: 'Evaluate & Mentor', desc: 'Provide feedback, mentor promising founders, and track ideas you\'re interested in.' },
            { title: 'Fund Innovation', desc: 'Connect directly with student founders and support the ideas you believe in.' },
            { title: 'Track Your Portfolio', desc: 'Monitor the progress of ideas you\'ve funded or mentored on your dashboard.' },
        ]
    },
];

export default function HowItWorksPage() {
    return (
        <>
            <section className={styles.hero}>
                <div className="container">
                    <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="section-label">How It Works</span>
                        <h1>One platform. <span className="gradient-text">Three powerful journeys.</span></h1>
                        <p>Whether you&apos;re a student, company, or investor — here&apos;s exactly how Bharat Xcelerate works for you.</p>
                    </motion.div>
                </div>
            </section>

            {journeys.map((j, idx) => (
                <section key={j.role} className={`section ${idx % 2 === 1 ? styles.altBg : ''}`}>
                    <div className="container">
                        <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <span className="section-label">{`For ${j.role}s`}</span>
                            <h2 className="section-title">Your journey as a <span className="gradient-text">{j.role}</span></h2>
                        </motion.div>
                        <div className={styles.timeline}>
                            {j.steps.map((step, i) => (
                                <motion.div key={step.title} className={styles.timelineItem} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                    <div className={`${styles.timelineNumber} ${styles[`num${j.color}`]}`}>{i + 1}</div>
                                    <div className={styles.timelineContent}>
                                        <h3>{step.title}</h3>
                                        <p>{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <Link href={j.link} className={`btn btn-primary btn-lg`}>
                                Learn more about {j.role}s <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
            ))}

            <section className={styles.ctaSection}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2>Ready to get started?</h2>
                        <p>Join thousands already building their future through proof of work.</p>
                        <Link href="/signup" className="btn btn-primary btn-lg">Join for Free <ArrowRight size={18} /></Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
