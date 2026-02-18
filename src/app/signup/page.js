'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Users, Briefcase, Lightbulb, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../auth.module.css';

const roles = [
    { id: 'student', icon: Users, label: 'Student', desc: 'Build your portfolio' },
    { id: 'company', icon: Briefcase, label: 'Company', desc: 'Hire verified talent' },
    { id: 'investor', icon: Lightbulb, label: 'Investor', desc: 'Discover ideas' },
];

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const useRouterHook = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userData = {
                name,
                email,
                role: selectedRole
            };
            const { success } = await signup(userData);
            if (success) {
                if (selectedRole === 'company') useRouterHook.push('/dashboard/company');
                else if (selectedRole === 'investor') useRouterHook.push('/dashboard/investor');
                else useRouterHook.push('/dashboard/student');
            }
        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            {/* Left Panel — Masonry Brand Grid */}
            <div className={styles.authLeft}>
                <div className={styles.authLeftContent}>
                    <div className={styles.authMasonry}>
                        {/* Column 1 */}
                        <div className={`${styles.masonryItem} ${styles.itemTall}`}>
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop" alt="Students collaborating" />
                        </div>
                        <div className={`${styles.masonryItem} ${styles.itemSquare} ${styles.bgOrange}`}>
                            <div className={styles.contentCard}>
                                <h2>41%</h2>
                                <p>of recruiters say entry-level positions are the hardest to fill. Join us to be job-ready.</p>
                            </div>
                        </div>
                        <div className={`${styles.masonryItem} ${styles.itemTall}`}>
                            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop" alt="Modern office" />
                        </div>

                        {/* Column 2 */}
                        <div className={`${styles.masonryItem} ${styles.itemVeryTall}`}>
                            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1374&auto=format&fit=crop" alt="Professional mentor" />
                        </div>
                        <div className={`${styles.masonryItem} ${styles.itemSquare} ${styles.bgGreen}`}>
                            <div className={styles.contentCard}>
                                <h2>76%</h2>
                                <p>of hiring managers admit attracting the right job candidates is their greatest challenge.</p>
                            </div>
                        </div>
                        <div className={`${styles.masonryItem} ${styles.itemLarge}`}>
                            <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1374&auto=format&fit=crop" alt="Team meeting" />
                        </div>

                        {/* Column 3 */}
                        <div className={`${styles.masonryItem} ${styles.itemTall}`}>
                            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1470&auto=format&fit=crop" alt="Corporate office" />
                        </div>
                        <div className={`${styles.masonryItem} ${styles.itemVeryTall}`}>
                            <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1374&auto=format&fit=crop" alt="Networking event" />
                        </div>
                        <div className={`${styles.masonryItem} ${styles.itemShort}`}>
                            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop" alt="Workshop" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Signup Form */}
            <div className={styles.authRight}>
                <motion.div className={styles.authForm} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className={styles.authHeader}>
                        <Link href="/" className={styles.authLogo}>
                            <Zap size={24} color="#2563EB" fill="#2563EB" />
                            <span>BharatXcelerate</span>
                        </Link>
                        <h2>Create your account</h2>
                        <p className={styles.authSubtitle}>Join BharatXcelerate to start your journey today.</p>
                    </div>

                    {/* Role Selection */}
                    <div className={styles.roleSelection}>
                        {roles.map((role) => (
                            <div key={role.id} className={`${styles.roleCard} ${selectedRole === role.id ? styles.roleCardActive : ''}`} onClick={() => setSelectedRole(role.id)}>
                                <div className={styles.roleIcon}><role.icon size={20} /></div>
                                <h4>{role.label}</h4>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSignup}>
                        <div className={styles.inputGroup}>
                            <label>Full Name</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Arjun Sharma"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="email"
                                    placeholder={selectedRole === 'company' ? 'you@company.com' : 'you@example.com'}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className={styles.formOptions}>
                            <label className={styles.checkbox}>
                                <input type="checkbox" required />
                                <span>I agree to the <Link href="/terms">Terms of Service</Link></span>
                            </label>
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className={styles.divider}><span>OR</span></div>

                    <button className={styles.socialBtn}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                        Sign up with Google
                    </button>

                    <p className={styles.authSwitch}>Already have an account? <Link href="/login">Log in</Link></p>
                </motion.div>
            </div>
        </div>
    );
}
