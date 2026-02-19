'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

    return (
        <>
            {!isDashboard && <Navbar />}
            <div style={!isDashboard ? { paddingTop: 'var(--nav-height)' } : {}}>
                {children}
            </div>
            {!isDashboard && <Footer />}
        </>
    );
}
