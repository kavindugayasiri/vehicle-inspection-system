import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function statusStyle(status) {
    const palette = {
        PENDING: ['#fffbeb', '#92400e'],
        ACCEPTED: ['#dcfce7', '#166534'],
        REJECTED: ['#fee2e2', '#991b1b'],
        COMPLETED: ['#e0e7ff', '#3730a3'],
    };
    const [background, color] = palette[status] || ['#f1f5f9', '#475569'];
    return { background, color, padding: '5px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800, display: 'inline-block' };
}

export default function MyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        api.get('/hiring/my-requests')
            .then(({ data }) => {
                if (active) setRequests(Array.isArray(data) ? data : data?.content || data?.requests || []);
            })
            .catch((requestError) => {
                if (active) setError(requestError.response?.data?.message || 'Could not load your hiring requests.');
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    return (
        <section style={styles.page}>
            <header style={styles.header}>
                <div><p style={styles.eyebrow}>YOUR BOOKINGS</p><h1 style={styles.title}>My requests</h1></div>
                <Link to="/hire" style={styles.button}>Hire an inspector</Link>
            </header>
            {error && <p role="alert" style={styles.error}>{error}</p>}
            {loading ? <p style={styles.empty}>Loading your requests…</p> : requests.length ? (
                <div style={styles.list}>
                    {requests.map((request, index) => {
                        const inspector = request.inspector;
                        const inspectorName = inspector?.user?.fullName || inspector?.fullName || inspector?.name || 'Inspector';
                        const status = String(request.status || 'PENDING').toUpperCase();
                        return <article key={request.id ?? index} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div><p style={styles.requestId}>REQUEST #{request.id ?? index + 1}</p><h2 style={styles.inspector}>{inspectorName}</h2></div>
                                <span style={statusStyle(status)}>{status}</span>
                            </div>
                            <div style={styles.details}>
                                <p><strong>Vehicle</strong><br />{request.vehicleDetails || 'Not specified'}</p>
                                {request.message && <p><strong>Message</strong><br />{request.message}</p>}
                                {request.requestedAt && <p><strong>Requested</strong><br />{new Date(request.requestedAt).toLocaleString()}</p>}
                                {inspector?.city && <p><strong>Location</strong><br />{inspector.city}</p>}
                            </div>
                        </article>;
                    })}
                </div>
            ) : !error && <div style={styles.emptyState}><p style={styles.empty}>You haven’t sent any hiring requests yet.</p><Link to="/inspectors" style={styles.textLink}>Find an inspector →</Link></div>}
        </section>
    );
}

const styles = {
    page: { maxWidth: 1000, margin: '0 auto', padding: '48px 24px 72px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 },
    eyebrow: { color: '#3949ab', fontSize: 12, letterSpacing: 1.5, fontWeight: 800, marginBottom: 7 },
    title: { color: '#172554', margin: 0, fontSize: 34 },
    button: { background: '#1a237e', color: '#fff', textDecoration: 'none', padding: '11px 15px', borderRadius: 8, fontWeight: 700 },
    list: { display: 'grid', gap: 14 },
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 14 },
    requestId: { color: '#64748b', fontSize: 11, letterSpacing: 1, fontWeight: 800, margin: '0 0 5px' },
    inspector: { color: '#1e293b', fontSize: 18, margin: 0 },
    details: { display: 'flex', gap: '8px 30px', flexWrap: 'wrap', color: '#475569', fontSize: 14 },
    error: { color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 },
    empty: { color: '#64748b', padding: 30, textAlign: 'center' },
    emptyState: { textAlign: 'center', background: '#fff', borderRadius: 12, padding: 20 },
    textLink: { color: '#283593', textDecoration: 'none', fontWeight: 700 },
};
