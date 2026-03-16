#!/bin/bash

# Final Review Script for SiPaLe

# Warna
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Fungsi log
log() {
    echo -e "${GREEN}[REVIEW]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Review Kode
code_review() {
    log "Memulai review kode..."

    # Static code analysis
    npx eslint .
    if [ $? -ne 0 ]; then
        warn "Terdapat potensi masalah kode"
    fi

    # Kompleksitas siklomatis
    npx eslint . --ext .js --format json | \
        jq '.[] | select(.errorCount > 10)' && \
        warn "Beberapa file memiliki kompleksitas tinggi"
}

# Review Keamanan
security_review() {
    log "Menjalankan pemindaian keamanan..."

    # Dependency scanning
    npm audit
    if [ $? -ne 0 ]; then
        warn "Terdapat kerentanan dalam dependencies"
    fi

    # Scan dengan Snyk
    snyk test
    if [ $? -ne 0 ]; then
        error "Ditemukan kerentanan keamanan kritis"
    fi
}

# Pengujian Performa
performance_review() {
    log "Menguji performa..."

    # Load testing
    npx artillery run performance_test.yml
    if [ $? -ne 0 ]; then
        warn "Potensi masalah performa terdeteksi"
    fi
}

# Review Dokumentasi
documentation_review() {
    log "Memeriksa dokumentasi..."

    # Cek kelengkapan dokumentasi
    find . -name "*.md" | xargs grep -L "## " && \
        warn "Beberapa file dokumentasi tidak lengkap"
}

# Review Konfigurasi
config_review() {
    log "Meninjau konfigurasi..."

    # Validasi file konfigurasi
    for config in .env.* config/*.json; do
        jq empty "$config" 2>/dev/null || \
            warn "Konfigurasi $config tidak valid"
    done
}

# Main Review Workflow
main() {
    log "🔍 Memulai Review Final SiPaLe"

    code_review
    security_review
    performance_review
    documentation_review
    config_review

    log "🎉 Review Final Selesai"
}

# Jalankan
main