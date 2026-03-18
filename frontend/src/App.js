import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

// API Base URL - gunakan environment variable atau fallback ke localhost

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
            const response = await axios.post(`/api/auth/kirim-otp`, { nomorHP });
            if (response.data.status === 'success') {
                setMessage({ text: response.data.message || 'OTP berhasil dikirim!', type: 'success' });
                setStep('input-otp');
            } else {
                setMessage({ text: response.data.message || 'Gagal mengirim OTP.', type: 'error' });
            }
        } catch (error) {
            console.error('Full Error Object:', error);
            const status = error.response?.status;
            const data = error.response?.data;
            const backendError = data?.error || data?.details || '';
            const errorMsg = data?.message || error.message || 'Gagal menyambung ke server.';
            
            setMessage({ 
                text: `Gagal (${status || 'Network'}): ${errorMsg}${backendError ? ' - ' + backendError : ''}`, 
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
            const response = await axios.post(`/api/auth/verifikasi-otp`, { 
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
                        <span className="login-logo-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2.5 11.5L11.5 2.5" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12.5 21.5L21.5 12.5" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2.5 12.5L12.5 22.5" stroke="#818CF8" strokeWidth="2"/>
                                <path d="M11.5 1.5L21.5 11.5" stroke="#818CF8" strokeWidth="2"/>
                                <path d="M12 2V22" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="2 2"/>
                                <path d="M2 12H22" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="2 2"/>
                            </svg>
                        </span>
                    </div>
                    <h1>
                        Pilar
                    </h1>
                    <p>Paket Idul Fitri Lancar</p>
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
                    <p>© 2026 <span className="footer-brand">Pilar</span> — Paket Idul Fitri Lancar</p>
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
                <h1><span className="header-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: 'middle', marginRight: '8px', marginBottom: '4px'}}>
                        <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.5 11.5L11.5 2.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.5 21.5L21.5 12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 2V22" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="2 2"/>
                        <path d="M2 12H22" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="2 2"/>
                    </svg>
                </span> Pilar Dashboard</h1>
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