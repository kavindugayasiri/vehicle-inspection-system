import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getInspectorName } from './InspectorSearch';

function listFrom(data) {
    return Array.isArray(data) ? data : data?.content || data?.reviews || [];
}

export default function InspectorProfile() {
    const { id } = useParams();
    const { user } = useAuth();
    const [inspector, setInspector] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ make: '', model: '', year: '', registrationNumber: '', message: '' });
    const [sending, setSending] = useState(false);
    const [notice, setNotice] = useState('');

    useEffect(() => {
        let active = true;
        const loadProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await api.get(`/inspectors/${id}`);
                if (active) setInspector(data);
            } catch (requestError) {
                if (active) setError(requestError.response?.data?.message || 'Could not load this inspector profile.');
            } finally {
                if (active) setLoading(false);
            }
            try {
                const { data } = await api.get(`/reviews/inspector/${id}`);
                if (active) setReviews(listFrom(data));
            } catch (requestError) {
                if (active) setNotice(requestError.response?.data?.message || 'Reviews could not be loaded.');
            }
        };
        loadProfile();
        return () => { active = false; };
    }, [id]);

    const submitHireRequest = async (event) => {
        event.preventDefault();
        setSending(true);
        setNotice('');
        try {
            const vehicleDetails = [
                form.make && `Make: ${form.make}`,
                form.model && `Model: ${form.model}`,
                form.year && `Year: ${form.year}`,
                form.registrationNumber && `Registration: ${form.registrationNumber}`,
            ].filter(Boolean).join(', ');
            await api.post('/hiring/request', { inspectorId: Number(id), vehicleDetails, message: form.message });
            setNotice('Your inspection request was sent successfully.');
            setForm({ make: '', model: '', year: '', registrationNumber: '', message: '' });
        } catch (requestError) {
            setNotice(requestError.response?.data?.message || 'Could not send your request. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <p style={styles.center}>Loading inspector profile…</p>;
    if (error || !inspector) return <section style={styles.page}><p role="alert" style={styles.error}>{error || 'Inspector not found.'}</p><Link to="/inspectors">Back to search</Link></section>;

    const name = getInspectorName(inspector);
    return (
        <section style={styles.page}>
            <Link to="/inspectors" style={styles.back}>← Back to inspectors</Link>
            <div style={styles.profile}>
                <div style={styles.avatar}>{name.charAt(0).toUpperCase()}</div>
                <div>
                    <p style={styles.eyebrow}>INSPECTOR PROFILE</p>
                    <h1 style={styles.title}>{name}</h1>
                    <p style={styles.muted}>{[inspector.city, inspector.province?.replaceAll('_', ' ')].filter(Boolean).join(', ') || 'Sri Lanka'}</p>
                    {inspector.isVerified && <span style={styles.verified}>✓ Verified</span>}
                </div>
            </div>
            <div style={styles.columns}>
                <div style={styles.panel}>
                    <h2 style={styles.heading}>About</h2>
                    <p style={styles.body}>{inspector.description || inspector.bio || inspector.specialization || 'This inspector has not added a profile description yet.'}</p>
                    <div style={styles.facts}>
                        {inspector.experienceYears != null && <p><strong>Experience</strong><br />{inspector.experienceYears} years</p>}
                        {inspector.phone && <p><strong>Phone</strong><br /><a href={`tel:${inspector.phone}`}>{inspector.phone}</a></p>}
                        {inspector.rating != null && <p><strong>Rating</strong><br />★ {inspector.rating}</p>}
                    </div>
                    <h2 style={styles.heading}>Customer reviews</h2>
                    {reviews.length ? reviews.map((review, index) => (
                        <article key={review.id ?? index} style={styles.review}>
                            <div style={styles.reviewHeading}>
                                <strong>{review.customer?.fullName || review.customerName || review.name || 'Customer'}</strong>
                                {review.rating != null && <span>★ {review.rating}</span>}
                            </div>
                            <p style={styles.body}>{review.comment || review.review || review.content || 'No written comment.'}</p>
                            {review.createdAt && <small style={styles.muted}>{new Date(review.createdAt).toLocaleDateString()}</small>}
                        </article>
                    )) : <p style={styles.muted}>No reviews available yet.</p>}
                </div>
                <aside style={styles.panel}>
                    <h2 style={styles.heading}>Request an inspection</h2>
                    {!user ? <p style={styles.body}>Please <Link to="/login" state={{ from: `/inspectors/${id}` }}>sign in</Link> as a customer to send a request.</p> :
                        user.role !== 'CUSTOMER' ? <p style={styles.body}>Only customer accounts can submit hiring requests.</p> :
                            <form onSubmit={submitHireRequest}>
                                {[
                                    ['make', 'Vehicle make', 'e.g. Toyota'],
                                    ['model', 'Vehicle model', 'e.g. Corolla'],
                                    ['year', 'Year', 'e.g. 2020'],
                                    ['registrationNumber', 'Registration number', 'Optional'],
                                ].map(([key, label, placeholder]) => (
                                    <label key={key} style={styles.label}>{label}
                                        <input style={styles.input} value={form[key]} placeholder={placeholder} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required={key !== 'registrationNumber'} />
                                    </label>
                                ))}
                                <label style={styles.label}>Message
                                    <textarea style={{ ...styles.input, minHeight: 90, resize: 'vertical' }} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Describe what you would like inspected" />
                                </label>
                                {notice && <p role="status" style={styles.notice}>{notice}</p>}
                                <button disabled={sending} style={styles.button}>{sending ? 'Sending…' : 'Send request'}</button>
                            </form>}
                    {notice && !user && <p role="status" style={styles.notice}>{notice}</p>}
                </aside>
            </div>
        </section>
    );
}

const styles = {
    page: { maxWidth: 1120, margin: '0 auto', padding: '38px 24px 70px' },
    back: { color: '#3949ab', textDecoration: 'none', fontWeight: 700 },
    profile: { display: 'flex', gap: 18, alignItems: 'center', background: '#fff', padding: 24, borderRadius: 14, margin: '20px 0', border: '1px solid #e2e8f0' },
    avatar: { width: 72, height: 72, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#e8eaf6', color: '#1a237e', fontSize: 30, fontWeight: 800 },
    eyebrow: { margin: '0 0 5px', color: '#3949ab', fontSize: 12, letterSpacing: 1.4, fontWeight: 800 },
    title: { margin: 0, color: '#172554', fontSize: 30 },
    muted: { color: '#64748b', margin: '5px 0', fontSize: 14 },
    verified: { background: '#dcfce7', color: '#166534', borderRadius: 20, padding: '5px 9px', fontSize: 12, display: 'inline-block', marginTop: 5 },
    columns: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, .8fr)', alignItems: 'start', gap: 18 },
    panel: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 22 },
    heading: { color: '#1e293b', margin: '0 0 14px', fontSize: 20 },
    body: { color: '#475569', lineHeight: 1.65 },
    facts: { display: 'flex', gap: 28, flexWrap: 'wrap', color: '#475569', marginBottom: 26 },
    review: { borderTop: '1px solid #e2e8f0', padding: '14px 0' },
    reviewHeading: { display: 'flex', justifyContent: 'space-between', color: '#334155' },
    label: { display: 'grid', gap: 6, color: '#334155', fontWeight: 700, fontSize: 13, marginBottom: 13 },
    input: { width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 11px', font: 'inherit', fontWeight: 400 },
    button: { width: '100%', color: '#fff', background: '#1a237e', border: 0, borderRadius: 8, padding: 12, fontWeight: 700, cursor: 'pointer' },
    notice: { color: '#334155', background: '#eef2ff', borderRadius: 8, padding: 10, lineHeight: 1.5 },
    error: { color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 },
    center: { textAlign: 'center', padding: 60, color: '#475569' },
};
