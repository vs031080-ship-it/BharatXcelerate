'use client';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import styles from './contact.module.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };

const faqs = [
    { q: 'Is Bharat Xcelerate free for students?', a: 'Yes! There are no fees, subscriptions, or hidden charges for students. Create an account and start building your portfolio for free.' },
    { q: 'How does the Scorecard work?', a: 'Your Scorecard is a verified record of all projects you complete. Companies use it to evaluate your skills based on actual execution rather than just credentials.' },
    { q: 'How do companies verify student work?', a: 'All project submissions go through our verification process. Companies can review actual code, demos, and deliverables before making hiring decisions.' },
    { q: 'How can investors join the platform?', a: 'Investors need to apply and complete our verification process, which includes LinkedIn verification and a statement of investment intent. Our admin team reviews each application.' },
    { q: 'Can I switch my role after signing up?', a: 'Roles are locked after initial selection to maintain platform integrity. If you need to change your role, contact our support team for admin approval.' },
];

export default function ContactPage() {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <>
            <section className={styles.hero}>
                <div className="container">
                    <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="section-label">Contact Us</span>
                        <h1>We&apos;d love to <span className="gradient-text">hear from you</span></h1>
                        <p>Got a question, feedback, or partnership inquiry? Reach out and our team will respond within 24 hours.</p>
                    </motion.div>
                </div>
            </section>

            <section className="section">
                <div className={`container ${styles.contactGrid}`}>
                    <motion.div className={styles.contactInfo} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h2>Get in touch</h2>
                        <p>Choose the best way to reach us or fill out the form.</p>
                        <div className={styles.infoCards}>
                            <div className={styles.infoCard}><div className={styles.infoIcon}><Mail size={24} /></div><div><h4>Email Us</h4><p>hello@bharatxcelerate.com</p></div></div>
                            <div className={styles.infoCard}><div className={styles.infoIcon}><Phone size={24} /></div><div><h4>Call Us</h4><p>+91 99999 99999</p></div></div>
                            <div className={styles.infoCard}><div className={styles.infoIcon}><MapPin size={24} /></div><div><h4>Visit Us</h4><p>New Delhi, India</p></div></div>
                            <div className={styles.infoCard}><div className={styles.infoIcon}><MessageSquare size={24} /></div><div><h4>Live Chat</h4><p>Available Mon-Sat, 9am-6pm</p></div></div>
                        </div>
                    </motion.div>

                    <motion.form className={styles.contactForm} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}><label>First Name</label><input type="text" placeholder="Arjun" /></div>
                            <div className={styles.formGroup}><label>Last Name</label><input type="text" placeholder="Sharma" /></div>
                        </div>
                        <div className={styles.formGroup}><label>Email</label><input type="email" placeholder="arjun@example.com" /></div>
                        <div className={styles.formGroup}>
                            <label>Subject</label>
                            <select><option>General Inquiry</option><option>Partnership</option><option>Technical Support</option><option>Bug Report</option><option>Other</option></select>
                        </div>
                        <div className={styles.formGroup}><label>Message</label><textarea rows="5" placeholder="Tell us how we can help..."></textarea></div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}><Send size={18} /> Send Message</button>
                    </motion.form>
                </div>
            </section>

            <section className={`section ${styles.faqSection}`} id="faq">
                <div className="container">
                    <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="section-label">FAQ</span>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                    </motion.div>
                    <div className={styles.faqList}>
                        {faqs.map((faq, i) => (
                            <motion.div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <span>{faq.q}</span>
                                    <ChevronDown size={20} className={styles.faqChevron} />
                                </button>
                                {openFaq === i && <div className={styles.faqAnswer}>{faq.a}</div>}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
