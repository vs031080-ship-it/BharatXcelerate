'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, Award, TrendingUp, ArrowRight, Star, Users, Briefcase, Lightbulb, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

/* ============================================
   DATA
   ============================================ */

const categories = [
  'All', 'Artificial Intelligence', 'Web Development', 'Data Science',
  'Mobile Apps', 'Cloud Computing', 'Cybersecurity', 'Blockchain',
];

const projects = [
  { id: 1, title: 'AI-Powered Resume Screener', domain: 'Artificial Intelligence', difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop' },
  { id: 2, title: 'E-Commerce Platform with React', domain: 'Web Development', difficulty: 'Beginner', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=250&fit=crop' },
  { id: 3, title: 'Real-Time Stock Dashboard', domain: 'Data Science', difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop' },
  { id: 4, title: 'Cross-Platform Chat App', domain: 'Mobile Apps', difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=250&fit=crop' },
  { id: 5, title: 'Serverless API on AWS', domain: 'Cloud Computing', difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop' },
  { id: 6, title: 'Network Intrusion Detector', domain: 'Cybersecurity', difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop' },
  { id: 7, title: 'NFT Marketplace DApp', domain: 'Blockchain', difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop' },
  { id: 8, title: 'Sentiment Analysis Engine', domain: 'Artificial Intelligence', difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop' },
  { id: 9, title: 'Portfolio Website Builder', domain: 'Web Development', difficulty: 'Beginner', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop' },
  { id: 10, title: 'Predictive Analytics Tool', domain: 'Data Science', difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop' },
  { id: 11, title: 'Fitness Tracker App', domain: 'Mobile Apps', difficulty: 'Beginner', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop' },
  { id: 12, title: 'Smart Contract Auditor', domain: 'Blockchain', difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=250&fit=crop' },
];

const stats = [
  { number: '100+', label: 'Real-World Projects', icon: Briefcase },
  { number: '10K+', label: 'Students Registered', icon: Users },
  { number: '500+', label: 'Companies Hiring', icon: TrendingUp },
  { number: '200+', label: 'Investor Partners', icon: Lightbulb },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Student • IIT Delhi',
    quote: 'Bharat Xcelerate helped me build a real portfolio that got me hired at a top startup. The scorecard concept is brilliant!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Rajesh Mehta',
    role: 'CTO • TechFlow Solutions',
    quote: 'We reduced our hiring time by 60%. The verified scorecards give us confidence in every candidate we shortlist.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Ananya Iyer',
    role: 'Angel Investor',
    quote: 'I discovered three incredible student ideas on the platform. One of them is now a funded startup. This is the future of innovation.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
  },
];

const dynamicRoles = [
  {
    id: 'student',
    typing: 'a Student',
    title: 'For Students',
    description: 'Build a verified proof-of-work portfolio that speaks louder than any resume. Execute real-world projects and get discovered by top companies.',
    steps: [
      'Sign up & explore 100+ projects',
      'Execute and submit your work',
      'Build your verified Scorecard',
      'Get discovered by companies'
    ],
    color: 'var(--color-primary)',
    bg: '#eff6ff',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      'https://images.unsplash.com/photo-1523240715638-75fbd3091934?w=800&q=80'
    ]
  },
  {
    id: 'company',
    typing: 'a Company',
    title: 'For Companies',
    description: 'Stop gambling on legacy resumes. Hire talent based on verified execution and real-world results from day one.',
    steps: [
      'Register as a hiring partner',
      'Filter students by Scorecard',
      'Review project portfolios',
      'Hire execution-ready talent'
    ],
    color: 'var(--color-secondary)',
    bg: '#f5f3ff',
    images: [
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80'
    ]
  },
  {
    id: 'investor',
    typing: 'an Investor',
    title: 'For Investors',
    description: 'Discover the next generation of builders. Invest in student ideas, provide mentorship, and fund the future of innovation.',
    steps: [
      'Get approved & set focus areas',
      'Browse student ideas',
      'Provide feedback & mentorship',
      'Fund promising innovations'
    ],
    color: 'var(--color-accent)',
    bg: '#ecfdf5',
    images: [
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
      'https://images.unsplash.com/photo-1454165833767-0270b24bda8a?w=800&q=80'
    ]
  }
];

/* ============================================
   ANIMATION VARIANTS
   ============================================ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ============================================
   HOME PAGE
   ============================================ */

const mixedStakeholders = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400',
  'https://images.unsplash.com/photo-1523240715638-75fbd3091934?q=80&w=400',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=400',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400',
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=400',
  'https://images.unsplash.com/photo-1507679799987-c7377ec486b0?q=80&w=400',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400',
  'https://images.unsplash.com/photo-1522071823991-b1ae5e6a30c8?q=80&w=400'
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const carouselRef = useRef(null);

  // Typing animation state
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentRoleText = dynamicRoles[roleIndex].typing;
      if (!isDeleting) {
        setDisplayText(currentRoleText.substring(0, displayText.length + 1));
        if (displayText === currentRoleText) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else {
          setTypingSpeed(100);
        }
      } else {
        setDisplayText(currentRoleText.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % dynamicRoles.length);
          setTypingSpeed(500);
        } else {
          setTypingSpeed(50);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, typingSpeed]);

  const currentRole = dynamicRoles[roleIndex];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.domain === activeCategory);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* ========== HERO ========== */}
      <section className={styles.hero}>
        <div className={styles.heroDecor}>
          <div className={styles.heroCircle1} />
          <div className={styles.heroCircle2} />
          <div className={styles.heroCircle3} />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            className={styles.heroContent}
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span className={styles.heroBadge} variants={fadeUp}>
              🚀 India&apos;s First Proof-of-Work Platform
            </motion.span>
            <motion.h1 className={styles.heroTitle} variants={fadeUp} custom={1}>
              Proof of Work{' '}
              <span className="gradient-text">&gt; Credentials</span>
            </motion.h1>
            <motion.p className={styles.heroSubtitle} variants={fadeUp} custom={2}>
              The unified ecosystem where Students execute real-world projects,
              Companies hire verified talent, and Investors discover innovation
              — all on one platform.
            </motion.p>
            <motion.div className={styles.heroCtas} variants={fadeUp} custom={3}>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Join for Free <ArrowRight size={18} />
              </Link>
              <Link href="/projects" className="btn btn-secondary btn-lg">
                Explore Projects
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className={styles.heroImage}
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
              alt="Students collaborating on projects"
              className={styles.heroImg}
            />
            {/* Floating Cards */}
            <motion.div
              className={styles.floatingCard}
              style={{ top: '10%', right: '-20px' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Award size={20} className="text-accent" />
              <div>
                <strong>Scorecard</strong>
                <span>Verified Skills</span>
              </div>
            </motion.div>
            <motion.div
              className={styles.floatingCard}
              style={{ bottom: '15%', left: '-30px' }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Briefcase size={20} className="text-primary" />
              <div>
                <strong>500+ Companies</strong>
                <span>Hiring Now</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className={styles.statsSection}>
        <div className={`container ${styles.statsGrid}`}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={styles.statCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={i}
            >
              <stat.icon size={28} className={styles.statIcon} />
              <h3 className={styles.statNumber}>{stat.number}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== VALUE PROPOSITION ========== */}
      <section className={`section ${styles.valueSection}`}>
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="section-label">Why Bharat Xcelerate?</span>
            <h2 className="section-title">Invest in your career through <span className="gradient-text">real execution</span></h2>
            <p className="section-subtitle">We bridge the gap between learning and doing. Here&apos;s what makes us different.</p>
          </motion.div>

          <motion.div className={styles.valueGrid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div className={styles.valueCard} variants={fadeUp}>
              <div className={`${styles.valueIcon} ${styles.valueIconBlue}`}>
                <Target size={28} />
              </div>
              <h3>Execute Real Projects</h3>
              <p>Access 100+ industry-grade projects. Build, ship, and prove your skills with real-world execution — not just theory.</p>
            </motion.div>
            <motion.div className={styles.valueCard} variants={fadeUp}>
              <div className={`${styles.valueIcon} ${styles.valueIconViolet}`}>
                <Award size={28} />
              </div>
              <h3>Earn Your Scorecard</h3>
              <p>Every completed project adds to your Bharat Xcelerate Scorecard — a verified proof-of-work that speaks louder than any resume.</p>
            </motion.div>
            <motion.div className={styles.valueCard} variants={fadeUp}>
              <div className={`${styles.valueIcon} ${styles.valueIconTeal}`}>
                <Star size={28} />
              </div>
              <h3>Get Discovered</h3>
              <p>Companies and investors actively browse the platform. Your work gets seen by the people who matter — no cold applications needed.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== FEATURED PROJECTS CAROUSEL ========== */}
      <section className={`section ${styles.projectsSection}`}>
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="section-label">Featured Projects</span>
            <h2 className="section-title">Skills to <span className="gradient-text">transform your career</span></h2>
            <p className="section-subtitle">Pick a domain, start a project, and build your proof-of-work portfolio.</p>
          </motion.div>

          {/* Category Tabs */}
          <div className={styles.categoryTabs}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryTab} ${activeCategory === cat ? styles.categoryTabActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Carousel */}
          <div className={styles.carouselWrapper}>
            <button className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`} onClick={() => scrollCarousel('left')}>
              <ChevronLeft size={20} />
            </button>
            <div className={styles.carousel} ref={carouselRef}>
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  className={styles.projectCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                >
                  <div className={styles.projectImage}>
                    <img src={project.image} alt={project.title} />
                    <span className={styles.projectDifficulty}>{project.difficulty}</span>
                  </div>
                  <div className={styles.projectInfo}>
                    <span className={styles.projectDomain}>{project.domain}</span>
                    <h4 className={styles.projectTitle}>{project.title}</h4>
                    <Link href="/login" className={`btn btn-primary btn-sm ${styles.projectBtn}`}>
                      Start Project <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className={`${styles.carouselBtn} ${styles.carouselBtnRight}`} onClick={() => scrollCarousel('right')}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* See All CTA */}
          <div className={styles.seeAllWrapper}>
            <Link href={`/projects${activeCategory !== 'All' ? `?category=${encodeURIComponent(activeCategory)}` : ''}`} className={styles.seeAllLink}>
              Explore all {activeCategory !== 'All' ? activeCategory : ''} projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.howDynamicSection}>
        <div className="container">
          <div className={styles.dynamicHeader}>
            <span className="section-label">One Platform. Infinite Growth.</span>
          </div>

          <div className={styles.dynamicGrid}>
            {/* Left Content */}
            <div className={styles.dynamicContent}>
              <div className={styles.searchBarWrapper}>
                <div className={styles.searchBar}>
                  <span className={styles.searchPrefix}>I am</span>
                  <div className={styles.typewriter}>
                    {displayText}
                    <motion.span
                      className={styles.cursor}
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >|</motion.span>
                  </div>
                </div>
              </div>

              <motion.div
                key={currentRole.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className={styles.roleDetails}
              >
                <h2 className={styles.roleTitle}>{currentRole.title}</h2>
                <p className={styles.roleDescription}>{currentRole.description}</p>

                <ul className={styles.dynamicSteps}>
                  {currentRole.steps.map((step, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <span style={{ backgroundColor: currentRole.color }}>{idx + 1}</span>
                      {step}
                    </motion.li>
                  ))}
                </ul>
                <div className={styles.roleAction}>
                  <Link
                    href={currentRole.id === 'student' ? '/for-students' : currentRole.id === 'company' ? '/for-companies' : '/for-investors'}
                    className="btn btn-primary"
                    style={{ background: currentRole.color }}
                  >
                    Get Started <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Visuals - Infinite Scroll Wall */}
            <div className={styles.dynamicVisuals}>
              <div className={styles.imageWallContainer}>
                <div className={styles.imageWallMask}></div>
                <div className={styles.imageWall}>
                  {/* Column 1 - Moving Up */}
                  <div className={styles.scrollColumnUp}>
                    {[...mixedStakeholders, ...mixedStakeholders].map((img, idx) => (
                      <div key={`up-${idx}`} className={styles.wallItem}>
                        <img src={img} alt="Stakeholder" />
                      </div>
                    ))}
                  </div>
                  {/* Column 2 - Moving Down */}
                  <div className={styles.scrollColumnDown}>
                    {[...mixedStakeholders, ...mixedStakeholders].map((img, idx) => (
                      <div key={`down-${idx}`} className={styles.wallItem}>
                        <img src={img} alt="Stakeholder" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className={`section ${styles.testimonialsSection}`}>
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="section-label">Success Stories</span>
            <h2 className="section-title">Hear from our <span className="gradient-text">community</span></h2>
          </motion.div>

          <motion.div className={styles.testimonialGrid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {testimonials.map((t, i) => (
              <motion.div key={t.name} className={styles.testimonialCard} variants={fadeUp} custom={i}>
                <Quote size={32} className={styles.quoteIcon} />
                <p className={styles.testimonialQuote}>{t.quote}</p>
                <div className={styles.testimonialAuthor}>
                  <img src={t.avatar} alt={t.name} className={styles.authorAvatar} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaDecor}>
          <div className={styles.ctaCircle1} />
          <div className={styles.ctaCircle2} />
        </div>
        <div className="container">
          <motion.div
            className={styles.ctaContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Ready to <span className="gradient-text">Xcelerate</span> your journey?</h2>
            <p>Join thousands of students, companies, and investors building the future through proof of work.</p>
            <div className={styles.ctaButtons}>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Join for Free <ArrowRight size={18} />
              </Link>
              <Link href="/how-it-works" className="btn btn-secondary btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>
                See How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
