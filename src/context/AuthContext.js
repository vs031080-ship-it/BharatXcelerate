'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

function getToken() {
    if (typeof window === 'undefined') return null;
    // Check cookie
    const match = document.cookie.match(/token=([^;]+)/);
    if (match) return match[1];
    // Check localStorage fallback
    return localStorage.getItem('bx_token');
}

function setToken(token) {
    if (typeof window === 'undefined') return;
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    localStorage.setItem('bx_token', token);
}

function clearToken() {
    if (typeof window === 'undefined') return;
    document.cookie = 'token=; path=/; max-age=0';
    localStorage.removeItem('bx_token');
    localStorage.removeItem('user');
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    // Also store in localStorage for fast hydration
                    localStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    clearToken();
                }
            } catch {
                // API not available, try localStorage fallback
                const stored = localStorage.getItem('user');
                if (stored) {
                    try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password, role) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Login failed');
        }

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
    };

    const signup = async (userData) => {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Signup failed');
        }

        // Account is pending verification (company/investor)
        if (data.pending) {
            return { success: true, pending: true, message: data.message };
        }

        // Student — auto-login
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
    };

    const logout = () => {
        setUser(null);
        clearToken();
        router.push('/login');
    };

    const updateUser = (updates) => {
        setUser(prev => ({ ...prev, ...updates }));
        const current = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...current, ...updates }));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, getToken }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

// Helper for API calls
export function getAuthHeaders() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}
