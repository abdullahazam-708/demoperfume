import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passkey, setPasskey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [view, setView] = useState('login'); // 'login', 'forgot', 'reset'
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const redirect = location.search ? location.search.split('=')[1] : '/';

    const userInfo = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null;

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post(`${API_BASE_URL}/users/login`, {
                email,
                password,
            });

            sessionStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect);
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

            sessionStorage.setItem('userInfo', JSON.stringify(data));
            setSuccess('Password reset successful! Logging in...');
            setTimeout(() => navigate(redirect), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired passkey');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>
                            {view === 'login' ? 'Login' : view === 'forgot' ? 'Forgot Password' : 'Reset Password'}
                        </h1>
                        <p>
                            {view === 'login' 
                                ? 'Please enter your details to sign in' 
                                : view === 'forgot' 
                                ? 'Enter your email to receive a passkey' 
                                : 'Enter the passkey sent to your email and your new password'}
                        </p>
                    </div>

                    {error && <div className="login-error">{error}</div>}
                    {success && <div className="login-success">{success}</div>}

                    {view === 'login' && (
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="forgot-password-link">
                                <button type="button" onClick={() => setView('forgot')}>
                                    Forgot Password?
                                </button>
                            </div>

                            <button type="submit" className="login-submit-btn" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    )}

                    {view === 'forgot' && (
                        <form onSubmit={handleForgotPassword} className="login-form">
                            <div className="form-group">
                                <label htmlFor="forgot-email">Email Address</label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <button type="submit" className="login-submit-btn" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Passkey'}
                            </button>

                            <div className="back-to-login">
                                <button type="button" onClick={() => setView('login')}>
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    {view === 'reset' && (
                        <form onSubmit={handleResetPassword} className="login-form">
                            <div className="form-group">
                                <label htmlFor="passkey">Passkey (6 digits)</label>
                                <input
                                    id="passkey"
                                    type="text"
                                    value={passkey}
                                    onChange={(e) => setPasskey(e.target.value)}
                                    placeholder="123456"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="new-password">New Password</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button type="submit" className="login-submit-btn" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>

                            <div className="back-to-login">
                                <button type="button" onClick={() => setView('forgot')}>
                                    Resend Passkey
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
