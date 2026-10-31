import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROVINCES, getInspectorName } from './customer/InspectorSearch';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function HireDirectly() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [province, setProvince] = useState('WESTERN');
    const [city, setCity] = useState('');
    const [inspectors, setInspectors] = useState([]);
    const [inspector, setInspector] = useState(null);
    const [vehicle, setVehicle] = useState({ make: '', model: '', year: '', registrationNumber: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const search = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const params = { province };
            if (city.trim()) params.city = city.trim();
            const { data } = await api.get('/inspectors/search', { params });
            setInspectors(Array.isArray(data) ? data : data?.content || data?.inspectors || []);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Could not find inspectors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const sendRequest = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const vehicleDetails = [
            vehicle.make && `Make: ${vehicle.make}`,
            vehicle.model && `Model: ${vehicle.model}`,
            vehicle.year && `Year: ${vehicle.year}`,
            vehicle.registrationNumber && `Registration: ${vehicle.registrationNumber}`,
        ].filter(Boolean).join(', ');
        try {
            await api.post('/hiring/request', { inspectorId: Number(inspector.id ?? inspector.inspectorId), vehicleDetails, message: vehicle.message });
            setSuccess('Your request has been sent. You can follow its status from My Requests.');
            setStep(3);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Could not send your request. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={styles.page}>
            <header style={styles.header}>
                <p style={styles.eyebrow}>BOOK AN INSPECTION</p>
                <h1 style={styles.title}>Hire an inspector directly</h1>
                <p style={styles.subtitle}>Choose a professional, share your vehicle details, and send a request.</p>
            </header>
            <div style={styles.steps}>
                {['Find inspector', 'Vehicle details', 'Request sent'].map((label, index) => <div key={label} style={{ ...styles.step, ...(step === index + 1 ? styles.stepActive : {}) }}><span>{index + 1}</span>{label}</div>)}
            </div>
            {!user && <p style={styles.info}>You need to <Link to="/login">sign in</Link> as a customer to send a hiring request.</p>}
            {user?.role && user.role !== 'CUSTOMER' && <p style={styles.info}>Hiring requests can only be sent from a customer account.</p>}
            {error && <p role="alert" style={styles.error}>{error}</p>}

            {step === 1 && <div style={styles.panel}>
                <h2 style={styles.heading}>1. Find an inspector</h2>
                <form onSubmit={search} style={styles.form}>
                    <label style={styles.label}>Province
                        <select value={province} onChange={(event) => setProvince(event.target.value)} style={styles.input}>{PROVINCES.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}</select>
                    </label>
                    <label style={styles.label}>City
                        <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Colombo" style={styles.input} />
                    </label>
                    <button style={styles.button} disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
                </form>
                <div style={styles.results}>
                    {inspectors.map((item) => <article key={item.id ?? item.inspectorId} style={styles.inspector}>
                        <div><strong>{getInspectorName(item)}</strong><p style={styles.muted}>{[item.city, item.province?.replaceAll('_', ' ')].filter(Boolean).join(', ') || 'Location not listed'}</p></div>
                        <button type="button" style={styles.secondaryButton} onClick={() => { setInspector(item); setStep(2); setError(''); }}>Select</button>
                    </article>)}
                </div>
                {!loading && inspectors.length === 0 && <p style={styles.muted}>Search a location to see available inspectors.</p>}
            </div>}

            {step === 2 && inspector && <div style={styles.panel}>
                <h2 style={styles.heading}>2. Vehicle details</h2>
                <p style={styles.muted}>Requesting {getInspectorName(inspector)} · <button type="button" style={styles.inlineButton} onClick={() => setStep(1)}>Change inspector</button></p>
                <form onSubmit={sendRequest}>
                    <div style={styles.vehicleGrid}>
                        {[
                            ['make', 'Vehicle make', 'Toyota'],
                            ['model', 'Vehicle model', 'Corolla'],
                            ['year', 'Year', '2020'],
                            ['registrationNumber', 'Registration number', 'Optional'],
                        ].map(([key, label, placeholder]) => <label style={styles.label} key={key}>{label}
                            <input style={styles.input} placeholder={placeholder} value={vehicle[key]} onChange={(event) => setVehicle({ ...vehicle, [key]: event.target.value })} required={key !== 'registrationNumber'} />
                        </label>)}
                    </div>
                    <label style={styles.label}>What would you like inspected?
                        <textarea style={{ ...styles.input, minHeight: 100, resize: 'vertical' }} value={vehicle.message} onChange={(event) => setVehicle({ ...vehicle, message: event.target.value })} placeholder="Describe the inspection you need" />
                    </label>
                    <button style={styles.button} disabled={loading || !user || user.role !== 'CUSTOMER'}>{loading ? 'Sending…' : 'Submit hiring request'}</button>
                </form>
            </div>}

            {step === 3 && <div style={styles.panel}>
                <div style={styles.successIcon}>✓</div>
                <h2 style={styles.heading}>Request submitted</h2>
                <p style={styles.muted}>{success}</p>
                <Link to="/my-requests" style={styles.buttonLink}>View my requests</Link>
            </div>}
        </section>
    );
}

const styles = {
    page: { maxWidth: 950, margin: '0 auto', padding: '48px 24px 72px' },
    header: { marginBottom: 24 },
    eyebrow: { color: '#3949ab', fontSize: 12, letterSpacing: 1.5, fontWeight: 800 },
    title: { color: '#172554', fontSize: 34, margin: '8px 0' },
    subtitle: { color: '#64748b' },
    steps: { display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' },
    step: { display: 'flex', gap: 9, alignItems: 'center', background: '#e2e8f0', color: '#64748b', padding: '10px 14px', borderRadius: 24, fontSize: 13, fontWeight: 700 },
    stepActive: { background: '#e8eaf6', color: '#1a237e' },
    panel: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 13, padding: 22 },
    heading: { color: '#1e293b', marginTop: 0 },
    form: { display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' },
    label: { display: 'grid', gap: 7, color: '#334155', fontSize: 13, fontWeight: 700, marginBottom: 14 },
    input: { boxSizing: 'border-box', width: '100%', padding: 11, border: '1px solid #cbd5e1', borderRadius: 8, font: 'inherit', fontWeight: 400 },
    button: { background: '#1a237e', color: '#fff', border: 0, borderRadius: 8, padding: '12px 16px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' },
    results: { display: 'grid', gap: 10, marginTop: 16 },
    inspector: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 14, border: '1px solid #e2e8f0', borderRadius: 9 },
    muted: { color: '#64748b', lineHeight: 1.6 },
    secondaryButton: { border: 0, borderRadius: 8, padding: '9px 14px', background: '#eef2ff', color: '#1a237e', fontWeight: 700, cursor: 'pointer' },
    vehicleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 14px' },
    inlineButton: { border: 0, background: 'none', color: '#283593', textDecoration: 'underline', cursor: 'pointer' },
    info: { background: '#eef2ff', padding: 12, borderRadius: 8, color: '#334155' },
    error: { color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 },
    successIcon: { display: 'grid', placeItems: 'center', width: 50, height: 50, borderRadius: 50, background: '#dcfce7', color: '#166534', fontSize: 27, fontWeight: 800 },
    buttonLink: { display: 'inline-block', background: '#1a237e', color: '#fff', textDecoration: 'none', borderRadius: 8, padding: '12px 16px', fontWeight: 700 },
};
