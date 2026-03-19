import React from 'react';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
    return (
        <div className="pilar-dash-wrap">
            <nav className="pilar-nav">
                <div className="nav-logo">
                    <span className="logo-text">PILAR</span>
                    <span className="logo-sub">Paket Lebaran Lancar</span>
                </div>
                <div className="nav-user">
                    <div className="user-info">
                        <span className="user-name">{user.nama}</span>
                        <span className="user-role">{user.role}</span>
                    </div>
                    <button onClick={onLogout} className="btn-logout">
                        Keluar
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                    </button>
                </div>
            </nav>

            <main className="pilar-main">
                <header className="dash-header">
                    <h1>Selamat Datang di <span>PILAR</span></h1>
                    <p>Kelola paket Lebaran Anda dengan mudah dan lancar.</p>
                </header>

                <div className="dash-grid">
                    <div className="dash-card profile-card">
                        <h3>Informasi Akun</h3>
                        <div className="info-item">
                            <label>ID Anggota</label>
                            <span>{user.nomorAnggota || '-'}</span>
                        </div>
                        <div className="info-item">
                            <label>Nomor HP</label>
                            <span>{user.nomorHP || '-'}</span>
                        </div>
                    </div>
                    
                    <div className="dash-card action-card">
                        <h3>Aksi Cepat</h3>
                        <p>Fitur tambahan akan segera hadir untuk memudahkan Anda.</p>
                        <div className="placeholder-content">
                            ✨ Fitur Premium Sedang Disiapkan
                        </div>
                    </div>
                </div>
            </main>

            <footer className="pilar-dash-footer">
                <p>© 2026 <strong>PILAR</strong> — Paket Lebaran Lancar</p>
            </footer>
        </div>
    );
}

export default Dashboard;
