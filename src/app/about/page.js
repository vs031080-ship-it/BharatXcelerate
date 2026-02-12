'use client';
import { motion } from 'framer-motion';
import { Target, Heart, Globe, Zap, Users, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './about.module.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const values = [
    { icon: Target, title: 'Execution Over Theory', desc: 'We believe skills proven through real-world projects carry more weight than any credential.' },
    { icon: Heart, title: 'Student First', desc: 'Every feature is designed to help students showcase what they can actually DO.' },
    { icon: Globe, title: 'Accessible to All', desc: 'No paywalls, no barriers. Any student from any background can build their portfolio here.' },
    { icon: Zap, title: 'Innovation Driven', desc: 'We connect bold ideas with capital, turning student innovations into funded startups.' },
];

const team = [
    { name: 'Arjun Malhotra', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face' },
    { name: 'Sneha Kapoor', role: 'CTO', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face' },
    { name: 'Rahul Verma', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
    { name: 'Priya Nair', role: 'Head of Partnerships', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face' },
];

export default function AboutPage() {
    return (
        <>
            <section className={styles.hero}>
                <div className="container">
                    <motion.div className={styles.heroContent} initial="hidden" animate="visible" variants={stagger}>
                        <motion.span className="section-label" variants={fadeUp}>About Us</motion.span>
                        <motion.h1 variants={fadeUp} custom={1}>We&apos;re building India&apos;s <span className="gradient-text">Proof-of-Work revolution</span></motion.h1>
                        <motion.p variants={fadeUp} custom={2}>Bharat Xcelerate is the platform where talent is measured by what you build — not what&apos;s written on a piece of paper.</motion.p>
                    </motion.div>
                </div>
            </section>

            <section className="section">
                <div className={`container ${styles.storyGrid}`}>
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=450&fit=crop" alt="Team collaborating" className={styles.storyImage} />
                    </motion.div>
                    <motion.div className={styles.storyText} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <span className="section-label">Our Story</span>
                        <h2>Born from frustration with the <span className="gradient-text">credential obsession</span></h2>
                        <p>We saw brilliant students getting overlooked because they lacked the &quot;right&quot; college name or degree. Meanwhile, companies struggled to find candidates who could actually execute.</p>
                        <p>Bharat Xcelerate was born to fix this disconnect. We created a platform where students prove their skills through real-world project execution, companies hire based on verified proof-of-work, and investors discover innovation at its source.</p>
                        <p>Today, we&apos;re proud to serve thousands of students, hundreds of companies, and a growing community of investors — all united by one belief: <strong>what you build matters more than what you study.</strong></p>
                    </motion.div>
                </div>
            </section>

            <section className={`section ${styles.valuesSection}`}>
                <div className="container">
                    <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="section-label">Our Values</span>
                        <h2 className="section-title">What drives everything we do</h2>
                    </motion.div>
                    <motion.div className={styles.valuesGrid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        {values.map((v, i) => (
                            <motion.div key={v.title} className={styles.valueCard} variants={fadeUp} custom={i}>
                                <div className={styles.valueIcon}><v.icon size={28} /></div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className={`section ${styles.statsSection}`}>
                <div className={`container ${styles.statsRow}`}>
                    {[{ n: '10,000+', l: 'Students' }, { n: '500+', l: 'Companies' }, { n: '200+', l: 'Investors' }, { n: '100+', l: 'Projects' }].map((s) => (
                        <motion.div key={s.l} className={styles.stat} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                            <h3>{s.n}</h3><p>{s.l}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="section-label">Leadership</span>
                        <h2 className="section-title">Meet the team behind <span className="gradient-text">Bharat Xcelerate</span></h2>
                    </motion.div>
                    <motion.div className={styles.teamGrid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        {team.map((t, i) => (
                            <motion.div key={t.name} className={styles.teamCard} variants={fadeUp} custom={i}>
                                <img src={t.image} alt={t.name} className={styles.teamImg} />
                                <h4>{t.name}</h4>
                                <p>{t.role}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2>Ready to join the movement?</h2>
                        <p>Be part of India&apos;s largest proof-of-work community.</p>
                        <Link href="/signup" className="btn btn-primary btn-lg">Join for Free <ArrowRight size={18} /></Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
