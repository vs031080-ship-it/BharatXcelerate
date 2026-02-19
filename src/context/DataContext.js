'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuthHeaders } from './AuthContext';

const DataContext = createContext();

// --- Fallback Mock Data (used when API is unavailable) ---
const fallbackJobs = [
    { id: 'job-1', title: 'Senior Full Stack Developer', type: 'Full-time', location: 'Mumbai', salary: '₹18-25 LPA', company: 'TechNova Solutions', description: 'Build scalable enterprise applications using React, Node.js, and AWS.', skills: ['React', 'Node.js', 'AWS', 'PostgreSQL'], postedDate: 'Feb 10, 2026', applicants: [] },
    { id: 'job-2', title: 'Data Science Intern', type: 'Internship', location: 'Remote', salary: '₹25,000/month', company: 'TechNova Solutions', description: 'Work on ML models for customer behavior prediction.', skills: ['Python', 'TensorFlow', 'SQL', 'Pandas'], postedDate: 'Feb 5, 2026', applicants: [] },
    { id: 'job-3', title: 'Blockchain Developer', type: 'Contract', location: 'Bangalore', salary: '₹12-18 LPA', company: 'TechNova Solutions', description: 'Develop and audit smart contracts on Ethereum.', skills: ['Solidity', 'Web3.js', 'Rust', 'React'], postedDate: 'Jan 28, 2026', applicants: [] },
    { id: 'job-4', title: 'UI/UX Designer', type: 'Full-time', location: 'Delhi', salary: '₹10-15 LPA', company: 'DesignHub India', description: 'Design intuitive user interfaces for SaaS products.', skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'], postedDate: 'Feb 14, 2026', applicants: [] },
    { id: 'job-5', title: 'DevOps Engineer', type: 'Full-time', location: 'Pune', salary: '₹15-22 LPA', company: 'CloudScale Tech', description: 'Manage CI/CD pipelines and container orchestration.', skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'], postedDate: 'Feb 12, 2026', applicants: [] },
];

const fallbackIdeas = [
    { id: 'idea-1', title: 'AI-Powered Career Counselor', category: 'AI/ML', stage: 'Prototype', likes: [], description: 'An intelligent chatbot for personalized career guidance.', tags: ['NLP', 'Career', 'ML'], author: 'Arjun Sharma', teamSize: 3, createdAt: '2 days ago' },
    { id: 'idea-2', title: 'GreenChain — Carbon Credit NFTs', category: 'Blockchain', stage: 'Idea', likes: [], description: 'Tokenize carbon credits as NFTs for peer-to-peer trading.', tags: ['Web3', 'Sustainability'], author: 'Arjun Sharma', teamSize: 2, createdAt: '1 week ago' },
    { id: 'idea-3', title: 'MedTrack — Patient Compliance', category: 'HealthTech', stage: 'MVP', likes: [], description: 'Gamified app helping patients stick to medication schedules.', tags: ['Mobile', 'Healthcare'], author: 'Arjun Sharma', teamSize: 4, createdAt: '3 weeks ago' },
];

const fallbackShortlist = [
    { id: 'sl-1', candidateId: 1, candidateName: 'Rahul Desai', role: 'Full Stack Developer', score: 920, projects: 12, skills: ['React', 'Node.js', 'AWS'], location: 'Mumbai', status: 'Interview Scheduled', shortlistedDate: 'Feb 10, 2026', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
    { id: 'sl-2', candidateId: 2, candidateName: 'Ananya Singh', role: 'Data Scientist', score: 890, projects: 8, skills: ['Python', 'TensorFlow', 'SQL'], location: 'Bangalore', status: 'New', shortlistedDate: 'Feb 14, 2026', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
];

export function DataProvider({ children }) {
    const [jobs, setJobs] = useState(fallbackJobs);
    const [ideas, setIdeas] = useState(fallbackIdeas);
    const [shortlist, setShortlist] = useState(fallbackShortlist);
    const [applications, setApplications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [apiAvailable, setApiAvailable] = useState(false);

    // Load data from API on mount
    useEffect(() => {
        const loadData = async () => {
            // Fetch jobs (critical for some pages)
            try {
                const jobsRes = await fetch('/api/jobs');
                if (jobsRes.ok) {
                    const data = await jobsRes.json();
                    if (data.jobs?.length > 0) setJobs(data.jobs);
                    setApiAvailable(true);
                }
            } catch (e) { console.warn('Failed to load jobs:', e); }

            // Fetch other data in background without blocking
            const headers = getAuthHeaders();

            fetch('/api/ideas').then(res => res.ok && res.json()).then(data => {
                if (data?.ideas?.length > 0) setIdeas(data.ideas);
            }).catch(() => { });

            fetch('/api/shortlist').then(res => res.ok && res.json()).then(data => {
                if (data?.shortlist?.length > 0) setShortlist(data.shortlist);
            }).catch(() => { });

            if (headers.Authorization) {
                fetch('/api/notifications', { headers }).then(res => res.ok && res.json()).then(data => {
                    setNotifications(data.notifications || []);
                }).catch(() => { });
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
        jobs, ideas, shortlist, applications, notifications,
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
