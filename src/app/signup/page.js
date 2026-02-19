'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight, ArrowLeft,
    Users, Briefcase, Lightbulb, CheckCircle, XCircle, Shield,
    Sparkles, Loader2, Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './signup.module.css';

const roles = [
    {
        id: 'student',
        icon: Users,
        label: 'Student',
        desc: 'Build your portfolio, accept projects, earn XP, and get hired by top companies.',
        gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        features: ['Accept real projects', 'Earn XP & badges', 'Get hired'],
    },
    {
        id: 'company',
        icon: Briefcase,
        label: 'Company',
        desc: 'Post projects, discover verified student talent, and build your dream team.',
        gradient: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
        features: ['Post projects', 'Browse talent', 'Hire directly'],
    },
    {
        id: 'investor',
        icon: Lightbulb,
        label: 'Investor',
        desc: 'Discover innovative student ideas and invest in the next generation of founders.',
        gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
        features: ['Browse ideas', 'Track portfolios', 'Invest early'],
    },
];

const passwordRules = [
    { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { id: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { id: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
    { id: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
    { id: 'special', label: 'One special character (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pendingMessage, setPendingMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const { signup } = useAuth();
    const router = useRouter();

    // Password strength calculations
    const passedRules = useMemo(() => passwordRules.map(r => r.test(password)), [password]);
    const strengthScore = useMemo(() => passedRules.filter(Boolean).length, [passedRules]);
    const strengthLabel = useMemo(() => {
        if (password.length === 0) return '';
        if (strengthScore <= 1) return 'Very Weak';
        if (strengthScore === 2) return 'Weak';
        if (strengthScore === 3) return 'Fair';
        if (strengthScore === 4) return 'Strong';
        return 'Excellent';
    }, [password, strengthScore]);
    const strengthColor = useMemo(() => {
        if (strengthScore <= 1) return '#EF4444';
        if (strengthScore === 2) return '#F59E0B';
        if (strengthScore === 3) return '#EAB308';
        if (strengthScore === 4) return '#22C55E';
        return '#10B981';
    }, [strengthScore]);

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    // Step validation
    const canProceedStep1 = selectedRole !== '';
    const canProceedStep2 = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const canSubmit = strengthScore >= 3 && passwordsMatch && agreeTerms;

    const validateStep2 = () => {
        const errs = {};
        if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const goNext = () => {
        if (step === 2 && !validateStep2()) return;
        setError('');
        setStep(s => Math.min(s + 1, 3));
    };

    const goBack = () => {
        setError('');
        setFieldErrors({});
        setStep(s => Math.max(s - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        setError('');
        setPendingMessage('');
        try {
            const result = await signup({ name: name.trim(), email: email.trim().toLowerCase(), password, role: selectedRole });
            if (result.pending) {
                setPendingMessage(result.message || 'Your account has been submitted for verification.');
            } else if (result.success) {
                if (selectedRole === 'company') router.push('/dashboard/company');
                else if (selectedRole === 'investor') router.push('/dashboard/investor');
                else router.push('/dashboard/student');
            }
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const stepVariants = {
        enter: { opacity: 0, x: 40 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
    };

    return (
        <div className={styles.page}>
            {/* Animated Background Orbs */}
            <div className={styles.bgOrbs}>
                <div className={styles.orb1} />
                <div className={styles.orb2} />
                <div className={styles.orb3} />
            </div>

            <div className={styles.container}>
                {/* Logo + Progress */}
                <div className={styles.topBar}>
                    <Link href="/" className={styles.logo}>
                        <Zap size={22} /> BharatXcelerate
                    </Link>
                    <div className={styles.stepIndicator}>
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`${styles.stepDot} ${step >= s ? styles.stepDotActive : ''} ${step === s ? styles.stepDotCurrent : ''}`}>
                                {step > s ? <Check size={12} /> : s}
                            </div>
                        ))}
                        <div className={styles.stepBar}>
                            <motion.div className={styles.stepBarFill} animate={{ width: `${((step - 1) / 2) * 100}%` }} transition={{ duration: 0.4, ease: 'easeInOut' }} />
                        </div>
                    </div>
                </div>

                {/* Pending Message */}
                {pendingMessage && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={styles.pendingBanner}>
                        <Shield size={20} />
                        <div>
                            <strong>Account Submitted for Verification!</strong>
                            <p>{pendingMessage}</p>
                        </div>
                    </motion.div>
                )}

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <Sparkles size={28} className={styles.stepIcon} />
                                <h1>Join BharatXcelerate</h1>
                                <p>Choose how you want to use the platform</p>
                            </div>

                            <div className={styles.roleGrid}>
                                {roles.map((role) => {
                                    const Icon = role.icon;
                                    const isSelected = selectedRole === role.id;
                                    return (
                                        <motion.div
                                            key={role.id}
                                            className={`${styles.roleCard} ${isSelected ? styles.roleCardActive : ''}`}
                                            onClick={() => setSelectedRole(role.id)}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={styles.roleCardIcon} style={{ background: role.gradient }}>
                                                <Icon size={24} color="#fff" />
                                            </div>
                                            <h3>{role.label}</h3>
                                            <p>{role.desc}</p>
                                            <ul className={styles.roleFeatures}>
                                                {role.features.map((f, i) => (
                                                    <li key={i}><CheckCircle size={13} /> {f}</li>
                                                ))}
                                            </ul>
                                            {isSelected && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={styles.roleCheck}>
                                                    <Check size={16} />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className={styles.stepActions}>
                                <button className={styles.nextBtn} onClick={goNext} disabled={!canProceedStep1}>
                                    Continue <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <User size={28} className={styles.stepIcon} />
                                <h1>Your Details</h1>
                                <p>Tell us about yourself — this is how others will see you</p>
                            </div>

                            <div className={styles.formCard}>
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="name">Full Name</label>
                                    <div className={`${styles.inputWrap} ${fieldErrors.name ? styles.inputError : ''}`}>
                                        <User size={18} className={styles.inputIcon} />
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="e.g. Arjun Sharma"
                                            value={name}
                                            onChange={e => { setName(e.target.value); setFieldErrors(f => ({ ...f, name: '' })); }}
                                            autoFocus
                                        />
                                        {name.trim().length >= 2 && <CheckCircle size={16} className={styles.inputValid} />}
                                    </div>
                                    {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="email">Email Address</label>
                                    <div className={`${styles.inputWrap} ${fieldErrors.email ? styles.inputError : ''}`}>
                                        <Mail size={18} className={styles.inputIcon} />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder={selectedRole === 'company' ? 'you@company.com' : 'you@example.com'}
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); setFieldErrors(f => ({ ...f, email: '' })); }}
                                        />
                                        {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && <CheckCircle size={16} className={styles.inputValid} />}
                                    </div>
                                    {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
                                </div>

                                {selectedRole === 'company' && (
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor="companyNote">Note</label>
                                        <div className={styles.infoNote}>
                                            <Shield size={14} /> Company accounts require admin verification before access is granted.
                                        </div>
                                    </div>
                                )}
                                {selectedRole === 'investor' && (
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor="investorNote">Note</label>
                                        <div className={styles.infoNote}>
                                            <Shield size={14} /> Investor accounts require admin verification before access is granted.
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.stepActions}>
                                <button className={styles.backBtn} onClick={goBack}>
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <button className={styles.nextBtn} onClick={goNext} disabled={!canProceedStep2}>
                                    Continue <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <Lock size={28} className={styles.stepIcon} />
                                <h1>Secure Your Account</h1>
                                <p>Create a strong password to protect your account</p>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.formCard}>
                                {/* Password */}
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="password">Password</label>
                                    <div className={styles.inputWrap}>
                                        <Lock size={18} className={styles.inputIcon} />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Create a strong password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            autoFocus
                                        />
                                        <button type="button" className={styles.togglePw} onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Strength Meter */}
                                {password.length > 0 && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={styles.strengthBlock}>
                                        <div className={styles.strengthBar}>
                                            <motion.div
                                                className={styles.strengthFill}
                                                animate={{ width: `${(strengthScore / 5) * 100}%`, backgroundColor: strengthColor }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                        <span className={styles.strengthLabel} style={{ color: strengthColor }}>{strengthLabel}</span>

                                        <ul className={styles.rulesList}>
                                            {passwordRules.map((rule, i) => (
                                                <li key={rule.id} className={passedRules[i] ? styles.rulePassed : styles.ruleFailed}>
                                                    {passedRules[i] ? <CheckCircle size={13} /> : <XCircle size={13} />}
                                                    {rule.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {/* Confirm Password */}
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className={`${styles.inputWrap} ${passwordsMismatch ? styles.inputError : ''}`}>
                                        <Lock size={18} className={styles.inputIcon} />
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Re-enter your password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                        <button type="button" className={styles.togglePw} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        {passwordsMatch && <CheckCircle size={16} className={styles.inputValid} />}
                                    </div>
                                    {passwordsMismatch && <span className={styles.fieldError}>Passwords do not match</span>}
                                </div>

                                {/* Terms */}
                                <label className={styles.termsRow}>
                                    <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
                                    <span>I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link></span>
                                </label>

                                {/* Error */}
                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.errorBanner}>
                                        <XCircle size={16} /> {error}
                                    </motion.div>
                                )}

                                {/* Submit */}
                                <div className={styles.stepActions}>
                                    <button type="button" className={styles.backBtn} onClick={goBack}>
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <button type="submit" className={styles.submitBtn} disabled={!canSubmit || loading}>
                                        {loading ? (
                                            <><Loader2 size={16} className={styles.spin} /> Creating Account...</>
                                        ) : (
                                            <><Sparkles size={16} /> Create Account</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <div className={styles.footer}>
                    Already have an account? <Link href="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
}
