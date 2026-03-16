const axios = require('axios');

const ENDPOINTS = [
    { 
        url: 'http://localhost:5000/health', 
        name: 'Health Check Backend' 
    },
    { 
        url: 'http://localhost:5000/api/users/daftar', 
        name: 'Daftar Pengguna',
        method: 'get',
        requiresAuth: true
    },
    { 
        url: 'http://localhost:5000/api/auth/kirim-otp', 
        name: 'Kirim OTP',
        method: 'post',
        data: { nomorHP: '081234567890' }
    }
];

async function checkEndpoint(endpoint) {
    try {
        const config = {
            method: endpoint.method || 'get',
            url: endpoint.url,
        };

        if (endpoint.data) {
            config.data = endpoint.data;
        }

        if (endpoint.requiresAuth) {
            // Tambahkan logika token jika perlu
            config.headers = {
                'Authorization': `Bearer ${process.env.TEST_TOKEN || ''}`
            };
        }

        const start = Date.now();
        const response = await axios(config);
        const duration = Date.now() - start;

        console.log(`✅ ${endpoint.name}`);
        console.log(`   URL: ${endpoint.url}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Waktu Respons: ${duration}ms\n`);

        return {
            name: endpoint.name,
            status: 'success',
            responseTime: duration
        };
    } catch (error) {
        console.log(`❌ ${endpoint.name}`);
        console.log(`   URL: ${endpoint.url}`);
        console.log(`   Error: ${error.message}\n`);

        return {
            name: endpoint.name,
            status: 'failed',
            error: error.message
        };
    }
}

async function checkAllEndpoints() {
    console.log('🔍 Pemeriksaan Endpoint SiPaLe\n');
    
    const results = await Promise.all(
        ENDPOINTS.map(checkEndpoint)
    );

    const summary = results.reduce((acc, result) => {
        acc[result.status] = (acc[result.status] || 0) + 1;
        return acc;
    }, { success: 0, failed: 0 });

    console.log('📊 Rangkuman:');
    console.log(`   Berhasil: ${summary.success}`);
    console.log(`   Gagal: ${summary.failed}`);
}

checkAllEndpoints().catch(console.error);