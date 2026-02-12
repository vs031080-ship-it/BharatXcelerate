'use client';
import { motion } from 'framer-motion';
import { Users, BookOpen, AlertCircle, CheckCircle, Database, Settings } from 'lucide-react';
import Link from 'next/link';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }) };

const stats = [
    { label: 'Total Users', value: '12,543', icon: Users, color: 'Blue' },
    { label: 'Active Projects', value: '1,205', icon: BookOpen, color: 'Purple' },
    { label: 'Pending Approvals', value: '45', icon: AlertCircle, color: 'Yellow' },
    { label: 'Verified Skills', value: '8,900', icon: CheckCircle, color: 'Green' },
];

export default function AdminDashboard() {
    return (
        <div style={{ padding: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Admin Overview</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>System status and content moderation.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {stats.map((s, i) => (
                    <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeUp} custom={i} style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{s.label}</span>
                            <strong style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</strong>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: `var(--color-${s.color.toLowerCase() === 'purple' ? 'secondary' : s.color.toLowerCase() === 'yellow' ? 'accent' : 'primary'}-50)`, color: `var(--color-${s.color.toLowerCase() === 'purple' ? 'secondary' : s.color.toLowerCase() === 'yellow' ? 'accent' : 'primary'})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <s.icon size={24} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '20px' }}>Pending Approvals</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '2px' }}>New Investor Application</h4>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Venture Capital Partners • Applied 2 hours ago</p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-outline btn-sm">Review</button>
                                    <button className="btn btn-primary btn-sm">Approve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '20px' }}>System Health</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9375rem' }}><Database size={16} /> Database</span>
                            <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.875rem' }}>Healthy</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9375rem' }}><Settings size={16} /> API Latency</span>
                            <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.875rem' }}>45ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
