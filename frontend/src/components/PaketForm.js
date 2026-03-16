import React, { useState } from 'react';
import axios from 'axios';

const PaketForm = () => {
    const [formData, setFormData] = useState({
        nama: '',
        kategori: 'sembako',
        deskripsi: '',
        harga: '',
        stok: '',
        gambar: null
    });

    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            gambar: file
        }));

        // Preview gambar
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Buat FormData untuk upload
        const uploadData = new FormData();
        uploadData.append('nama', formData.nama);
        uploadData.append('kategori', formData.kategori);
        uploadData.append('deskripsi', formData.deskripsi);
        uploadData.append('harga', formData.harga);
        uploadData.append('stok', formData.stok);
        
        // Tambahkan gambar jika ada
        if (formData.gambar) {
            uploadData.append('gambar', formData.gambar);
        }

        try {
            const response = await axios.post('/api/paket', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            alert('Paket berhasil ditambahkan!');
            console.log(response.data);
        } catch (error) {
            alert('Gagal menambahkan paket');
            console.error(error);
        }
    };

    return (
        <div className="paket-form">
            <h2>Tambah Paket Baru</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nama Paket</label>
                    <input 
                        type="text" 
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div>
                    <label>Kategori</label>
                    <select 
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleChange}
                    >
                        <option value="sembako">Sembako</option>
                        <option value="elektronik">Elektronik</option>
                        <option value="fashion">Fashion</option>
                        <option value="barang">Barang Lainnya</option>
                    </select>
                </div>

                <div>
                    <label>Deskripsi</label>
                    <textarea 
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Harga</label>
                    <input 
                        type="number" 
                        name="harga"
                        value={formData.harga}
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div>
                    <label>Stok</label>
                    <input 
                        type="number" 
                        name="stok"
                        value={formData.stok}
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div>
                    <label>Gambar Paket</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {preview && (
                        <div>
                            <h3>Preview Gambar</h3>
                            <img 
                                src={preview} 
                                alt="Preview Paket" 
                                style={{maxWidth: '300px', maxHeight: '300px'}} 
                            />
                        </div>
                    )}
                </div>

                <button type="submit">Tambah Paket</button>
            </form>
        </div>
    );
};

export default PaketForm;