#!/bin/bash

# Lokasi project
PROJECT_DIR="/root/.openclaw/workspace/sipale/frontend"

# Masuk direktori
cd "$PROJECT_DIR"

# Instalasi dependensi
npm install

# Buat public index.html
mkdir -p public
cat > public/index.html << EOL
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SiPaLe - Sistem Informasi Paket Lebaran</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div id="root"></div>
</body>
</html>
EOL

# Buat file CSS dasar
cat > public/styles.css << EOL
body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f6f9;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.login-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
}

input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.pesan {
    color: red;
    text-align: center;
    margin-bottom: 15px;
}
EOL

# Jalankan frontend
REACT_APP_API_URL=http://localhost:5000/api npm start