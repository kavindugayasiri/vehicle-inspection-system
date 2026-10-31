import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.error('Could not restore the saved user session.', error);
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const loginUser = (userData, accessToken) => {
        if (!accessToken || !userData?.email || !userData?.role) {
            throw new Error('The server returned an incomplete login response.');
        }
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = useMemo(() => ({ user, token, loginUser, logoutUser }), [user, token]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider.');
    return context;
}
