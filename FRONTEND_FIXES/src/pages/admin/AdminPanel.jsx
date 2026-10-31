import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const TABS = ['Users', 'Inspectors', 'Hiring requests'];

export default function AdminPanel() {
    const [tab, setTab] = useState('Users');
    const [users, setUsers] = useState([]);
    const [inspectors, setInspectors] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [verifying, setVerifying] = useState(null);

    useEffect(() => {
        let active = true;
        const loadTab = async () => {
            setLoading(true);
            setError('');
            setNotice('');
            const endpoint = tab === 'Users' ? '/admin/users' : tab === 'Inspectors' ? '/admin/inspectors' : '/admin/hiring-requests';
            try {
                const { data } = await api.get(endpoint);
                const list = Array.isArray(data) ? data : data?.content || data?.items || [];
                if (!active) return;
                if (tab === 'Users') setUsers(list);
                else if (tab === 'Inspectors') setInspectors(list);
                else setRequests(list);
            } catch (requestError) {
                if (active) {
                    setError(
                        tab === 'Hiring requests' && requestError.response?.status === 404
                            ? 'The current backend does not expose an admin endpoint for all hiring requests. Add GET /api/admin/hiring-requests to enable this tab.'
                            : requestError.response?.data?.message || `Could not load ${tab.toLowerCase()}.`,
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };
        loadTab();
        return () => { active = false; };
    }, [tab]);

    const verifyInspector = async (inspector) => {
        const id = inspector.id ?? inspector.inspectorId;
        setVerifying(id);
        setError('');
        setNotice('');
        try {
            await api.patch(`/admin/inspectors/${id}/verify`);
            setInspectors((current) => current.map((item) => (item.id ?? item.inspectorId) === id ? { ...item, isVerified: true } : item));
            setNotice(`${inspector.user?.fullName || inspector.fullName || inspector.name || 'Inspector'} verified successfully.`);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Could not verify this inspector.');
        } finally {
            setVerifying(null);
        }
    };

    return (
        <section style={styles.page}>
            <header style={styles.header}><p style={styles.eyebrow}>PLATFORM MANAGEMENT</p><h1 style={styles.title}>Admin panel</h1><p style={styles.subtitle}>Manage registered users, inspector verification, and hiring activity.</p></header>
            <div role="tablist" style={styles.tabs}>
                {TABS.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} style={{ ...styles.tab, ...(tab === item ? styles.activeTab : {}) }}>{item}</button>)}
            </div>
            {error && <p role="alert" style={styles.error}>{error}</p>}
            {notice && <p role="status" style={styles.notice}>{notice}</p>}
            {loading ? <p style={styles.empty}>Loading {tab.toLowerCase()}…</p> : <>
                {tab === 'Users' && <div style={styles.tableWrap}><table style={styles.table}>
                    <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Email</th><th style={styles.th}>Phone</th><th style={styles.th}>Role</th><th style={styles.th}>Joined</th></tr></thead>
                    <tbody>{users.map((user, index) => <tr key={user.id ?? user.email ?? index}>
                        <td style={styles.td}>{user.fullName || user.name || '—'}</td><td style={styles.td}>{user.email || '—'}</td><td style={styles.td}>{user.phone || '—'}</td><td style={styles.td}><span style={styles.role}>{user.role || '—'}</span></td><td style={styles.td}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                    </tr>)}</tbody>
                </table>{!users.length && <p style={styles.empty}>No users found.</p>}</div>}

                {tab === 'Inspectors' && <div style={styles.tableWrap}><table style={styles.table}>
                    <thead><tr><th style={styles.th}>Inspector</th><th style={styles.th}>Location</th><th style={styles.th}>Specialization</th><th style={styles.th}>Verification</th><th style={styles.th}>Action</th></tr></thead>
                    <tbody>{inspectors.map((inspector, index) => {
                        const id = inspector.id ?? inspector.inspectorId;
                        const verified = inspector.isVerified ?? inspector.verified;
                        return <tr key={id ?? index}>
                            <td style={styles.td}>{inspector.user?.fullName || inspector.fullName || inspector.name || '—'}<br /><small style={styles.subtext}>{inspector.user?.email || inspector.email || ''}</small></td>
                            <td style={styles.td}>{[inspector.city, inspector.province?.replaceAll('_', ' ')].filter(Boolean).join(', ') || '—'}</td>
                            <td style={styles.td}>{inspector.specialization || inspector.expertise || '—'}</td>
                            <td style={styles.td}><span style={verified ? styles.verified : styles.unverified}>{verified ? 'Verified' : 'Not verified'}</span></td>
                            <td style={styles.td}>{verified ? '—' : <button disabled={verifying === id} onClick={() => verifyInspector(inspector)} style={styles.verifyButton}>{verifying === id ? 'Verifying…' : 'Verify'}</button>}</td>
                        </tr>;
                    })}</tbody>
                </table>{!inspectors.length && <p style={styles.empty}>No inspectors found.</p>}</div>}

                {tab === 'Hiring requests' && requests.length > 0 && <div style={styles.tableWrap}><table style={styles.table}>
                    <thead><tr><th style={styles.th}>Request</th><th style={styles.th}>Customer</th><th style={styles.th}>Inspector</th><th style={styles.th}>Vehicle</th><th style={styles.th}>Status</th><th style={styles.th}>Requested</th></tr></thead>
                    <tbody>{requests.map((request, index) => <tr key={request.id ?? index}>
                        <td style={styles.td}>#{request.id ?? '—'}</td><td style={styles.td}>{request.customer?.fullName || request.customerName || '—'}</td><td style={styles.td}>{request.inspector?.user?.fullName || request.inspector?.fullName || '—'}</td><td style={styles.td}>{request.vehicleDetails || '—'}</td><td style={styles.td}><span style={styles.role}>{request.status || '—'}</span></td><td style={styles.td}>{request.requestedAt ? new Date(request.requestedAt).toLocaleDateString() : '—'}</td>
                    </tr>)}</tbody>
                </table></div>}
                {tab === 'Hiring requests' && !requests.length && !error && <p style={styles.empty}>No hiring requests found.</p>}
            </>}
        </section>
    );
}

const styles = {
    page: { maxWidth: 1180, margin: '0 auto', padding: '48px 24px 72px' },
    header: { marginBottom: 24 },
    eyebrow: { color: '#3949ab', fontSize: 12, letterSpacing: 1.5, fontWeight: 800, marginBottom: 7 },
    title: { color: '#172554', margin: 0, fontSize: 34 },
    subtitle: { color: '#64748b' },
    tabs: { display: 'flex', borderBottom: '1px solid #cbd5e1', marginBottom: 20, gap: 4, flexWrap: 'wrap' },
    tab: { background: 'transparent', border: 0, color: '#64748b', padding: '12px 16px', cursor: 'pointer', fontWeight: 700, borderBottom: '3px solid transparent' },
    activeTab: { color: '#1a237e', borderBottomColor: '#1a237e' },
    tableWrap: { overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 },
    th: { background: '#f8fafc', color: '#475569', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.5px', padding: '13px 15px', borderBottom: '1px solid #e2e8f0' },
    td: { color: '#334155', fontSize: 14, padding: '13px 15px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
    role: { background: '#eef2ff', color: '#3730a3', padding: '5px 8px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
    verified: { background: '#dcfce7', color: '#166534', padding: '5px 8px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
    unverified: { background: '#fef3c7', color: '#92400e', padding: '5px 8px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
    verifyButton: { background: '#1a237e', color: '#fff', border: 0, padding: '8px 12px', borderRadius: 7, fontWeight: 700, cursor: 'pointer' },
    subtext: { color: '#64748b' },
    empty: { color: '#64748b', textAlign: 'center', padding: 32 },
    error: { color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8, lineHeight: 1.5 },
    notice: { color: '#166534', background: '#dcfce7', padding: 12, borderRadius: 8 },
};
