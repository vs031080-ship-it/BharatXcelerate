'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import styles from './blog.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const posts = [
    { id: 1, title: 'Why Proof of Work is the Future of Hiring', excerpt: 'Traditional hiring is broken. Here\'s why verified project execution is replacing resumes and credentials in modern recruitment.', category: 'Industry', date: 'Feb 10, 2026', readTime: '5 min', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=350&fit=crop' },
    { id: 2, title: 'Top 10 Projects Every CS Student Should Build', excerpt: 'Boost your portfolio with these high-impact projects across AI, Web Dev, and Data Science that companies actually look for.', category: 'Students', date: 'Feb 8, 2026', readTime: '7 min', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=350&fit=crop' },
    { id: 3, title: 'How Bharat Xcelerate Helped Me Land My Dream Job', excerpt: 'Priya shares her journey from struggling to find opportunities to getting 3 interview calls within 2 weeks of building her scorecard.', category: 'Success Story', date: 'Feb 5, 2026', readTime: '4 min', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=350&fit=crop' },
    { id: 4, title: 'The Rise of Student-Led Innovation in India', excerpt: 'Indian students are building startups from dorms. Here\'s how the ecosystem is changing and what investors should know.', category: 'Investors', date: 'Feb 3, 2026', readTime: '6 min', image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=350&fit=crop' },
    { id: 5, title: 'Building a Scorecard vs Building a Resume', excerpt: 'A deep dive into why verified, project-based portfolios outperform traditional resumes in every measurable way.', category: 'Industry', date: 'Jan 30, 2026', readTime: '5 min', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=350&fit=crop' },
    { id: 6, title: '5 Ways Companies Are Rethinking Talent Acquisition', excerpt: 'From scorecard-based hiring to project audits, modern companies are ditching old-school recruitment methods.', category: 'Companies', date: 'Jan 28, 2026', readTime: '6 min', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=350&fit=crop' },
];

export default function BlogPage() {
    return (
        <>
            <section className={styles.hero}>
                <div className="container">
                    <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="section-label">Blog</span>
                        <h1>Insights, stories & <span className="gradient-text">updates</span></h1>
                        <p>Stay updated with the latest from Bharat Xcelerate — industry insights, student success stories, and platform news.</p>
                    </motion.div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Featured post */}
                    <motion.div className={styles.featuredPost} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.featuredImage}><img src={posts[0].image} alt={posts[0].title} /></div>
                        <div className={styles.featuredContent}>
                            <span className={styles.postCategory}>{posts[0].category}</span>
                            <h2>{posts[0].title}</h2>
                            <p>{posts[0].excerpt}</p>
                            <div className={styles.postMeta}><span><Calendar size={14} /> {posts[0].date}</span><span><Clock size={14} /> {posts[0].readTime}</span></div>
                            <Link href="#" className="btn btn-primary">Read More <ArrowRight size={16} /></Link>
                        </div>
                    </motion.div>

                    {/* Post Grid */}
                    <div className={styles.postGrid}>
                        {posts.slice(1).map((post, i) => (
                            <motion.div key={post.id} className={styles.postCard} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} whileHover={{ y: -6 }}>
                                <div className={styles.postImage}><img src={post.image} alt={post.title} /></div>
                                <div className={styles.postInfo}>
                                    <span className={styles.postCategory}>{post.category}</span>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt}</p>
                                    <div className={styles.postMeta}><span><Calendar size={14} /> {post.date}</span><span><Clock size={14} /> {post.readTime}</span></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
