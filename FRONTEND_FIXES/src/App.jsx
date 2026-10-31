import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RepairInfo from './pages/RepairInfo';
import RatingsReviews from './pages/RatingsReviews';
import HireDirectly from './pages/HireDirectly';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import InspectorSearch from './pages/customer/InspectorSearch';
import InspectorProfile from './pages/customer/InspectorProfile';
import MyRequests from './pages/customer/MyRequests';
import InspectorDashboard from './pages/inspector/InspectorDashboard';
import AdminPanel from './pages/admin/AdminPanel';

function RequireRole({ roles, children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    if (!roles.includes(user.role)) {
        const home = user.role === 'ADMIN' ? '/admin' : user.role === 'INSPECTOR' ? '/dashboard' : '/';
        return <Navigate to={home} replace />;
    }
    return children;
}

function AppRoutes() {
    return (
        <>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 64px)', background: '#f5f7fb' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/inspectors" element={<InspectorSearch />} />
                    <Route path="/inspectors/:id" element={<InspectorProfile />} />
                    <Route path="/repair-info" element={<RepairInfo />} />
                    <Route path="/ratings-reviews" element={<RatingsReviews />} />
                    <Route path="/hire" element={<RequireRole roles={['CUSTOMER']}><HireDirectly /></RequireRole>} />
                    <Route path="/my-requests" element={<RequireRole roles={['CUSTOMER']}><MyRequests /></RequireRole>} />
                    <Route path="/dashboard" element={<RequireRole roles={['INSPECTOR']}><InspectorDashboard /></RequireRole>} />
                    <Route path="/admin" element={<RequireRole roles={['ADMIN']}><AdminPanel /></RequireRole>} />
                    <Route path="*" element={<div style={{ padding: 64, textAlign: 'center', color: '#334155' }}><h2>404 — Page not found</h2><a href="/" style={{ color: '#1a237e' }}>Return home</a></div>} />
                </Routes>
            </main>
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
