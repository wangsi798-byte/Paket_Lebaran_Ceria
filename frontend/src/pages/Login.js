import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [nomorHP, setNomorHP] = useState('');
    const [otp, setOtp] = useState('');
    const [tahap, setTahap] = useState('kirim'); // 'kirim' atau 'verifikasi'
    const [pesan, setPesan] = useState('');

    const kirimOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/kirim-otp', {
                nomorHP
            });

            setPesan(response.data.message);
            setTahap('verifikasi');
        } catch (error) {
            setPesan(error.response?.data?.message || 'Gagal mengirim OTP');
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
            onLogin(token, user.role);
        } catch (error) {
            setPesan(error.response?.data?.message || 'Gagal verifikasi OTP');
        }
    };

    return (
        <div className="login-container">
            <h2>Login SiPaLe</h2>
            {pesan && <div className="pesan">{pesan}</div>}
            
            {tahap === 'kirim' ? (
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
            ) : (
                <form onSubmit={verifikasiOTP}>
                    <input 
                        type="text" 
                        placeholder="Masukkan OTP" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit">Verifikasi</button>
                    <button 
                        type="button" 
                        onClick={() => setTahap('kirim')}
                    >
                        Kirim Ulang OTP
                    </button>
                </form>
            )}
        </div>
    );
}

export default Login;