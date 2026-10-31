import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const PROVINCES = [
    'WESTERN', 'CENTRAL', 'SOUTHERN', 'NORTHERN', 'EASTERN',
    'NORTH_WESTERN', 'NORTH_CENTRAL', 'UVA', 'SABARAGAMUWA',
];

export function getInspectorName(inspector) {
    return inspector.user?.fullName || inspector.fullName || inspector.name || inspector.user?.name || 'Vehicle inspector';
}

function InspectorCard({ inspector }) {
    const id = inspector.id ?? inspector.inspectorId;
    return (
        <article style={styles.card}>
            <div style={styles.cardTop}>
                <div style={styles.avatar}>{getInspectorName(inspector).charAt(0).toUpperCase()}</div>
                <div>
                    <h3 style={styles.name}>{getInspectorName(inspector)}</h3>
                    <p style={styles.meta}>{[inspector.city, inspector.province?.replaceAll('_', ' ')].filter(Boolean).join(', ') || 'Location not listed'}</p>
                </div>
            </div>
            {inspector.isVerified && <span style={styles.verified}>✓ Verified inspector</span>}
            <p style={styles.description}>{inspector.specialization || inspector.expertise || inspector.description || 'Professional vehicle inspection services.'}</p>
            <div style={styles.stats}>
                {inspector.experienceYears != null && <span>{inspector.experienceYears} years’ experience</span>}
                {inspector.rating != null && <span>★ {inspector.rating}</span>}
            </div>
            {id != null && <Link to={`/inspectors/${id}`} style={styles.button}>View profile</Link>}
        </article>
    );
}

export default function InspectorSearch() {
    const [province, setProvince] = useState('WESTERN');
    const [city, setCity] = useState('');
    const [inspectors, setInspectors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const search = async (event) => {
        if (event) event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const params = { province };
            if (city.trim()) params.city = city.trim();
            const { data } = await api.get('/inspectors/search', { params });
            setInspectors(Array.isArray(data) ? data : data?.content || data?.inspectors || []);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Could not load inspectors. Please try again.');
            setInspectors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { search(); }, []);

    return (
        <section style={styles.page}>
            <header style={styles.header}>
                <p style={styles.eyebrow}>FIND THE RIGHT EXPERT</p>
                <h1 style={styles.title}>Search vehicle inspectors</h1>
                <p style={styles.subtitle}>Browse professionals by province and city.</p>
            </header>
            <form onSubmit={search} style={styles.searchForm}>
                <label style={styles.label}>Province
                    <select value={province} onChange={(event) => setProvince(event.target.value)} style={styles.input}>
                        {PROVINCES.map((item) => <option value={item} key={item}>{item.replaceAll('_', ' ')}</option>)}
                    </select>
                </label>
                <label style={styles.label}>City
                    <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Colombo" style={styles.input} />
                </label>
                <button disabled={loading} type="submit" style={styles.button}>{loading ? 'Searching…' : 'Search inspectors'}</button>
            </form>
            {error && <p role="alert" style={styles.error}>{error}</p>}
            {!loading && !error && <p style={styles.count}>{inspectors.length} inspector{inspectors.length === 1 ? '' : 's'} found</p>}
            <div style={styles.grid}>
                {inspectors.map((inspector) => <InspectorCard key={inspector.id ?? inspector.inspectorId} inspector={inspector} />)}
            </div>
            {!loading && !error && inspectors.length === 0 && <p style={styles.empty}>No inspectors found in this area. Try another city or province.</p>}
        </section>
    );
}

const styles = {
    page: { maxWidth: 1120, margin: '0 auto', padding: '48px 24px 72px' },
    header: { marginBottom: 26 },
    eyebrow: { color: '#3949ab', fontSize: 12, letterSpacing: 1.5, fontWeight: 800, marginBottom: 8 },
    title: { color: '#172554', margin: 0, fontSize: 34 },
    subtitle: { color: '#64748b', marginTop: 10 },
    searchForm: { display: 'grid', gridTemplateColumns: '1fr 1fr auto', alignItems: 'end', gap: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, marginBottom: 22 },
    label: { display: 'grid', gap: 7, color: '#334155', fontSize: 13, fontWeight: 700 },
    input: { padding: '11px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15, background: '#fff', color: '#1e293b' },
    button: { display: 'inline-block', textAlign: 'center', background: '#1a237e', color: '#fff', padding: '12px 18px', border: 0, borderRadius: 8, textDecoration: 'none', fontWeight: 700, cursor: 'pointer' },
    count: { color: '#64748b', fontSize: 14 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
    card: { padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' },
    cardTop: { display: 'flex', alignItems: 'center', gap: 12 },
    avatar: { width: 44, height: 44, borderRadius: 50, background: '#e8eaf6', color: '#1a237e', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 20 },
    name: { color: '#1e293b', margin: 0, fontSize: 17 },
    meta: { color: '#64748b', fontSize: 13, margin: '4px 0 0' },
    verified: { display: 'inline-block', color: '#166534', background: '#dcfce7', padding: '5px 8px', borderRadius: 20, fontSize: 12, marginTop: 14 },
    description: { color: '#475569', lineHeight: 1.5, minHeight: 46, margin: '14px 0 10px' },
    stats: { display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 13, minHeight: 20, marginBottom: 15 },
    error: { color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 },
    empty: { color: '#64748b', textAlign: 'center', padding: 32 },
};
