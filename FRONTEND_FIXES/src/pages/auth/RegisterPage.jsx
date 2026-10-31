import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'CUSTOMER' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await api.post('/auth/register', form);
            setSuccess('Your account has been created. Redirecting you to sign in…');
            window.setTimeout(() => navigate('/login', { replace: true }), 1200);
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <section style={styles.card}>
                <div style={styles.brandIcon} aria-hidden="true">🚘</div>
                <p style={styles.eyebrow}>JOIN VEHICLEINSPECT</p>
                <h1 style={styles.title}>Create your account</h1>
                <p style={styles.subtitle}>Get connected with trusted vehicle inspection services.</p>
                {error && <p role="alert" style={styles.error}>{error}</p>}
                {success && <p role="status" style={styles.success}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Full name
                        <input required autoComplete="name" style={styles.input} placeholder="Your full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
                    </label>
                    <label style={styles.label}>Email address
                        <input required type="email" autoComplete="email" style={styles.input} placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                    </label>
                    <label style={styles.label}>Password
                        <input required type="password" autoComplete="new-password" minLength={6} style={styles.input} placeholder="At least 6 characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                    </label>
                    <label style={styles.label}>Phone number
                        <input type="tel" autoComplete="tel" style={styles.input} placeholder="077 123 4567" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                    </label>
                    <fieldset style={styles.fieldset}>
                        <legend style={styles.legend}>I want to register as</legend>
                        <div style={styles.roles}>
                            {['CUSTOMER', 'INSPECTOR'].map((role) => <label key={role} style={{ ...styles.role, ...(form.role === role ? styles.roleSelected : {}) }}>
                                <input type="radio" name="role" value={role} checked={form.role === role} onChange={() => setForm({ ...form, role })} />
                                <span>{role === 'CUSTOMER' ? 'Customer' : 'Inspector'}</span>
                            </label>)}
                        </div>
                    </fieldset>
                    <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Creating account…' : 'Create account'}</button>
                </form>
                <p style={styles.footer}>Already registered? <Link to="/login" style={styles.link}>Sign in</Link></p>
            </section>
        </div>
    );
}

const styles = {
    page: { minHeight: 'calc(100vh - 64px)', display: 'grid', placeItems: 'center', padding: 24, background: 'linear-gradient(135deg, #eef2ff, #f8fafc)' },
    card: { width: '100%', maxWidth: 480, boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '34px 36px', boxShadow: '0 20px 50px #17255412', margin: '24px 0' },
    brandIcon: { fontSize: 36, marginBottom: 8 },
    eyebrow: { color: '#3949ab', fontSize: 11, letterSpacing: 1.4, fontWeight: 800, margin: '0 0 8px' },
    title: { color: '#172554', margin: 0, fontSize: 29 },
    subtitle: { color: '#64748b', lineHeight: 1.5, margin: '9px 0 21px' },
    label: { display: 'grid', gap: 6, color: '#334155', fontWeight: 700, fontSize: 13, marginBottom: 13 },
    input: { padding: '11px 12px', border: '1px solid #cbd5e1', borderRadius: 8, font: 'inherit', fontWeight: 400, boxSizing: 'border-box', width: '100%' },
    fieldset: { padding: 0, border: 0, margin: '2px 0 17px' },
    legend: { color: '#334155', fontSize: 13, fontWeight: 700, marginBottom: 8 },
    roles: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
    role: { display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #cbd5e1', borderRadius: 8, padding: 11, color: '#475569', cursor: 'pointer', fontSize: 14 },
    roleSelected: { background: '#eef2ff', borderColor: '#3949ab', color: '#1a237e', fontWeight: 700 },
    button: { width: '100%', padding: 13, border: 0, borderRadius: 8, color: '#fff', background: '#1a237e', fontSize: 15, fontWeight: 800, cursor: 'pointer' },
    error: { color: '#b91c1c', background: '#fee2e2', borderRadius: 8, padding: 11, fontSize: 14, lineHeight: 1.5 },
    success: { color: '#166534', background: '#dcfce7', borderRadius: 8, padding: 11, fontSize: 14, lineHeight: 1.5 },
    footer: { textAlign: 'center', color: '#64748b', fontSize: 14, margin: '20px 0 0' },
    link: { color: '#283593', fontWeight: 700, textDecoration: 'none' },
};
