'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, ClipboardList, Award, CheckCircle, Briefcase, Zap } from 'lucide-react';
import styles from './OnboardingWalkthrough.module.css';

const STEPS = [
    {
        icon: <Zap size={32} color="#6366f1" />,
        title: "Welcome to BharatXcelerate! 🚀",
        body: "You've completed your profile. Now it's time to prove your skills and get discovered by top companies.",
    },
    {
        icon: <ClipboardList size={32} color="#3b82f6" />,
        title: "Take MCQ Skill Assessments",
        body: "Go to the Exams section and attempt tests in your chosen tech skills. Each test has 50 questions and a 2-hour timer.",
    },
    {
        icon: <Award size={32} color="#f59e0b" />,
        title: "Earn Verified Badges 🏅",
        body: "Score 40+ out of 100 to pass a test and earn an official badge for that skill and level. Badges are shown on your profile.",
    },
    {
        icon: <CheckCircle size={32} color="#10b981" />,
        title: "Build Your Scorecard",
        body: "Every test result — pass or fail — contributes to your verified Scorecard. Companies can see your skill-level scores and overall average.",
    },
    {
        icon: <Briefcase size={32} color="#8b5cf6" />,
        title: "Get Discovered by Companies",
        body: "Companies filter candidates by skill, level, and score on our platform. Higher scores = more visibility. Go ace those tests!",
    },
];

export default function OnboardingWalkthrough({ onDismiss }) {
    const [step, setStep] = useState(0);

    function handleNext() {
        if (step < STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            onDismiss();
        }
    }

    const current = STEPS[step];

    return (
        <div className={styles.overlay}>
            <motion.div
                className={styles.card}
                key={step}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <button className={styles.skipBtn} onClick={onDismiss}><X size={16} /></button>

                {/* Progress dots */}
                <div className={styles.dots}>
                    {STEPS.map((_, i) => (
                        <div key={i} className={`${styles.dot} ${i === step ? styles.dotActive : i < step ? styles.dotDone : ''}`} onClick={() => setStep(i)} />
                    ))}
                </div>

                <div className={styles.iconWrap}>{current.icon}</div>
                <h2 className={styles.title}>{current.title}</h2>
                <p className={styles.body}>{current.body}</p>

                <button className={styles.nextBtn} onClick={handleNext}>
                    {step < STEPS.length - 1 ? <>Next <ChevronRight size={16} /></> : "Let's Go! 🚀"}
                </button>

                <p className={styles.stepLabel}>Step {step + 1} of {STEPS.length}</p>
            </motion.div>
        </div>
    );
}
