'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Users } from 'lucide-react';
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
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { user } = await login(email, password, role);
            if (user) {
                if (user.role === 'company') router.push('/dashboard/company');
                else if (user.role === 'investor') router.push('/dashboard/investor');
                else router.push('/dashboard/student');
            }
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authLeft}>
                <div className={styles.authLeftContent}>
                    <h1>Welcome back to <span className="gradient-text">Bharat Xcelerate</span></h1>
                    <p>Continue building your proof-of-work portfolio and get discovered by companies and investors.</p>
                    <div className={styles.authStats}>
                        <div><strong>10K+</strong><span>Students</span></div>
                        <div><strong>500+</strong><span>Companies</span></div>
                        <div><strong>200+</strong><span>Investors</span></div>
                    </div>
                </div>
            </div>
            <div className={styles.authRight}>
                <motion.div className={styles.authForm} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href="/" className={styles.authLogo}>
                        <span>Bharat</span><span className="gradient-text">Xcelerate</span>
                    </Link>
                    <h2>Log in to your account</h2>
                    <p className={styles.authSubtitle}>Enter your credentials to access your dashboard.</p>

                    <form onSubmit={handleLogin}>
                        <div className={styles.inputGroup}>
                            <label>I am a</label>
                            <div className={styles.inputWrapper}>
                                <Users size={18} className={styles.inputIcon} />
                                <select
                                    className={styles.selectInput}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="student">Student</option>
                                    <option value="company">Company</option>
                                    <option value="investor">Investor</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
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
                            <label className={styles.checkbox}><input type="checkbox" /> Remember me</label>
                            <Link href="#" className={styles.forgotLink}>Forgot password?</Link>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Logging in...' : <>Log In <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className={styles.divider}><span>or</span></div>

                    <button className={styles.socialBtn}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                        Continue with Google
                    </button>

                    <p className={styles.authSwitch}>Don&apos;t have an account? <Link href="/signup">Sign up for free</Link></p>
                </motion.div>
            </div>
        </div>
    );
}
