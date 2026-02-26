'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Briefcase, Lightbulb, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import styles from './how.module.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariant = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const rightCardVariant = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const journeys = [
    {
        role: 'Student',
        icon: Users,
        colorClass: styles.blueTheme,
        badgeBg: 'var(--color-primary-100)',
        badgeColor: 'var(--color-primary)',
        link: '/for-students',
        description: "Your journey from code to career starts here. Build projects, prove your skills, and let top companies discover you based on what you can actually do.",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
        imageAlt: "Student coding late at night",
        steps: [
            { title: 'Sign Up for Free', desc: 'Create your account in seconds. No fees, ever.' },
            { title: 'Claim Projects', desc: 'Choose from 100+ real-world challenges across various tech domains.' },
            { title: 'Execute & Submit', desc: 'Build the project locally, commit to GitHub, and submit your proof.' },
            { title: 'Build Your Scorecard', desc: 'Every completed project strengthens your verified developer profile.' },
            { title: 'Get Discovered', desc: 'Companies reach out to you based on your verified skills and execution.' },
        ]
    },
    {
        role: 'Company',
        icon: Briefcase,
        colorClass: styles.violetTheme,
        badgeBg: 'var(--color-secondary-100)', // Assuming secondary exists in globals.css, using fallback if not perfectly matched
        badgeColor: 'var(--color-secondary)',
        link: '/for-companies',
        description: "Stop guessing based on resumes. Hire talent that has already proven they can build the products you need.",
        imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
        imageAlt: "Corporate hiring team reviewing documents",
        steps: [
            { title: 'Register as Partner', desc: 'Verify your company and set up your hiring profile quickly.' },
            { title: 'Set Hiring Criteria', desc: 'Define required skills and specific project completion thresholds.' },
            { title: 'Discover Verified Talent', desc: 'Browse students whose scorecards match your exact technical needs.' },
            { title: 'Review Code & Demos', desc: 'Look at the actual code and live demos they submitted.' },
            { title: 'Shortlist & Hire', desc: 'Connect directly with the candidates who have proven they can execute.' },
        ]
    },
    {
        role: 'Investor',
        icon: Lightbulb,
        colorClass: styles.tealTheme,
        badgeBg: 'var(--color-accent-100)', // Assuming accent exists
        badgeColor: 'var(--color-accent)',
        link: '/for-investors',
        description: "Discover the next big thing before it hits the market. Fund student innovation and mentor tomorrow's founders.",
        imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop",
        imageAlt: "Investors analyzing graphs and data",
        steps: [
            { title: 'Get Verified', desc: 'Apply with your credentials and investment focus to get access.' },
            { title: 'Explore the Idea Lab', desc: 'Browse hundreds of innovative projects and startup ideas from students.' },
            { title: 'Evaluate Execution', desc: 'Don\'t just read ideas; see how well the student executed the prototype.' },
            { title: 'Provide Feedback', desc: 'Mentor promising students directly through the platform.' },
            { title: 'Fund Innovation', desc: 'Connect with driven builders and invest early in future giants.' },
        ]
    },
];

const JourneySection = ({ journey, index }) => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yParallax = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const imageParallax = useTransform(scrollYProgress, [0, 1], [-20, 20]);

    // Smooth fade in and out for the entire section content
    const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const isEven = index % 2 === 0;

    return (
        <motion.section
            ref={sectionRef}
            style={{ opacity: opacityFade }}
            className={`${styles.journeySection} ${journey.colorClass}`}
        >
            <div className={`container ${styles.journeyContainer} ${isEven ? '' : styles.reverseLayout}`}>

                {/* Text & Image Side */}
                <motion.div
                    className={styles.journeyContent}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    style={{ y: yParallax }}
                >
                    <div className={styles.roleBadge} style={{ backgroundColor: journey.badgeBg, color: journey.badgeColor }}>
                        <journey.icon size={20} />
                        <span>For {journey.role}s</span>
                    </div>
                    <h2>The <span className={styles.gradientText}>{journey.role}</span> Journey</h2>
                    <p>{journey.description}</p>

                    <div className={styles.imageWrapper}>
                        <motion.div style={{ y: imageParallax, height: '100%', width: '100%', position: 'relative' }}>
                            <Image
                                src={journey.imageUrl}
                                alt={journey.imageAlt}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>
                    </div>

                    <Link href={journey.link} className={`btn ${styles.learnMoreBtn}`}>
                        Learn more about {journey.role}s <ArrowRight size={18} />
                    </Link>
                </motion.div>

                {/* Tracking/Steps Side */}
                <div className={styles.journeyStepsWrapper}>
                    {/* The solid colored line connecting steps */}
                    <motion.div
                        className={styles.connectingLine}
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    <motion.div
                        className={styles.stepsList}
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {journey.steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                className={styles.stepCard}
                                variants={isEven ? rightCardVariant : cardVariant}
                                whileHover={{ scale: 1.02, x: isEven ? -5 : 5 }}
                            >
                                <div className={styles.stepNumberContainer}>
                                    <div className={styles.stepNumber}>{i + 1}</div>
                                </div>
                                <div className={styles.stepDetails}>
                                    <div className={styles.stepHeader}>
                                        <CheckCircle2 size={16} className={styles.checkIcon} />
                                        <h3>{step.title}</h3>
                                    </div>
                                    <p>{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </div>
        </motion.section>
    );
};

export default function HowItWorksPage() {
    return (
        <div className={styles.pageWrapper}>
            {/* Light Theme Hero Section */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroContainer}`}>
                    <motion.div
                        className={styles.heroContentWrapper}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            className={styles.badge}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            The Blueprint
                        </motion.div>
                        <h1 className={styles.heroTitle}>
                            One execution platform. <br />
                            <span className={styles.heroGradientText}>Three powerful journeys.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Discover the clear path from skill acquisition to employment and investment.
                            Scroll to see how the ecosystem connects.
                        </p>

                        <motion.div
                            className={styles.scrollIndicator}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <ChevronDown size={32} />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Expansive Journeys */}
            <div className={styles.journeysWrapper}>
                {journeys.map((journey, index) => (
                    <JourneySection key={journey.role} journey={journey} index={index} />
                ))}
            </div>

            {/* Light Theme CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <motion.div
                        className={styles.ctaCard}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2>Ready to Stop Talking and Start Building?</h2>
                        <p>Join thousands of students, companies, and investors building their future through verified proof of work.</p>
                        <div className={styles.ctaActions}>
                            <Link href="/signup" className="btn btn-primary btn-lg">
                                Create Free Account <ArrowRight size={18} />
                            </Link>
                            <Link href="/login" className={`btn btn-secondary btn-lg`}>
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
