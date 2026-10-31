import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROVINCES, getInspectorName } from './customer/InspectorSearch';
import api from '../services/api';

export default function RatingsReviews() {
    const [province, setProvince] = useState('WESTERN');
    const [city, setCity] = useState('');
    const [inspectors, setInspectors] = useState([]);
    const [selected, setSelected] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchInspectors = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSelected(null);
        setReviews([]);
        try {
            const params = { province };
            if (city.trim()) params.city = city.trim();
            const { data } = await api.get('/inspectors/search', { params });
            setInspectors(Array.isArray(data) ? data : data?.content || data?.inspectors || []);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Could not search inspectors.');
        } finally {
            setLoading(false);
        }
    };

    const showReviews = async (inspector) => {
        const id = inspector.id ?? inspector.inspectorId;
        setLoading(true);
        setError('');
        setSelected(inspector);
        try {
            const { data } = await api.get(`/reviews/inspector/${id}`);
            setReviews(Array.isArray(data) ? data : data?.content || data?.reviews || []);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Could not load reviews for this inspector.');
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={styles.page}>
            <header style={styles.header}>
                <p style={styles.eyebrow}>REAL CUSTOMER EXPERIENCES</p>
                <h1 style={styles.title}>Ratings & reviews</h1>
                <p style={styles.subtitle}>Find an inspector by location, then browse their reviews.</p>
            </header>
            <form onSubmit={searchInspectors} style={styles.form}>
                <label style={styles.label}>Province
                    <select value={province} onChange={(event) => setProvince(event.target.value)} style={styles.input}>
                        {PROVINCES.map((item) => <option value={item} key={item}>{item.replaceAll('_', ' ')}</option>)}
                    </select>
                </label>
                <label style={styles.label}>City
                    <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Colombo" style={styles.input} />
                </label>
                <button style={styles.button} disabled={loading}>{loading ? 'Loading…' : 'Search inspectors'}</button>
            </form>
            {error && <p role="alert" style={styles.error}>{error}</p>}
            {inspectors.length > 0 && <div style={styles.inspectorList}>
                {inspectors.map((inspector) => {
                    const id = inspector.id ?? inspector.inspectorId;
                    return <article style={styles.inspector} key={id}>
                        <div><strong style={styles.name}>{getInspectorName(inspector)}</strong><p style={styles.muted}>{inspector.city || inspector.province?.replaceAll('_', ' ') || 'Sri Lanka'} {inspector.rating != null ? ` · ★ ${inspector.rating}` : ''}</p></div>
                        <button type="button" style={styles.secondaryButton} onClick={() => showReviews(inspector)}>View reviews</button>
                    </article>;
                })}
            </div>}
            {selected && <section style={styles.reviewSection}>
                <h2 style={styles.heading}>Reviews for {getInspectorName(selected)}</h2>
                {loading ? <p style={styles.muted}>Loading reviews…</p> : reviews.length ? reviews.map((review, index) => (
                    <article key={review.id ?? index} style={styles.review}>
                        <div style={styles.reviewTop}><strong>{review.customer?.fullName || review.customerName || review.name || 'Customer'}</strong><span style={styles.rating}>★ {review.rating ?? '—'}</span></div>
                        <p style={styles.reviewText}>{review.comment || review.review || review.content || 'No written comment provided.'}</p>
                        {review.createdAt && <small style={styles.muted}>{new Date(review.createdAt).toLocaleDateString()}</small>}
                    </article>
                )) : !error && <p style={styles.muted}>No reviews available for this inspector yet.</p>}
                <Link to={`/inspectors/${selected.id ?? selected.inspectorId}`} style={styles.profileLink}>View inspector profile →</Link>
            </section>}
            {!inspectors.length && !error && <p style={styles.muted}>Search by province and city to find inspectors and their reviews.</p>}
        </section>
    );
}

const styles = {
    page: { maxWidth: 1000, margin: '0 auto', padding: '48px 24px 72px' },
    header: { marginBottom: 24 },
    eyebrow: { color: '#3949ab', fontSize: 12, letterSpacing: 1.5, fontWeight: 800 },
    title: { color: '#172554', fontSize: 34, margin: '8px 0' },
    subtitle: { color: '#64748b' },
    form: { display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 14, alignItems: 'end', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, marginBottom: 18 },
    label: { display: 'grid', gap: 7, color: '#334155', fontSize: 13, fontWeight: 700 },
    input: { padding: '11px 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', fontSize: 15 },
    button: { background: '#1a237e', color: '#fff', border: 0, borderRadius: 8, padding: '12px 16px', cursor: 'pointer', fontWeight: 700 },
    secondaryButton: { background: '#eef2ff', color: '#1a237e', border: 0, borderRadius: 8, padding: '9px 12px', cursor: 'pointer', fontWeight: 700 },
    inspectorList: { display: 'grid', gap: 10 },
    inspector: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 15 },
    name: { color: '#1e293b' },
    muted: { color: '#64748b', fontSize: 14 },
    reviewSection: { marginTop: 28, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 22 },
    heading: { color: '#172554', fontSize: 21, marginTop: 0 },
    review: { borderTop: '1px solid #e2e8f0', padding: '16px 0' },
    reviewTop: { display: 'flex', justifyContent: 'space-between', color: '#334155' },
    rating: { color: '#a16207', fontWeight: 700 },
    reviewText: { color: '#475569', lineHeight: 1.6 },
    profileLink: { color: '#283593', textDecoration: 'none', fontWeight: 700 },
    error: { color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 },
};
