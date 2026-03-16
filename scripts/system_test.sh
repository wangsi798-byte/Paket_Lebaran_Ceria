#!/bin/bash

# Comprehensive System Test Script for SiPaLe

# Warna
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Variabel
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:3000"

# Fungsi log
log() {
    echo -e "${GREEN}[TEST]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Uji Keamanan Backend
test_backend_security() {
    log "Menguji keamanan backend..."

    # Tes rate limiting
    for i in {1..10}; do
        response=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/api/users/login")
        if [[ $response -eq 429 ]]; then
            log "Rate limiting berfungsi"
            break
        fi
    done

    # Tes security headers
    headers=$(curl -I "${BACKEND_URL}" 2>/dev/null)
    
    echo "$headers" | grep -q "X-XSS-Protection" && log "XSS Protection Header Ada" || warn "XSS Protection Header Tidak Ada"
    echo "$headers" | grep -q "X-Frame-Options" && log "Frame Options Header Ada" || warn "Frame Options Header Tidak Ada"
    echo "$headers" | grep -q "X-Content-Type-Options" && log "Content Type Options Header Ada" || warn "Content Type Options Header Tidak Ada"
}

# Uji Endpoint Backend
test_backend_endpoints() {
    log "Menguji endpoint backend..."

    # Tes health check
    health_response=$(curl -s "${BACKEND_URL}/health")
    echo "$health_response" | grep -q "healthy" && log "Health Check Berhasil" || error "Health Check Gagal"

    # Tes autentikasi
    login_response=$(curl -s -X POST "${BACKEND_URL}/api/users/login" \
        -H "Content-Type: application/json" \
        -d '{"nomorHP":"081234567890"}')
    
    echo "$login_response" | grep -q "OTP" && log "Login Endpoint Berfungsi" || error "Login Endpoint Bermasalah"
}

# Uji Frontend
test_frontend() {
    log "Menguji frontend..."

    # Tes ketersediaan
    frontend_response=$(curl -s -o /dev/null -w "%{http_code}" "${FRONTEND_URL}")
    [[ $frontend_response -eq 200 ]] && log "Frontend Dapat Diakses" || error "Frontend Tidak Dapat Diakses"
}

# Uji Koneksi Database
test_database_connection() {
    log "Menguji koneksi database..."
    
    docker-compose exec mongodb mongo --quiet sipale --eval "db.runCommand({connectionStatus: 1})" | grep -q "ok" \
        && log "Koneksi MongoDB Berhasil" \
        || error "Koneksi MongoDB Gagal"
}

# Uji Monitoring
test_monitoring() {
    log "Menguji endpoint monitoring..."

    # Tes Prometheus metrics
    metrics_response=$(curl -s "${BACKEND_URL}/metrics")
    echo "$metrics_response" | grep -q "http_request_duration_ms" \
        && log "Prometheus Metrics Tersedia" \
        || warn "Prometheus Metrics Tidak Lengkap"
}

# Main Test Workflow
main() {
    log "🧪 Memulai Pengujian Sistem SiPaLe"

    test_backend_security
    test_backend_endpoints
    test_frontend
    test_database_connection
    test_monitoring

    log "🎉 Pengujian Sistem Selesai"
}

# Jalankan
main