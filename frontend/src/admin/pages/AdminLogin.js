import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSettings } from '../../context/SettingsContext';
import API_BASE_URL from '../../config/api';
import '../AdminStyles.css';

const AdminLogin = () => {
    const { settings } = useSettings();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passkey, setPasskey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [view, setView] = useState('login'); // 'login', 'forgot', 'reset'
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post(`${API_BASE_URL}/users/login`, {
                email,
                password,
            });

            if (data.isAdmin) {
                sessionStorage.setItem('userInfo', JSON.stringify(data));
                navigate('/admin/dashboard');
            } else {
                setError('You are not authorized as an Admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await axios.post(`${API_BASE_URL}/users/forgotpassword`, { email });
            setSuccess('Passkey sent to your email!');
            setView('reset');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending passkey');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.put(`${API_BASE_URL}/users/resetpassword`, {
                resetToken: passkey,
                password: newPassword,
            });

            if (data.isAdmin) {
                sessionStorage.setItem('userInfo', JSON.stringify(data));
                setSuccess('Password reset successful! Logging in...');
                setTimeout(() => navigate('/admin/dashboard'), 2000);
            } else {
                setError('Password reset but you are not an admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired passkey');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f6f6f7'
        }}>
            <div className="admin-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#008060', margin: 0 }}>
                        {view === 'login' ? `${settings.shopName || 'Perfume'} Admin` : view === 'forgot' ? 'Reset Passkey' : 'Set New Password'}
                    </h1>
                    <p style={{ color: '#6d7175', marginTop: '10px' }}>
                        {view === 'login' ? 'Sign in to continue' : view === 'forgot' ? 'Enter email for passkey' : 'Enter passkey and new password'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fff4f4',
                        color: '#d82c0d',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        {success}
                    </div>
                )}

                {view === 'login' && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="admin@perfumeshop.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                            <button 
                                type="button" 
                                onClick={() => setView('forgot')}
                                style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.9rem', cursor: 'pointer' }}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="admin-btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                )}

                {view === 'forgot' && (
                    <form onSubmit={handleForgotPassword}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="admin@perfumeshop.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-btn-primary"
                            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Passkey'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button 
                                type="button" 
                                onClick={() => setView('login')}
                                style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.9rem', cursor: 'pointer' }}
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}

                {view === 'reset' && (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label className="form-label">Passkey (6 digits)</label>
                            <input
                                type="text"
                                value={passkey}
                                onChange={(e) => setPasskey(e.target.value)}
                                className="form-input"
                                placeholder="123456"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-btn-primary"
                            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button 
                                type="button" 
                                onClick={() => setView('forgot')}
                                style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.9rem', cursor: 'pointer' }}
                            >
                                Resend Passkey
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;
