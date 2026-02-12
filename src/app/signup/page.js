'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Users, Briefcase, Lightbulb } from 'lucide-react';
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
            <div className={styles.authLeft}>
                <div className={styles.authLeftContent}>
                    <h1>Join <span style={{ color: 'rgba(255,255,255,0.9)' }}>Bharat Xcelerate</span> for free</h1>
                    <p>Create your account, choose your role, and start building your proof-of-work journey today.</p>
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
                    <h2>Create your account</h2>
                    <p className={styles.authSubtitle}>Choose your role and get started in 30 seconds.</p>

                    {/* Role Selection */}
                    <div className={styles.roleSelection}>
                        {roles.map((role) => (
                            <div key={role.id} className={`${styles.roleCard} ${selectedRole === role.id ? styles.roleCardActive : ''}`} onClick={() => setSelectedRole(role.id)}>
                                <div className={styles.roleIcon}><role.icon size={22} /></div>
                                <h4>{role.label}</h4>
                                <p>{role.desc}</p>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSignup}>
                        <div className={styles.inputGroup}>
                            <label>Full Name</label>
                            <div className={styles.inputWrapper}>
                                <User size={18} className={styles.inputIcon} />
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
                                <Mail size={18} className={styles.inputIcon} />
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
                                <Lock size={18} className={styles.inputIcon} />
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
                            <label className={styles.checkbox}><input type="checkbox" required /> I agree to the <Link href="/terms" style={{ color: 'var(--color-primary)' }}>Terms of Service</Link></label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className={styles.divider}><span>or</span></div>
                    <button className={styles.socialBtn}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                        Continue with Google
                    </button>
                    <p className={styles.authSwitch}>Already have an account? <Link href="/login">Log in</Link></p>
                </motion.div>
            </div>
        </div>
    );
}
