import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function routeForRole(role) {
    if (role === 'ADMIN') return '/admin';
    if (role === 'INSPECTOR') return '/dashboard';
    return '/';
}

export default function LoginPage() {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            const user = { email: data.email, role: data.role, fullName: data.fullName };
            loginUser(user, data.token);
            const requestedPath = location.state?.from;
            navigate(requestedPath || routeForRole(data.role), { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <section style={styles.card}>
                <div style={styles.brandIcon} aria-hidden="true">🚘</div>
                <p style={styles.eyebrow}>VEHICLE INSPECTION PLATFORM</p>
                <h1 style={styles.title}>Welcome back</h1>
                <p style={styles.subtitle}>Sign in to manage inspections and vehicle requests.</p>
                {error && <p role="alert" style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Email address
                        <input type="email" autoComplete="email" required style={styles.input} placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                    </label>
                    <label style={styles.label}>Password
                        <input type="password" autoComplete="current-password" required style={styles.input} placeholder="Enter your password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                    </label>
                    <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Signing in…' : 'Sign in'}</button>
                </form>
                <p style={styles.footer}>New to VehicleInspect? <Link to="/register" style={styles.link}>Create an account</Link></p>
            </section>
        </div>
    );
}

const styles = {
    page: { minHeight: 'calc(100vh - 64px)', display: 'grid', placeItems: 'center', padding: 24, background: 'linear-gradient(135deg, #eef2ff, #f8fafc)' },
    card: { width: '100%', maxWidth: 430, boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '38px 36px', boxShadow: '0 20px 50px #17255412' },
    brandIcon: { fontSize: 38, marginBottom: 8 },
    eyebrow: { color: '#3949ab', fontSize: 11, letterSpacing: 1.4, fontWeight: 800, margin: '0 0 8px' },
    title: { color: '#172554', margin: 0, fontSize: 30 },
    subtitle: { color: '#64748b', lineHeight: 1.5, margin: '9px 0 24px' },
    label: { display: 'grid', gap: 7, color: '#334155', fontWeight: 700, fontSize: 13, marginBottom: 17 },
    input: { padding: '12px 13px', border: '1px solid #cbd5e1', borderRadius: 8, font: 'inherit', fontWeight: 400, boxSizing: 'border-box', width: '100%' },
    button: { width: '100%', padding: 13, border: 0, borderRadius: 8, color: '#fff', background: '#1a237e', fontSize: 15, fontWeight: 800, cursor: 'pointer' },
    error: { color: '#b91c1c', background: '#fee2e2', borderRadius: 8, padding: 11, fontSize: 14, lineHeight: 1.5 },
    footer: { textAlign: 'center', color: '#64748b', fontSize: 14, margin: '22px 0 0' },
    link: { color: '#283593', fontWeight: 700, textDecoration: 'none' },
};
