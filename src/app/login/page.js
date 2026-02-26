'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../auth.module.css';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { user } = await login(email, password, role);
            if (user) {
                if (user.role === 'admin') router.push('/dashboard/admin');
                else if (user.role === 'company') router.push('/dashboard/company');
                else if (user.role === 'investor') router.push('/dashboard/investor');
                else router.push('/dashboard/student');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
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
                        {/* Column 1: Items 1, 5, 7 */}
                        <div className={`${styles.masonryItem} ${styles.span8}`}>
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop" alt="Students collaborating" />
                        </div>
                        <div className={`${styles.masonryItem} ${styles.span6} ${styles.bgOrange}`}>
                            <div className={styles.contentCard}>
                                <h2>41%</h2>
                                <p>of recruiters say entry-level positions are the hardest to fill. We bridge that gap.</p>
                            </div>
                        </div>
                        <div className={`${styles.masonryItem} ${styles.span8}`}>
                            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop" alt="Modern office" />
                        </div>

                        {/* Column 2: Items 2, 4, 8 */}
                        <div className={`${styles.masonryItem} ${styles.span11}`}>
                            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1374&auto=format&fit=crop" alt="Professional mentor" />
                        </div>
                        <div className={`${styles.masonryItem} ${styles.span6} ${styles.bgGreen}`}>
                            <div className={styles.contentCard}>
                                <h2>76%</h2>
                                <p>of hiring managers admit attracting the right job candidates is their greatest challenge.</p>
                            </div>
                        </div>
                        <div className={`${styles.masonryItem} ${styles.span16}`}>
                            <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1374&auto=format&fit=crop" alt="Team meeting" />
                        </div>

                        {/* Column 3: Items 3, 6 */}
                        <div className={`${styles.masonryItem} ${styles.span10}`}>
                            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1470&auto=format&fit=crop" alt="Corporate office" />
                        </div>
                        <div className={`${styles.masonryItem} ${styles.span7}`}>
                            <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1374&auto=format&fit=crop" alt="Networking event" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Login Form */}
            <div className={styles.authRight}>
                <motion.div className={styles.authForm} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className={styles.authHeader}>
                        <h2>Sign in to BharatXcelerate</h2>
                        <p className={styles.authSubtitle}>Welcome back! Please enter your details below.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className={styles.inputGroup}>
                            <label>Login As</label>
                            <div className={styles.inputWrapper}>
                                <select
                                    className={styles.selectInput}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="student">Student</option>
                                    <option value="company">Company</option>
                                    <option value="investor">Investor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
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
                                    placeholder="••••••••"
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
                            <Link href="#" className={styles.forgotLink}>Forgot the password?</Link>
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        {error && <p style={{ color: '#D92D20', fontSize: '0.875rem', marginTop: 8, textAlign: 'center' }}>{error}</p>}
                    </form>

                    <div className={styles.divider}><span>OR</span></div>

                    <button className={styles.socialBtn}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                        Sign in with Google
                    </button>

                    <p className={styles.authSwitch}>Don&apos;t have an account? <Link href="/signup">Sign up</Link></p>
                </motion.div>
            </div>
        </div>
    );
}
