import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function OTPInput({ value, onChange, disabled }) {
    const digits = value.padEnd(6, ' ').split('');

    const handleKey = (e, idx) => {
        if (e.key === 'Backspace') {
            const newVal = value.slice(0, idx) + value.slice(idx + 1);
            onChange(newVal);
            if (idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
        } else if (/^\d$/.test(e.key)) {
            const newVal = (value.slice(0, idx) + e.key + value.slice(idx + 1)).slice(0, 6);
            onChange(newVal);
            if (idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
        }
        e.preventDefault();
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted) { onChange(pasted); e.preventDefault(); }
    };

    return (
        <div className="otp-boxes">
            {[0,1,2,3,4,5].map(idx => (
                <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[idx] !== ' ' ? digits[idx] : ''}
                    onChange={() => {}}
                    onKeyDown={(e) => handleKey(e, idx)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`otp-box ${digits[idx] && digits[idx] !== ' ' ? 'filled' : ''}`}
                    autoFocus={idx === 0}
                />
            ))}
        </div>
    );
}

function Login({ onLogin }) {
    const [nomorHP, setNomorHP] = useState('');
    const [otp, setOtp] = useState('');
    const [tahap, setTahap] = useState('kirim');
    const [pesan, setPesan] = useState({ teks: '', tipe: '' });
    const [otpDebug, setOtpDebug] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

    const kirimOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPesan({ teks: '', tipe: '' });
        try {
            const response = await axios.post(`${API_URL}/api/auth/kirim-otp`, { nomorHP });
            setPesan({ teks: response.data.message, tipe: 'success' });
            if (response.data.debug?.otp) setOtpDebug(response.data.debug.otp);
            setTahap('verifikasi');
        } catch (error) {
            const msg = error.response?.data?.message || 'Gagal mengirim OTP. Pastikan server berjalan.';
            setPesan({ teks: msg, tipe: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const verifikasiOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPesan({ teks: '', tipe: '' });
        try {
            const response = await axios.post(`${API_URL}/api/auth/verifikasi-otp`, { nomorHP, otp });
            const { token, user } = response.data.data;
            onLogin(token, user.role);
        } catch (error) {
            const msg = error.response?.data?.message || 'OTP tidak valid atau sudah kadaluarsa';
            setPesan({ teks: msg, tipe: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`pilar-wrap ${mounted ? 'mounted' : ''}`}>
            <div className="bg-deco">
                <div className="bg-orb orb1"/>
                <div className="bg-orb orb2"/>
                
                {/* MODERN LUXURY ASSETS */}
                <img src="/mosque_silhouette_gold.png" className="mosque-bg" alt="" />
                
                <div className="float-asset ketupat-wrap">
                    <img src="/ketupat_gold.png" alt="Ketupat" width="100%" />
                </div>
                
                <div className="float-asset bedug-wrap">
                    <img src="/bedug_luxury.png" alt="Bedug" width="100%" />
                </div>
            </div>

            <div className="pilar-card">
                <div className="pilar-logo-wrap">
                    <div className="pilar-logo">
                        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="g1" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#F7E070"/>
                                    <stop offset="100%" stopColor="#C08A1E"/>
                                </linearGradient>
                            </defs>
                            <polygon points="32,4 60,18 60,46 32,60 4,46 4,18" fill="url(#g1)" opacity="0.12"/>
                            <polygon points="32,4 60,18 60,46 32,60 4,46 4,18" stroke="url(#g1)" strokeWidth="1.8" fill="none"/>
                            <polygon points="32,14 50,23.5 50,40.5 32,50 14,40.5 14,23.5" stroke="url(#g1)" strokeWidth="1" fill="none" opacity="0.5"/>
                            <path d="M32 19 L36 26 L44 27.5 L38.5 33 L40 41 L32 37.5 L24 41 L25.5 33 L20 27.5 L28 26 Z" fill="url(#g1)"/>
                        </svg>
                    </div>
                    <h1 className="pilar-brand">PILAR</h1>
                    <p className="pilar-tagline">Paket Lebaran Lancar</p>
                </div>

                <div className="ornamen-divider">
                    <span className="div-line"/>
                    <span className="div-diamond"/>
                    <span className="div-dot"/>
                    <span className="div-diamond"/>
                    <span className="div-line"/>
                </div>

                {pesan.teks && (
                    <div className={`pilar-alert ${pesan.tipe}`}>
                        <span className="alert-icon">{pesan.tipe === 'error' ? '✕' : '✓'}</span>
                        <span>{pesan.teks}</span>
                    </div>
                )}

                {otpDebug && (
                    <div className="otp-debug-badge">
                        <span className="debug-label">🔑 Kode OTP Anda</span>
                        <span className="debug-otp">{otpDebug}</span>
                    </div>
                )}

                <div className="pilar-form-wrap">
                    {tahap === 'kirim' ? (
                        <form onSubmit={kirimOTP} className="pilar-form">
                            <div className="form-group">
                                <label>Nomor Handphone</label>
                                <div className="input-wrap">
                                    <span className="input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.0 1.14 2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.64a16 16 0 006.29 6.29l1.16-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                                        </svg>
                                    </span>
                                    <input
                                        type="tel"
                                        placeholder="08xxxxxxxxxx"
                                        value={nomorHP}
                                        onChange={(e) => setNomorHP(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="pilar-btn" disabled={loading}>
                                {loading
                                    ? <span className="btn-loading"><span className="spinner"/><span>Mengirim...</span></span>
                                    : <><span>Kirim Kode OTP</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg></>
                                }
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={verifikasiOTP} className="pilar-form">
                            <div className="form-group">
                                <label>Kode OTP</label>
                                <p className="otp-hint">Dikirim ke <strong>{nomorHP}</strong></p>
                                <OTPInput value={otp} onChange={setOtp} disabled={loading}/>
                            </div>
                            <button type="submit" className={`pilar-btn ${otp.length === 6 ? 'ready' : ''}`} disabled={loading || otp.length < 6}>
                                {loading
                                    ? <span className="btn-loading"><span className="spinner"/><span>Memverifikasi...</span></span>
                                    : <><span>Masuk Sekarang</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg></>
                                }
                            </button>
                            <button type="button" className="pilar-btn-ghost" onClick={() => { setTahap('kirim'); setOtpDebug(''); setPesan({ teks: '', tipe: '' }); setOtp(''); }} disabled={loading}>
                                ← Ganti Nomor HP
                            </button>
                        </form>
                    )}
                </div>

                <p className="pilar-footer">© 2026 <strong>PILAR</strong> — Paket Lebaran Lancar</p>
            </div>
        </div>
    );
}

export default Login;
