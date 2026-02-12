'use client';
import Link from 'next/link';
import { Linkedin, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

const footerLinks = {
    Platform: [
        { label: 'Projects', href: '/projects' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ],
    'For You': [
        { label: 'For Students', href: '/for-students' },
        { label: 'For Companies', href: '/for-companies' },
        { label: 'For Investors', href: '/for-investors' },
    ],
    Resources: [
        { label: 'Blog', href: '/blog' },
        { label: 'FAQs', href: '/contact#faq' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
    ],
};

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                {/* Brand */}
                <div className={styles.footerBrand}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoPrimary}>Bharat</span>
                        <span className={styles.logoAccent}>Xcelerate</span>
                    </Link>
                    <p className={styles.brandDesc}>
                        The unified platform where Students execute, Companies hire, and Investors innovate. Proof of Work &gt; Credentials.
                    </p>
                    <div className={styles.socials}>
                        <a href="#" aria-label="LinkedIn" className={styles.socialLink}><Linkedin size={20} /></a>
                        <a href="#" aria-label="Twitter" className={styles.socialLink}><Twitter size={20} /></a>
                        <a href="#" aria-label="Instagram" className={styles.socialLink}><Instagram size={20} /></a>
                        <a href="#" aria-label="YouTube" className={styles.socialLink}><Youtube size={20} /></a>
                    </div>
                </div>

                {/* Link Columns */}
                {Object.entries(footerLinks).map(([title, links]) => (
                    <div key={title} className={styles.footerCol}>
                        <h4 className={styles.colTitle}>{title}</h4>
                        <ul className={styles.colLinks}>
                            {links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className={styles.colLink}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Contact Info */}
                <div className={styles.footerCol}>
                    <h4 className={styles.colTitle}>Get in Touch</h4>
                    <ul className={styles.contactList}>
                        <li className={styles.contactItem}>
                            <Mail size={16} />
                            <span>hello@bharatxcelerate.com</span>
                        </li>
                        <li className={styles.contactItem}>
                            <Phone size={16} />
                            <span>+91 99999 99999</span>
                        </li>
                        <li className={styles.contactItem}>
                            <MapPin size={16} />
                            <span>New Delhi, India</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottomBar}>
                <div className={`container ${styles.bottomInner}`}>
                    <p>&copy; {new Date().getFullYear()} Bharat Xcelerate. All rights reserved.</p>
                    <p>Made with ❤️ in India</p>
                </div>
            </div>
        </footer>
    );
}
