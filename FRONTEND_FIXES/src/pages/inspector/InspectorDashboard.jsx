import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';

function statusStyle(status) {
    const palette = { PENDING: ['#fffbeb', '#92400e'], ACCEPTED: ['#dcfce7', '#166534'], REJECTED: ['#fee2e2', '#991b1b'], COMPLETED: ['#e0e7ff', '#3730a3'] };
    const [background, color] = palette[status] || ['#f1f5f9', '#475569'];
    return { background, color, padding: '5px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800, display: 'inline-block' };
}

export default function InspectorDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(null);
    const [notice, setNotice] = useState('');

    const loadRequests = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/hiring/inspector-requests');
            setRequests(Array.isArray(data) ? data : data?.content || data?.requests || []);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Could not load incoming requests.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadRequests(); }, [loadRequests]);

    const updateStatus = async (request, status) => {
        setUpdating(request.id);
        setError('');
        setNotice('');
        try {
            await api.patch(`/hiring/${request.id}/status`, null, { params: { status } });
            setNotice(`Request #${request.id} updated to ${status.toLowerCase()}.`);
            await loadRequests();
        } catch (requestError) {
            setError(requestError.response?.data?.message || `Could not ${status.toLowerCase()} this request.`);
        } finally {
            setUpdating(null);
        }
    };

    const pending = requests.filter((request) => String(request.status).toUpperCase() === 'PENDING').length;
    const accepted = requests.filter((request) => String(request.status).toUpperCase() === 'ACCEPTED').length;
    const completed = requests.filter((request) => String(request.status).toUpperCase() === 'COMPLETED').length;

    return (
        <section style={styles.page}>
            <header style={styles.header}><div><p style={styles.eyebrow}>INSPECTOR WORKSPACE</p><h1 style={styles.title}>Dashboard</h1><p style={styles.subtitle}>Review and manage your inspection requests.</p></div><button type="button" onClick={loadRequests} style={styles.refresh}>Refresh</button></header>
            <div style={styles.stats}>
                {[['Total requests', requests.length], ['Pending', pending], ['Accepted', accepted], ['Completed', completed]].map(([label, count]) => <div key={label} style={styles.stat}><span>{label}</span><strong>{count}</strong></div>)}
            </div>
            {error && <p role="alert" style={styles.error}>{error}</p>}
            {notice && <p role="status" style={styles.notice}>{notice}</p>}
            <h2 style={styles.heading}>Incoming requests</h2>
            {loading ? <p style={styles.empty}>Loading requests…</p> : requests.length ? <div style={styles.list}>
                {requests.map((request, index) => {
                    const status = String(request.status || 'PENDING').toUpperCase();
                    const customer = request.customer?.fullName || request.customer?.name || request.customerName || 'Customer';
                    return <article key={request.id ?? index} style={styles.card}>
                        <div style={styles.cardHeader}><div><p style={styles.requestId}>REQUEST #{request.id ?? index + 1}</p><h3 style={styles.customer}>{customer}</h3></div><span style={statusStyle(status)}>{status}</span></div>
                        <div style={styles.details}>
                            <p><strong>Vehicle</strong><br />{request.vehicleDetails || 'Not specified'}</p>
                            {request.message && <p><strong>Message</strong><br />{request.message}</p>}
                            {request.requestedAt && <p><strong>Received</strong><br />{new Date(request.requestedAt).toLocaleString()}</p>}
                            {request.customer?.phone && <p><strong>Phone</strong><br /><a href={`tel:${request.customer.phone}`}>{request.customer.phone}</a></p>}
                        </div>
                        <div style={styles.actions}>
                            {status === 'PENDING' && <>
                                <button disabled={updating === request.id} onClick={() => updateStatus(request, 'ACCEPTED')} style={styles.accept}>Accept</button>
                                <button disabled={updating === request.id} onClick={() => updateStatus(request, 'REJECTED')} style={styles.reject}>Reject</button>
                            </>}
                            {status === 'ACCEPTED' && <button disabled={updating === request.id} onClick={() => updateStatus(request, 'COMPLETED')} style={styles.accept}>Mark complete</button>}
                            {updating === request.id && <span style={styles.muted}>Updating…</span>}
                        </div>
                    </article>;
                })}
            </div> : !error && <p style={styles.empty}>No inspection requests yet.</p>}
        </section>
    );
}

const styles = {
    page: { maxWidth: 1100, margin: '0 auto', padding: '48px 24px 72px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
    eyebrow: { color: '#3949ab', fontSize: 12, letterSpacing: 1.5, fontWeight: 800, marginBottom: 7 },
    title: { color: '#172554', margin: 0, fontSize: 34 },
    subtitle: { color: '#64748b' },
    refresh: { padding: '10px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, cursor: 'pointer', color: '#1a237e', fontWeight: 700 },
    stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, margin: '24px 0 32px' },
    stat: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 17, color: '#64748b', fontSize: 14 },
    statValue: { color: '#172554' },
    heading: { color: '#1e293b' },
    list: { display: 'grid', gap: 14 },
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 13 },
    requestId: { color: '#64748b', fontSize: 11, letterSpacing: 1, fontWeight: 800, margin: '0 0 5px' },
    customer: { color: '#1e293b', margin: 0, fontSize: 18 },
    details: { display: 'flex', gap: '8px 30px', flexWrap: 'wrap', color: '#475569', fontSize: 14 },
    actions: { display: 'flex', gap: 9, alignItems: 'center', marginTop: 10 },
    accept: { background: '#166534', color: '#fff', border: 0, borderRadius: 7, padding: '9px 13px', cursor: 'pointer', fontWeight: 700 },
    reject: { background: '#fff', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 7, padding: '8px 13px', cursor: 'pointer', fontWeight: 700 },
    empty: { color: '#64748b', textAlign: 'center', padding: 32 },
    error: { color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 },
    notice: { color: '#166534', background: '#dcfce7', padding: 12, borderRadius: 8 },
    muted: { color: '#64748b', fontSize: 13 },
};
