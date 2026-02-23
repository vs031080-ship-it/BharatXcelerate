'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    const hideNavFooter = isDashboard || isAuthPage;

    return (
        <>
            {!hideNavFooter && <Navbar />}
            <div style={!hideNavFooter ? { paddingTop: 'var(--nav-height)' } : {}}>
                {children}
            </div>
            {!hideNavFooter && <Footer />}
        </>
    );
}
