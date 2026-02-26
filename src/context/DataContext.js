'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuthHeaders } from './AuthContext';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [jobs, setJobs] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [shortlist, setShortlist] = useState([]);
    const [applications, setApplications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiAvailable, setApiAvailable] = useState(false);

    // Load data from API on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch basic data in parallel
                const [jobsRes, ideasRes, shortlistRes] = await Promise.all([
                    fetch('/api/jobs', { cache: 'no-store' }),
                    fetch('/api/ideas', { cache: 'no-store' }),
                    fetch('/api/shortlist', { cache: 'no-store' })
                ]);

                if (jobsRes.ok) {
                    const data = await jobsRes.json();
                    setJobs(data.jobs || []);
                    setApiAvailable(true);
                }

                if (ideasRes.ok) {
                    const data = await ideasRes.json();
                    setIdeas(data.ideas || []);
                }

                if (shortlistRes.ok) {
                    const data = await shortlistRes.json();
                    setShortlist(data.shortlist || []);
                }

                // Notifications require auth headers
                const headers = getAuthHeaders();
                if (headers.Authorization) {
                    const notifRes = await fetch('/api/notifications', { headers, cache: 'no-store' });
                    if (notifRes.ok) {
                        const data = await notifRes.json();
                        setNotifications(data.notifications || []);
                    }
                }
            } catch (e) {
                console.error('Failed to load data:', e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);


    // Poll for notifications every 30 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            const headers = getAuthHeaders();
            if (headers.Authorization) {
                fetch('/api/notifications', { headers })
                    .then(res => res.ok && res.json())
                    .then(data => {
                        if (data.notifications) {
                            setNotifications(prev => {
                                // Simple check to avoid unnecessary re-renders if data matches
                                if (JSON.stringify(prev) !== JSON.stringify(data.notifications)) {
                                    return data.notifications;
                                }
                                return prev;
                            });
                        }
                    })
                    .catch(console.error);
            }
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    // --- Actions ---
    const addJob = useCallback(async (job) => {
        const newJob = { ...job, id: `job-${Date.now()}`, postedDate: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }), applicants: [] };

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(job),
            });
            if (res.ok) {
                const data = await res.json();
                setJobs(prev => [data.job || newJob, ...prev]);
                return;
            }
        } catch { /* fallback below */ }

        // Fallback: local state
        setJobs(prev => [newJob, ...prev]);
        setNotifications(prev => [{ id: `notif-${Date.now()}`, type: 'job', message: `New job posted: ${job.title}`, forRole: 'student', read: false, timestamp: Date.now() }, ...prev]);
    }, []);

    const applyToJob = useCallback(async (jobId, studentName = 'Student') => {
        try {
            const res = await fetch(`/api/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                setJobs(prev => prev.map(j => j.id === jobId || j._id === jobId ? { ...j, applicants: [...j.applicants, studentName] } : j));
                setApplications(prev => [...prev, { id: `app-${Date.now()}`, jobId, studentName, status: 'Applied' }]);
                return;
            }
        } catch { /* fallback below */ }

        // Fallback
        setApplications(prev => [...prev, { id: `app-${Date.now()}`, jobId, studentName, status: 'Applied' }]);
        setJobs(prev => prev.map(j => (j.id === jobId || j._id === jobId) ? { ...j, applicants: [...j.applicants, studentName] } : j));
        setNotifications(prev => [{ id: `notif-${Date.now()}`, type: 'application', message: `${studentName} applied to a job`, forRole: 'company', read: false, timestamp: Date.now() }, ...prev]);
    }, []);

    const submitIdea = useCallback(async (idea) => {
        try {
            const res = await fetch('/api/ideas', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(idea),
            });
            if (res.ok) {
                const data = await res.json();
                const newIdea = { ...data.idea, id: data.idea._id || `idea-${Date.now()}`, likes: [], createdAt: 'Just now' };
                setIdeas(prev => [newIdea, ...prev]);
                return;
            }
        } catch { /* fallback below */ }

        const newIdea = { ...idea, id: `idea-${Date.now()}`, likes: [], createdAt: 'Just now' };
        setIdeas(prev => [newIdea, ...prev]);
        setNotifications(prev => [{ id: `notif-${Date.now()}`, type: 'idea', message: `New idea: "${idea.title}"`, forRole: 'investor', read: false, timestamp: Date.now() }, ...prev]);
    }, []);

    const toggleLikeIdea = useCallback(async (ideaId, investorId = 'investor-1') => {
        try {
            const res = await fetch(`/api/ideas/${ideaId}/like`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setIdeas(prev => prev.map(i => (i.id === ideaId || i._id === ideaId) ? { ...i, likes: data.likes } : i));
                return;
            }
        } catch { /* fallback below */ }

        // Fallback
        setIdeas(prev => prev.map(idea => {
            if (idea.id === ideaId || idea._id === ideaId) {
                const alreadyLiked = idea.likes.includes(investorId);
                return { ...idea, likes: alreadyLiked ? idea.likes.filter(id => id !== investorId) : [...idea.likes, investorId] };
            }
            return idea;
        }));
    }, []);

    const shortlistCandidate = useCallback(async (candidate) => {
        try {
            const res = await fetch('/api/shortlist', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(candidate),
            });
            if (res.ok) {
                const data = await res.json();
                setShortlist(prev => [data.entry || { ...candidate, id: `sl-${Date.now()}`, status: 'New' }, ...prev]);
                return;
            }
        } catch { /* fallback */ }

        setShortlist(prev => {
            if (prev.find(s => s.candidateId === candidate.candidateId)) return prev;
            return [{ ...candidate, id: `sl-${Date.now()}`, status: 'New', shortlistedDate: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) }, ...prev];
        });
    }, []);

    const removeShortlist = useCallback(async (id) => {
        try {
            await fetch(`/api/shortlist?id=${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        } catch { /* ignore */ }
        setShortlist(prev => prev.filter(s => s.id !== id && s._id?.toString() !== id));
    }, []);

    const updateShortlistStatus = useCallback(async (id, status) => {
        try {
            await fetch('/api/shortlist', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ id, status }),
            });
        } catch { /* ignore */ }
        setShortlist(prev => prev.map(s => (s.id === id || s._id?.toString() === id) ? { ...s, status } : s));
    }, []);

    const addNotification = useCallback((notif) => {
        const newNotif = { ...notif, id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`, read: false, timestamp: Date.now() };
        setNotifications(prev => [newNotif, ...prev]);
    }, []);

    const markNotificationRead = useCallback(async (id) => {
        try {
            await fetch('/api/notifications', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ id }),
            });
        } catch { /* ignore */ }
        setNotifications(prev => prev.map(n => (n.id === id || n._id?.toString() === id) ? { ...n, read: true } : n));
    }, []);

    const markAllNotificationsRead = useCallback(async (role) => {
        try {
            await fetch('/api/notifications', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ markAll: true, role }),
            });
        } catch { /* ignore */ }
        setNotifications(prev => prev.map(n => n.forRole === role ? { ...n, read: true } : n));
    }, []);

    const getUnreadCount = useCallback((role) => {
        return notifications.filter(n => n.forRole === role && !n.read).length;
    }, [notifications]);

    const revokeApplication = useCallback(async (jobId, studentName = 'Student') => {
        try {
            const res = await fetch(`/api/jobs/${jobId}/apply`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                setJobs(prev => prev.map(j => (j.id === jobId || j._id === jobId) ? { ...j, applicants: j.applicants.filter(a => a !== studentName) } : j));
                setApplications(prev => prev.filter(a => a.jobId !== jobId));
                return;
            }
        } catch { /* fallback below */ }

        // Fallback
        setApplications(prev => prev.filter(a => a.jobId !== jobId));
        setJobs(prev => prev.map(j => (j.id === jobId || j._id === jobId) ? { ...j, applicants: j.applicants.filter(a => a !== studentName) } : j));
    }, []);

    const value = {
        jobs, ideas, shortlist, applications, notifications, loading,
        addJob, applyToJob, revokeApplication, submitIdea, toggleLikeIdea,
        shortlistCandidate, removeShortlist, updateShortlistStatus,
        addNotification, markNotificationRead, markAllNotificationsRead, getUnreadCount,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
