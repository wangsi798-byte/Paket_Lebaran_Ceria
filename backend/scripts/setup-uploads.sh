#!/bin/bash

# Buat direktori uploads
mkdir -p /root/.openclaw/workspace/sipale/backend/uploads/paket
mkdir -p /root/.openclaw/workspace/sipale/backend/uploads/bukti-setoran
mkdir -p /root/.openclaw/workspace/sipale/backend/uploads/bukti-distribusi

# Set permissions
chmod -R 755 /root/.openclaw/workspace/sipale/backend/uploads

echo "Direktori uploads berhasil dibuat"