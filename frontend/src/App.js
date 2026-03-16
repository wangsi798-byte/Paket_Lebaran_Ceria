import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Komponen Login
const Login = ({ onLoginSuccess }) => {
    const [nomorHP, setNomorHP] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('input-hp');
    const [message, setMessage] = useState('');

    const kirimOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/kirim-otp', { nomorHP });
            setMessage(response.data.message);
            setStep('input-otp');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Gagal mengirim OTP');
        }
    };

    const verifikasiOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/verifikasi-otp', { 
                nomorHP, 
                otp 
            });
            
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            onLoginSuccess(user);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Gagal verifikasi OTP');
        }
    };

    return (
        <div className="login-container">
            <h2>Login SiPaLe</h2>
            {message && <div className="error-message">{message}</div>}

            {step === 'input-hp' && (
                <form onSubmit={kirimOTP}>
                    <input 
                        type="text" 
                        placeholder="Nomor HP" 
                        value={nomorHP}
                        onChange={(e) => setNomorHP(e.target.value)}
                        required
                    />
                    <button type="submit">Kirim OTP</button>
                </form>
            )}

            {step === 'input-otp' && (
                <form onSubmit={verifikasiOTP}>
                    <input 
                        type="text" 
                        placeholder="Masukkan OTP" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit">Verifikasi</button>
                </form>
            )}
        </div>
    );
};

// Komponen Dashboard
const Dashboard = ({ user, onLogout }) => {
    return (
        <div className="dashboard">
            <h2>Dashboard SiPaLe</h2>
            <p>Selamat datang, {user.nama}!</p>
            <p>Role: {user.role}</p>
            <p>Nomor Anggota: {user.nomorAnggota}</p>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
};

// Komponen Utama
const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Validasi token di sini
            // Anda bisa menambahkan fungsi untuk memeriksa token yang valid
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
        <div className="app-container">
            {user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;