import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EtalasePaket = () => {
    const [pakets, setPakets] = useState([]);
    const [filter, setFilter] = useState('semua');
    const [selectedPaket, setSelectedPaket] = useState(null);

    // Kategori paket
    const categories = [
        'semua', 'sembako', 'elektronik', 'fashion', 'barang'
    ];

    // Fetch paket
    useEffect(() => {
        const fetchPakets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/paket', {
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    },
                    params: {
                        kategori: filter === 'semua' ? null : filter
                    }
                });
                setPakets(response.data.data.pakets);
            } catch (error) {
                console.error('Gagal mengambil paket:', error);
            }
        };

        fetchPakets();
    }, [filter]);

    // Modal detail paket
    const PaketDetailModal = ({ paket, onClose }) => {
        if (!paket) return null;

        return (
            <div className="modal-overlay">
                <div className="paket-detail-modal">
                    <button 
                        className="close-modal" 
                        onClick={onClose}
                    >
                        ✕
                    </button>
                    
                    <div className="modal-content">
                        <div className="paket-image">
                            <img 
                                src={paket.gambar || '/default-paket.png'} 
                                alt={paket.nama} 
                            />
                        </div>
                        
                        <div className="paket-info">
                            <h2>{paket.nama}</h2>
                            <p className="kategori">
                                Kategori: {paket.kategori.toUpperCase()}
                            </p>
                            
                            <p className="deskripsi">
                                {paket.deskripsi}
                            </p>
                            
                            <div className="paket-details">
                                <div className="harga">
                                    <strong>Harga:</strong> 
                                    Rp {paket.harga.toLocaleString()}
                                </div>
                                
                                <div className="stok">
                                    <strong>Stok:</strong> 
                                    {paket.stok} tersedia
                                </div>
                            </div>
                            
                            <button 
                                className="pilih-paket"
                                disabled={paket.stok < 1}
                            >
                                {paket.stok > 0 ? 'Pilih Paket' : 'Stok Habis'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="etalase-paket">
            <h1>Etalase Paket Lebaran</h1>
            
            {/* Filter Kategori */}
            <div className="kategori-filter">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        className={filter === cat ? 'active' : ''}
                        onClick={() => setFilter(cat)}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Grid Paket */}
            <div className="paket-grid">
                {pakets.map(paket => (
                    <div 
                        key={paket._id} 
                        className="paket-card"
                        onClick={() => setSelectedPaket(paket)}
                    >
                        <div className="paket-image">
                            <img 
                                src={paket.gambar || '/default-paket.png'} 
                                alt={paket.nama} 
                            />
                            {paket.stok < 1 && (
                                <div className="stok-habis">
                                    Stok Habis
                                </div>
                            )}
                        </div>
                        
                        <div className="paket-info">
                            <h3>{paket.nama}</h3>
                            <p className="kategori">
                                {paket.kategori.toUpperCase()}
                            </p>
                            <div className="harga">
                                Rp {paket.harga.toLocaleString()}
                            </div>
                            <div className="stok">
                                Tersedia: {paket.stok}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Detail Paket */}
            {selectedPaket && (
                <PaketDetailModal 
                    paket={selectedPaket}
                    onClose={() => setSelectedPaket(null)}
                />
            )}

            {/* CSS dalam komponen untuk kemudahan */}
            <style jsx>{`
                .etalase-paket {
                    font-family: 'Arial', sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .kategori-filter {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .kategori-filter button {
                    margin: 0 10px;
                    padding: 10px 20px;
                    background-color: #f0f0f0;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .kategori-filter button.active {
                    background-color: #4CAF50;
                    color: white;
                }

                .paket-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                }

                .paket-card {
                    border: 1px solid #e0e0e0;
                    border-radius: 10px;
                    overflow: hidden;
                    transition: transform 0.3s, box-shadow 0.3s;
                    cursor: pointer;
                }

                .paket-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                .paket-image {
                    position: relative;
                    height: 250px;
                    overflow: hidden;
                }

                .paket-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .stok-habis {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: rgba(255,0,0,0.7);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                }

                .paket-info {
                    padding: 15px;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .paket-detail-modal {
                    background-color: white;
                    border-radius: 10px;
                    width: 80%;
                    max-width: 800px;
                    position: relative;
                }

                .close-modal {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                }

                .modal-content {
                    display: flex;
                    padding: 20px;
                }

                .modal-content .paket-image {
                    flex: 1;
                    margin-right: 20px;
                }

                .modal-content .paket-info {
                    flex: 1;
                }

                .pilih-paket {
                    width: 100%;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    margin-top: 15px;
                }

                .pilih-paket:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default EtalasePaket;