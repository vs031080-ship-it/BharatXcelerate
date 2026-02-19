'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Award, Lightbulb, User, Settings, LogOut, Menu, X, Bell, Search, ChevronDown, Bookmark, Compass, Briefcase, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import styles from './dashboard.module.css';

const sidebarLinks = {
    student: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/student' },
        { icon: Compass, label: 'Explore Projects', href: '/dashboard/student/explore' },
        { icon: FolderKanban, label: 'My Projects', href: '/dashboard/student/projects' },
        { icon: Briefcase, label: 'Jobs', href: '/dashboard/student/jobs' },
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

import Fuse from 'fuse.js';

// ... (existing imports)

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const { notifications, getUnreadCount, markNotificationRead, markAllNotificationsRead } = useData();
    const role = pathname.includes('/company') ? 'company' : pathname.includes('/investor') ? 'investor' : 'student';
    const links = sidebarLinks[role] || sidebarLinks.student;

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Refs for click outside
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event) {
            if (notifOpen && notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
            if (profileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notifOpen, profileOpen]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const unreadCount = getUnreadCount(role);
    const roleNotifications = notifications.filter(n => n.forRole === role).slice(0, 10);

    // Fuzzy Search
    const fuse = useMemo(() => {
        if (links && links.length > 0) {
            try {
                return new Fuse(links, {
                    keys: ['label'],
                    threshold: 0.4,
                });
            } catch (e) {
                console.error('Fuse init error:', e);
                return null;
            }
        }
        return null;
    }, [links]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim()) {
            if (fuse) {
                const results = fuse.search(query).map(result => result.item);
                setSearchResults(results);
            } else {
                // Fallback
                const results = links.filter(link => link.label.toLowerCase().includes(query.toLowerCase()));
                setSearchResults(results);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSearchResultClick = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* ... Sidebar ... */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed} ${mobileOpen ? styles.mobileSidebarOpen : ''}`}>
                {/* ... (keep existing sidebar code) ... */}
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
                        <div className={styles.searchWrapper} style={{ position: 'relative' }}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {searchResults.length > 0 && (
                                    <motion.div
                                        className={styles.searchResults}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background: 'white',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            marginTop: '8px',
                                            zIndex: 100,
                                            padding: '8px',
                                            border: '1px solid #e2e8f0'
                                        }}
                                    >
                                        {searchResults.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={styles.searchResultItem}
                                                onClick={handleSearchResultClick}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '8px 12px',
                                                    color: '#1e293b',
                                                    textDecoration: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <link.icon size={16} color="#64748b" />
                                                {link.label}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Notifications */}
                        <div style={{ position: 'relative' }} ref={notifRef}>
                            <button className={styles.iconBtn} onClick={() => setNotifOpen(!notifOpen)}>
                                <Bell size={20} />
                                <span className={styles.badge}>{unreadCount}</span>
                            </button>

                            {/* Notification Dropdown */}
                            <AnimatePresence>
                                {notifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={styles.notifDropdown}
                                    >
                                        <div className={styles.notifHeader}>
                                            <h4>Notifications</h4>
                                            {unreadCount > 0 && (
                                                <button className={styles.markAllRead} onClick={() => markAllNotificationsRead(role)}>
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className={styles.notifList}>
                                            {roleNotifications.length === 0 ? (
                                                <div className={styles.notifEmpty}>No notifications yet</div>
                                            ) : (
                                                roleNotifications.map(n => (
                                                    <div
                                                        key={n.id}
                                                        className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}
                                                        onClick={() => { markNotificationRead(n.id); }}
                                                    >
                                                        <div className={styles.notifDot}>{!n.read && <span />}</div>
                                                        <div className={styles.notifContent}>
                                                            <p>{n.message}</p>
                                                            <span>{new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        {/* Profile Dropdown */}
                        <div style={{ position: 'relative' }} ref={profileRef}>
                            <div
                                className={styles.userMenu}
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" alt="User" />
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{user?.name || (role === 'student' ? 'Student' : role === 'company' ? 'Company' : 'Investor')}</span>
                                    <span className={styles.userRole}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                                </div>
                                <ChevronDown size={16} />
                            </div>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{
                                            position: 'absolute',
                                            top: '120%',
                                            right: 0,
                                            width: '200px',
                                            background: 'white',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                            border: '1px solid #e2e8f0',
                                            padding: '8px',
                                            zIndex: 100
                                        }}
                                    >
                                        <Link href={`/dashboard/${role}/profile`} className={styles.dropdownItem} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                            color: '#1e293b', textDecoration: 'none', borderRadius: '8px', fontSize: '0.9rem',
                                            transition: 'background 0.2s', cursor: 'pointer'
                                        }} onClick={() => setProfileOpen(false)}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <User size={18} /> Profile
                                        </Link>
                                        <Link href={`/dashboard/${role}/settings`} className={styles.dropdownItem} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                            color: '#1e293b', textDecoration: 'none', borderRadius: '8px', fontSize: '0.9rem',
                                            transition: 'background 0.2s', cursor: 'pointer'
                                        }} onClick={() => setProfileOpen(false)}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <Settings size={18} /> Settings
                                        </Link>
                                        <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />
                                        <button onClick={() => { logout(); router.push('/login'); }} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                            color: '#ef4444', background: 'none', border: 'none', width: '100%',
                                            borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                                            transition: 'background 0.2s'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <LogOut size={18} /> Log Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className={styles.pageInner}>
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

            {/* Close Dropdowns on outside click - REMOVED */}
        </div >
    );
}
