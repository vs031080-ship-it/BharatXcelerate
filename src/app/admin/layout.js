'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, FolderKanban, LogOut, Shield, ChevronLeft, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/submissions', label: 'Submissions', icon: FileText },
];

export default function AdminLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') {
        return (
            <div className={styles.loadingScreen}>
                <Shield size={40} className={styles.loadingIcon} />
                <p>Verifying admin access...</p>
            </div>
        );
    }

    return (
        <div className={styles.layout}>
            <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Shield size={22} />
                    {!sidebarCollapsed && <span>Admin Panel</span>}
                    <button className={styles.collapseBtn} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                        <ChevronLeft size={16} style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none' }} />
                    </button>
                </div>
                <nav className={styles.nav}>
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}>
                            <item.icon size={20} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>
                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={logout}>
                        <LogOut size={18} />
                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
