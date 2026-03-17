#!/bin/bash

echo "MongoDB Connection Test"
echo "----------------------"

# Cek apakah npm terinstal
if ! command -v npm &> /dev/null
then
    echo "npm tidak terinstal. Mohon instal Node.js dan npm."
    exit 1
fi

# Instal dependensi
npm install mongodb mongoose dotenv

# Jalankan script Node.js
node << EOF
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    
    console.log('Connection URI:', uri.replace(/:[^:]*@/, ':****@'));
    
    const client = new MongoClient(uri);
    
    try {
        console.log('Mencoba koneksi...');
        await client.connect();
        console.log('✅ Koneksi berhasil!');
        
        const database = client.db('sipale');
        console.log('Database:', database.databaseName);
        
        const collections = await database.listCollections().toArray();
        console.log('Koleksi yang ada:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });
    } catch (error) {
        console.error('❌ Gagal koneksi:');
        console.error('Error:', error.message);
    } finally {
        await client.close();
    }
}

testConnection();
EOF