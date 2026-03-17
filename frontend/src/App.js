import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

// API Base URL - gunakan environment variable atau fallback ke localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ============================================
// Komponen Login - Premium Lebaran Theme
// ============================================
const Login = ({ onLoginSuccess }) => {
    const [nomorHP, setNomorHP] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('input-hp');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const kirimOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const response = await axios.post(`${API_URL}/api/auth/kirim-otp`, { nomorHP });
            setMessage({ text: response.data.message || 'OTP berhasil dikirim!', type: 'success' });
            setStep('input-otp');
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || 'Gagal mengirim OTP. Coba lagi.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const verifikasiOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const response = await axios.post(`${API_URL}/api/auth/verifikasi-otp`, { 
                nomorHP, 
                otp 
            });
            
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            setMessage({ text: 'Login berhasil! Mengalihkan...', type: 'success' });
            setTimeout(() => onLoginSuccess(user), 800);
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || 'Kode OTP salah. Coba lagi.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const kembaliKeHP = () => {
        setStep('input-hp');
        setOtp('');
        setMessage({ text: '', type: '' });
    };

    return (
        <div className="login-page">
            {/* Background decorations */}
            <div className="pattern-overlay"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>

            <div className="login-container">
                {/* Brand / Logo */}
                <div className="login-brand">
                    <div className="login-logo">
                        <span className="login-logo-icon">🌙</span>
                    </div>
                    <h1>
                        <span className="brand-highlight">Si</span>Pa<span className="brand-highlight">Le</span>
                    </h1>
                    <p>Sistem Paket Lebaran Ceria</p>
                </div>

                {/* Alert Message */}
                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        <span className="alert-icon">
                            {message.type === 'error' ? '⚠️' : message.type === 'success' ? '✅' : 'ℹ️'}
                        </span>
                        {message.text}
                    </div>
                )}

                {/* Step 1: Input Nomor HP */}
                {step === 'input-hp' && (
                    <form onSubmit={kirimOTP}>
                        <div className="form-group">
                            <label>Nomor Handphone</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📱</span>
                                <input 
                                    type="tel" 
                                    placeholder="Contoh: 08123456789" 
                                    value={nomorHP}
                                    onChange={(e) => setNomorHP(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading || !nomorHP}>
                            {loading && <span className="spinner"></span>}
                            {loading ? 'Mengirim...' : '🚀 Kirim Kode OTP'}
                        </button>
                    </form>
                )}

                {/* Step 2: Input OTP */}
                {step === 'input-otp' && (
                    <form onSubmit={verifikasiOTP}>
                        <div className="otp-info">
                            <p>Kode OTP dikirim ke</p>
                            <span className="otp-phone">{nomorHP}</span>
                        </div>
                        <div className="form-group">
                            <label>Kode OTP</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔐</span>
                                <input 
                                    type="text" 
                                    placeholder="Masukkan 6 digit OTP" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    autoFocus
                                    maxLength={6}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading || !otp}>
                            {loading && <span className="spinner"></span>}
                            {loading ? 'Memverifikasi...' : '✨ Verifikasi & Masuk'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={kembaliKeHP}>
                            ← Ubah Nomor HP
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="login-footer">
                    <p>© 2026 <span className="footer-brand">SiPaLe</span> — Paket Lebaran Ceria</p>
                </div>
            </div>
        </div>
    );
};

// ============================================
// Komponen Dashboard - Premium Design
// ============================================
const Dashboard = ({ user, onLogout }) => {
    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1><span className="header-icon">🌙</span> SiPaLe Dashboard</h1>
                <button className="btn-logout" onClick={onLogout}>
                    Logout
                </button>
            </header>

            <div className="dashboard-content">
                <div className="welcome-card">
                    <h2>
                        <span className="welcome-emoji">👋</span>
                        Selamat Datang, {user.nama}!
                    </h2>
                    <p className="welcome-greeting">
                        Semoga Lebaran tahun ini penuh berkah dan kebahagiaan 🌟
                    </p>
                </div>

                <div className="info-grid">
                    <div className="info-card">
                        <div className="card-icon green">👤</div>
                        <div className="card-label">Nama Lengkap</div>
                        <div className="card-value">{user.nama}</div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon gold">🏷️</div>
                        <div className="card-label">Role</div>
                        <div className="card-value">{user.role}</div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon blue">🔢</div>
                        <div className="card-label">Nomor Anggota</div>
                        <div className="card-value">{user.nomorAnggota}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// Komponen Utama
// ============================================
const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Future: validate token with backend
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <div>
            {user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;
