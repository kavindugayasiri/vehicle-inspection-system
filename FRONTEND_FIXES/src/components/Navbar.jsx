import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.inner}>
                <Link to="/" style={styles.logo}>VehicleInspect</Link>
                <div style={styles.links}>
                    <Link to="/inspectors" style={styles.link}>Find inspectors</Link>
                    <Link to="/repair-info" style={styles.link}>Repair guide</Link>
                    <Link to="/ratings-reviews" style={styles.link}>Reviews</Link>
                    {user?.role === 'CUSTOMER' && <>
                        <Link to="/hire" style={styles.link}>Hire</Link>
                        <Link to="/my-requests" style={styles.link}>My requests</Link>
                    </>}
                    {user?.role === 'INSPECTOR' && <Link to="/dashboard" style={styles.link}>Dashboard</Link>}
                    {user?.role === 'ADMIN' && <Link to="/admin" style={styles.link}>Admin panel</Link>}
                    {!user ? <>
                        <Link to="/login" style={styles.link}>Log in</Link>
                        <Link to="/register" style={styles.register}>Create account</Link>
                    </> : <>
                        <span style={styles.greeting}>{user.fullName || user.email}</span>
                        <button type="button" onClick={handleLogout} style={styles.logout}>Log out</button>
                    </>}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    nav: { background: '#1a237e', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 12px #11182730', padding: '0 24px' },
    inner: { maxWidth: 1200, minHeight: 64, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
    logo: { color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 20, whiteSpace: 'nowrap' },
    links: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
    link: { color: '#e0e7ff', textDecoration: 'none', padding: '8px 10px', borderRadius: 7, fontSize: 14 },
    register: { background: '#fff', color: '#1a237e', padding: '9px 13px', borderRadius: 7, textDecoration: 'none', fontSize: 14, fontWeight: 700 },
    greeting: { color: '#c5cae9', fontSize: 13 },
    logout: { color: '#fff', border: '1px solid #9fa8da', background: 'transparent', borderRadius: 7, padding: '7px 10px', cursor: 'pointer' },
};
