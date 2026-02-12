'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for logged in user on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock simple validation
                // Use the provided role, or fallback to student if somehow missing
                const resolvedRole = role || 'student';

                const newUser = { email, role: resolvedRole, name: 'Test User' };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                resolve({ success: true, user: newUser });
            }, 1000);
        });
    };

    const signup = async (userData) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = { ...userData, name: userData.name || 'New User' };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                resolve({ success: true, user: newUser });
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
