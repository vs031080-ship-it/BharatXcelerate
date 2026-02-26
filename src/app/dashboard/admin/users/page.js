'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, CheckCircle, XCircle, Shield, Clock } from 'lucide-react';
import { getAuthHeaders } from '@/context/AuthContext';
import styles from '../admin.module.css';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState('');

    const loadUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (roleFilter) params.set('role', roleFilter);
            if (statusFilter) params.set('status', statusFilter);
            const res = await fetch(`/api/admin/users?${params}`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { loadUsers(); }, [roleFilter, statusFilter]);

    const updateStatus = async (userId, status) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ userId, status }),
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, status } : u));
                setToast(`User ${status === 'verified' ? 'verified' : status === 'rejected' ? 'rejected' : 'updated'} successfully!`);
                setTimeout(() => setToast(''), 3000);
            }
        } catch (e) { console.error(e); }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': case 'verified': return styles.badgeActive;
            case 'pending': return styles.badgePending;
            case 'rejected': return styles.badgeRejected;
            default: return '';
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'student': return styles.badgeStudent;
            case 'company': return styles.badgeCompany;
            case 'investor': return styles.badgeInvestor;
            default: return '';
        }
    };

    return (
        <div>
            <AnimatePresence>
                {toast && (
                    <motion.div className={styles.toast} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <CheckCircle size={16} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.pageHeader}>
                <h1>User Management</h1>
                <p>Manage all platform users. Verify or reject company and investor accounts.</p>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchInput}>
                    <Search size={18} />
                    <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className={styles.filterSelect} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="student">Student</option>
                    <option value="company">Company</option>
                    <option value="investor">Investor</option>
                </select>
                <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className={styles.tableCard}>
                {loading ? (
                    <div className={styles.empty}><Shield size={32} /><h3>Loading users...</h3></div>
                ) : filteredUsers.length === 0 ? (
                    <div className={styles.empty}><Users size={32} /><h3>No users found</h3><p>Try changing your filters.</p></div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Registered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id}>
                                    <td style={{ fontWeight: 500, color: '#0F172A' }}>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td><span className={`${styles.badge} ${getRoleBadge(user.role)}`}>{user.role}</span></td>
                                    <td><span className={`${styles.badge} ${getStatusBadge(user.status)}`}>{user.status}</span></td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className={styles.btnGroup}>
                                            {user.status === 'pending' && (
                                                <>
                                                    <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={() => updateStatus(user._id, 'verified')}>
                                                        <CheckCircle size={14} /> Verify
                                                    </button>
                                                    <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => updateStatus(user._id, 'rejected')}>
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {user.status === 'rejected' && (
                                                <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={() => updateStatus(user._id, 'verified')}>
                                                    <CheckCircle size={14} /> Verify
                                                </button>
                                            )}
                                            {(user.status === 'active' || user.status === 'verified') && user.role !== 'student' && (
                                                <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => updateStatus(user._id, 'pending')}>
                                                    <Clock size={14} /> Suspend
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
