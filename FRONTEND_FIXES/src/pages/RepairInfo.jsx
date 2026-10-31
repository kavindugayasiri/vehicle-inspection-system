import React, { useEffect, useState } from 'react';
import api from '../services/api';

const CATEGORIES = ['CAR', 'VAN', 'SUV', 'TRUCK', 'MOTORCYCLE', 'BUS', 'THREE_WHEELER'];

function formatCost(value) {
    if (value == null || value === '') return 'Contact a repair professional';
    const amount = Number(value);
    return Number.isNaN(amount) ? String(value) : `LKR ${amount.toLocaleString()}`;
}

export default function RepairInfo() {
    const [category, setCategory] = useState('CAR');
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        const searchRepairs = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await api.get('/repairs/search', { params: { category } });
                if (active) setRepairs(Array.isArray(data) ? data : data?.content || data?.repairs || []);
            } catch (requestError) {
                if (active) {
                    setRepairs([]);
                    setError(requestError.response?.data?.message || 'Repair information could not be loaded.');
                }
            } finally {
                if (active) setLoading(false);
            }
        };
        searchRepairs();
        return () => { active = false; };
    }, [category]);

    return (
        <section style={styles.page}>
            <header style={styles.header}>
                <p style={styles.eyebrow}>REPAIR KNOWLEDGE</p>
                <h1 style={styles.title}>Vehicle repair guide</h1>
                <p style={styles.subtitle}>Explore common faults and estimated costs for your vehicle type.</p>
            </header>
            <div style={styles.categories} aria-label="Vehicle category">
                {CATEGORIES.map((item) => (
                    <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} style={{ ...styles.category, ...(category === item ? styles.active : {}) }}>
                        {item.replaceAll('_', ' ')}
                    </button>
                ))}
            </div>
            {error && <p role="alert" style={styles.error}>{error}</p>}
            {loading ? <p style={styles.empty}>Loading repair information…</p> : repairs.length ? (
                <div style={styles.grid}>
                    {repairs.map((repair, index) => (
                        <article key={repair.id ?? index} style={styles.card}>
                            <span style={styles.tag}>{repair.category || category}</span>
                            <h2 style={styles.cardTitle}>{repair.title || repair.faultName || repair.name || 'Common vehicle fault'}</h2>
                            <p style={styles.description}>{repair.description || repair.details || 'Ask a qualified technician to inspect this issue and confirm the repair required.'}</p>
                            <div style={styles.costRow}><span>Estimated cost</span><strong>{formatCost(repair.estimatedCost ?? repair.cost ?? repair.priceRange)}</strong></div>
                            {repair.repairTime && <p style={styles.time}>Typical repair time: {repair.repairTime}</p>}
                        </article>
                    ))}
                </div>
            ) : !error ? <p style={styles.empty}>No repair information found for {category.replaceAll('_', ' ')}.</p> : null}
            <p style={styles.disclaimer}>Costs are estimates and may vary by vehicle condition, parts, and repair provider. Always request a professional assessment.</p>
        </section>
    );
}

const styles = {
    page: { maxWidth: 1120, margin: '0 auto', padding: '48px 24px 72px' },
    header: { marginBottom: 24 },
    eyebrow: { color: '#3949ab', fontSize: 12, letterSpacing: 1.5, fontWeight: 800 },
    title: { color: '#172554', fontSize: 34, margin: '8px 0' },
    subtitle: { color: '#64748b' },
    categories: { display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 24 },
    category: { border: '1px solid #cbd5e1', background: '#fff', borderRadius: 24, padding: '9px 14px', cursor: 'pointer', color: '#334155', fontWeight: 700, fontSize: 13 },
    active: { color: '#fff', background: '#1a237e', borderColor: '#1a237e' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 },
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 },
    tag: { color: '#3949ab', fontSize: 11, fontWeight: 800, letterSpacing: 1 },
    cardTitle: { color: '#1e293b', fontSize: 19 },
    description: { color: '#64748b', lineHeight: 1.6, minHeight: 70 },
    costRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, borderTop: '1px solid #e2e8f0', paddingTop: 13, color: '#475569', fontSize: 13 },
    time: { color: '#64748b', fontSize: 13 },
    empty: { textAlign: 'center', padding: 38, color: '#64748b' },
    error: { color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 },
    disclaimer: { color: '#64748b', fontSize: 13, lineHeight: 1.6, marginTop: 24 },
};
