import React from 'react';
import { Link } from 'react-router-dom';

const features = [
    { title: 'Find an inspector', text: 'Compare local vehicle inspection professionals and choose the right expert.', to: '/inspectors', icon: '🔎' },
    { title: 'Ratings & reviews', text: 'Read customer feedback to make an informed decision before you book.', to: '/ratings-reviews', icon: '⭐' },
    { title: 'Repair information', text: 'Explore common vehicle faults and estimated repair costs by category.', to: '/repair-info', icon: '🧰' },
    { title: 'Hire directly', text: 'Send your inspection request and keep track of its progress online.', to: '/hire', icon: '📋' },
];

export default function HomePage() {
    return (
        <div>
            <section style={styles.hero}>
                <div style={styles.heroInner}>
                    <p style={styles.eyebrow}>VEHICLE CARE, MADE CLEAR</p>
                    <h1 style={styles.title}>Know your vehicle.<br />Drive with confidence.</h1>
                    <p style={styles.intro}>Connect with trusted inspectors, understand common repairs, and make your next vehicle decision with confidence.</p>
                    <Link to="/inspectors" style={styles.cta}>Find an inspector <span aria-hidden="true">→</span></Link>
                </div>
            </section>
            <section style={styles.section}>
                <div style={styles.sectionHeading}>
                    <p style={styles.eyebrowDark}>YOUR VEHICLE, BETTER INFORMED</p>
                    <h2 style={styles.heading}>Everything you need to get started</h2>
                </div>
                <div style={styles.grid}>
                    {features.map((feature) => (
                        <Link to={feature.to} key={feature.title} style={styles.card}>
                            <span style={styles.icon} aria-hidden="true">{feature.icon}</span>
                            <h3 style={styles.cardTitle}>{feature.title}</h3>
                            <p style={styles.cardText}>{feature.text}</p>
                            <span style={styles.cardLink}>Explore <span aria-hidden="true">→</span></span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

const styles = {
    hero: { background: 'linear-gradient(120deg, #1a237e 0%, #283593 60%, #1565c0 100%)', color: '#fff', padding: '86px 24px 96px' },
    heroInner: { maxWidth: 1120, margin: '0 auto' },
    eyebrow: { color: '#c5cae9', fontWeight: 700, fontSize: 13, letterSpacing: 2 },
    title: { margin: '18px 0', fontSize: 'clamp(38px, 6vw, 64px)', lineHeight: 1.08, letterSpacing: -1.5 },
    intro: { maxWidth: 580, color: '#e8eaf6', fontSize: 18, lineHeight: 1.7, marginBottom: 30 },
    cta: { display: 'inline-flex', gap: 12, alignItems: 'center', background: '#fff', color: '#1a237e', padding: '14px 20px', borderRadius: 9, textDecoration: 'none', fontWeight: 700 },
    section: { maxWidth: 1120, margin: '0 auto', padding: '58px 24px 76px' },
    sectionHeading: { marginBottom: 28 },
    eyebrowDark: { color: '#3949ab', fontWeight: 700, fontSize: 12, letterSpacing: 1.6 },
    heading: { color: '#172554', margin: '8px 0', fontSize: 30 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 },
    card: { background: '#fff', padding: 24, borderRadius: 14, boxShadow: '0 8px 24px #1725540d', border: '1px solid #e5e7eb', textDecoration: 'none', color: 'inherit' },
    icon: { fontSize: 30 },
    cardTitle: { color: '#1e293b', fontSize: 19, margin: '17px 0 8px' },
    cardText: { color: '#64748b', lineHeight: 1.6, minHeight: 70, margin: 0 },
    cardLink: { color: '#283593', display: 'inline-block', marginTop: 16, fontWeight: 700, fontSize: 14 },
};
