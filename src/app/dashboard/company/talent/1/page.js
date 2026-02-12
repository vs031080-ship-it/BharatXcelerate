'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Briefcase, Mail, Phone, Globe, Github, Linkedin, Download, Star, ExternalLink, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import styles from '../../profile.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const student = {
    id: 1,
    name: 'Rahul Desai',
    role: 'Full Stack Developer',
    location: 'Mumbai, India',
    email: 'rahul.desai@example.com',
    phone: '+91 98765 43210',
    bio: 'Passionate about building scalable web applications. I love solving complex backend problems and creating intuitive frontend experiences. Completed 12 verified projects on Bharat Xcelerate.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript', 'Next.js', 'Redis'],
    score: 920,
    metrics: { execution: 92, quality: 88, speed: 95 },
    projects: [
        { id: 101, title: 'E-Commerce Microservices', domain: 'Backend', score: 95, date: 'Jan 2026', link: '#' },
        { id: 102, title: 'Real-time Collab Tool', domain: 'Full Stack', score: 90, date: 'Dec 2025', link: '#' },
        { id: 103, title: 'DeFi Dashboard', domain: 'Blockchain', score: 88, date: 'Nov 2025', link: '#' },
    ],
    education: [
        { degree: 'B.Tech Computer Science', school: 'IIT Bombay', year: '2022-2026' }
    ]
};

export default function CandidateProfilePage({ params }) {
    return (
        <div className={styles.container}>
            <Link href="/dashboard/company/talent" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to Search
            </Link>

            <div className={styles.profileHeader}>
                <div className={styles.headerTop}>
                    <div className={styles.userInfo}>
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" alt={student.name} className={styles.avatar} />
                        <div>
                            <h1>{student.name}</h1>
                            <p className={styles.role}>{student.role}</p>
                            <div className={styles.location}><MapPin size={14} /> {student.location}</div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button className="btn btn-outline"><Mail size={16} /> Message</button>
                        <button className="btn btn-primary">Schedule Interview</button>
                    </div>
                </div>

                <div className={styles.bioSection}>
                    <p>{student.bio}</p>
                    <div className={styles.socialLinks}>
                        <a href="#"><Github size={18} /></a>
                        <a href="#"><Linkedin size={18} /></a>
                        <a href="#"><Globe size={18} /></a>
                        <button className={styles.resumeBtn}><Download size={14} /> Resume</button>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Left Column: Stats & Skills */}
                <div className={styles.leftCol}>
                    <div className={styles.card}>
                        <h3>Verified Scorecard</h3>
                        <div className={styles.scoreCircle}>
                            <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className={styles.circle} strokeDasharray={`${(student.score / 1000) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className={styles.scoreText}>
                                <strong>{student.score}</strong>
                                <span>/1000</span>
                            </div>
                        </div>
                        <div className={styles.metrics}>
                            <div className={styles.metricRow}><span>Execution</span><strong>{student.metrics.execution}/100</strong></div>
                            <div className={styles.metricRow}><span>Code Quality</span><strong>{student.metrics.quality}/100</strong></div>
                            <div className={styles.metricRow}><span>Speed</span><strong>{student.metrics.speed}/100</strong></div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3>Skills</h3>
                        <div className={styles.skillTags}>
                            {student.skills.map(s => <span key={s} className={styles.skill}>{s}</span>)}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3>Education</h3>
                        {student.education.map((e, i) => (
                            <div key={i} className={styles.eduItem}>
                                <h4>{e.degree}</h4>
                                <p>{e.school}</p>
                                <span>{e.year}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Projects */}
                <div className={styles.rightCol}>
                    <h3 className={styles.sectionTitle}>Verified Projects</h3>
                    <div className={styles.projectList}>
                        {student.projects.map((p, i) => (
                            <motion.div key={p.id} className={styles.projectCard} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                                <div className={styles.projectHeader}>
                                    <div>
                                        <h4>{p.title}</h4>
                                        <span className={styles.domainBadge}>{p.domain}</span>
                                    </div>
                                    <div className={styles.projectScore}>
                                        <Star size={14} fill="#FACC15" color="#FACC15" /> <strong>{p.score}</strong>
                                    </div>
                                </div>
                                <div className={styles.projectFooter}>
                                    <span>Completed {p.date}</span>
                                    <a href={p.link} className={styles.viewLink}>View Code <ExternalLink size={14} /></a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
