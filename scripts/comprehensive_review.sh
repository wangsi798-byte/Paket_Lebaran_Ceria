#!/bin/bash

# Comprehensive Review Script for SiPaLe

# Warna
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Variabel
PROJECT_DIR="/root/.openclaw/workspace/sipale"
BACKEND_DIR="${PROJECT_DIR}/backend"
FRONTEND_DIR="${PROJECT_DIR}/frontend"

# Fungsi Log
log() {
    echo -e "${GREEN}[REVIEW]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Review Kode Backend
backend_review() {
    log "🔍 Review Backend"
    cd "${BACKEND_DIR}"

    # Lint
    npx eslint src/ --format stylish
    
    # Type checking (jika pakai TypeScript)
    npx tsc --noEmit
    
    # Kompleksitas siklomatis
    npx eslint src/ --ext .js \
        --rule "complexity: [warn, 10]"
}

# Review Frontend
frontend_review() {
    log "🖥️ Review Frontend"
    cd "${FRONTEND_DIR}"

    # Lint React
    npx eslint src/ --ext .js,.jsx,.ts,.tsx
    
    # Periksa bundle size
    npm run build
    npx webpack-bundle-analyzer stats.json
}

# Pengujian Keamanan
security_audit() {
    log "🔒 Audit Keamanan"
    
    # Dependency vulnerability scan
    npm audit --audit-level=high
    
    # OWASP ZAP Scan (jika tersedia)
    zap-cli quick-scan \
        --self-contained \
        --start-url http://localhost:3000
}

# Tes Performa
performance_test() {
    log "⚡ Tes Performa"
    
    # Load testing
    npx artillery run performance_test.yml
    
    # Lighthouse (jika ada)
    npx lighthouse http://localhost:3000 \
        --view
}

# Review Arsitektur
architecture_review() {
    log "🏗️ Review Arsitektur"
    
    # Cek dependensi
    npx madge --circular \
        --extension js \
        ./src
    
    # Kompleksitas arsitektur
    npx complexity-report \
        --filePattern "**/*.js"
}

# Validasi Environment
env_validation() {
    log "🌐 Validasi Environment"
    
    # Periksa variabel environment
    cd "${PROJECT_DIR}"
    
    # Pastikan tidak ada credential tersembunyi
    grep -r "password\|secret\|key" .env* \
        && warn "Potensi credential terekspos"
    
    # Cek konfigurasi database
    nc -z -v -w5 mongodb.sipale.com 27017 \
        || warn "Koneksi MongoDB bermasalah"
}

# Dokumentasi
docs_review() {
    log "📄 Review Dokumentasi"
    
    # Cek kelengkapan README
    cd "${PROJECT_DIR}"
    
    # Pastikan semua dokumen memiliki judul dan deskripsi
    find . -name "*.md" | xargs grep -L "^#" \
        && warn "Beberapa dokumen tidak memiliki judul"
}

# Main Review Workflow
main() {
    log "🎯 Memulai Review Komprehensif SiPaLe"
    
    backend_review
    frontend_review
    security_audit
    performance_test
    architecture_review
    env_validation
    docs_review
    
    log "✅ Review Komprehensif Selesai"
}

# Jalankan
main