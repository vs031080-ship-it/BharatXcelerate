'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Award, Lightbulb, User, Settings, LogOut, Menu, X, Bell, Search, ChevronDown, Bookmark, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import styles from './dashboard.module.css';

const sidebarLinks = {
    student: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/student' },
        { icon: Compass, label: 'Explore Projects', href: '/dashboard/student/explore' },
        { icon: FolderKanban, label: 'My Projects', href: '/dashboard/student/projects' },
        { icon: Award, label: 'My Scorecard', href: '/dashboard/student/scorecard' },
        { icon: Lightbulb, label: 'Idea Lab', href: '/dashboard/student/ideas' },
        { icon: User, label: 'Profile', href: '/dashboard/student/profile' },
        { icon: Settings, label: 'Settings', href: '/dashboard/student/settings' },
    ],
    company: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/company' },
        { icon: Search, label: 'Find Talent', href: '/dashboard/company/talent' },
        { icon: Bookmark, label: 'Shortlisted', href: '/dashboard/company/shortlist' },
        { icon: User, label: 'Company Profile', href: '/dashboard/company/profile' },
        { icon: Settings, label: 'Settings', href: '/dashboard/company/settings' },
    ],
    investor: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/investor' },
        { icon: Lightbulb, label: 'Explore Ideas', href: '/dashboard/investor/explore' },
        { icon: Award, label: 'My Portfolio', href: '/dashboard/investor/portfolio' },
        { icon: User, label: 'Investor Profile', href: '/dashboard/investor/profile' },
        { icon: Settings, label: 'Settings', href: '/dashboard/investor/settings' },
    ],
};

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();
    // Determine role based on URL for demo purposes. In real app, comes from Auth context.
    const role = pathname.includes('/company') ? 'company' : pathname.includes('/investor') ? 'investor' : 'student';
    const links = sidebarLinks[role] || sidebarLinks.student;

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className={styles.dashboardContainer}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed} ${mobileOpen ? styles.mobileSidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoPrimary}>Bharat</span>
                        {sidebarOpen && <span className={styles.logoAccent}>Xcelerate</span>}
                    </Link>
                    <button className={styles.collapseBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                                <link.icon size={22} />
                                {sidebarOpen && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={`${styles.navItem} ${styles.logoutBtn}`} onClick={() => { logout(); router.push('/login'); }}>
                        <LogOut size={22} />
                        {sidebarOpen && <span>Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Topbar */}
                <header className={styles.topbar}>
                    <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}><Menu size={24} /></button>
                    <h2 className={styles.pageTitle}>Dashboard</h2>

                    <div className={styles.topbarActions}>
                        <div className={styles.searchWrapper}>
                            <Search size={18} />
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button className={styles.iconBtn}><Bell size={20} /><span className={styles.badge}>2</span></button>
                        <div className={styles.userMenu}>
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" alt="User" />
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>Arjun Sharma</span>
                                <span className={styles.userRole}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className={styles.pageInner}>
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}
        </div>
    );
}
