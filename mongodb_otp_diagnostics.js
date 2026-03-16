const { MongoClient } = require('mongodb');

async function diagnosticOTP() {
    const uri = 'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/sipale';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('sipale');
        const usersCollection = database.collection('users');

        console.log('🔍 Diagnostik OTP\n');

        // Cari semua pengguna
        const users = await usersCollection.find({
            $or: [
                { otp: { $exists: true } },
                { otpExpires: { $exists: true } }
            ]
        }).toArray();

        console.log(`👥 Total Pengguna dengan OTP/Expires: ${users.length}\n`);

        users.forEach(user => {
            console.log(`📱 Nomor HP: ${user.nomorHP}`);
            console.log(`👤 Nama: ${user.nama}`);
            console.log('OTP:', user.otp ? 'Ada' : 'Tidak Ada');
            console.log('OTP Expires:', user.otpExpires ? new Date(user.otpExpires).toISOString() : 'Tidak Ada');
            console.log('Status OTP:', 
                user.otp && user.otpExpires && new Date(user.otpExpires) > new Date() 
                    ? 'Valid' 
                    : 'Kadaluarsa'
            );
            console.log('---\n');
        });

    } catch (error) {
        console.error('❌ Gagal diagnostik:', error);
    } finally {
        await client.close();
    }
}

diagnosticOTP();