#!/bin/bash

# Release Preparation Script for SiPaLe

# Warna
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Variabel
VERSION="1.0.0"
RELEASE_DATE=$(date +'%Y-%m-%d')
REPO_URL="https://github.com/muji-dashboard/sipale"

# Fungsi Log
log() {
    echo -e "${GREEN}[RELEASE]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Validasi Prasyarat
validate_prerequisites() {
    log "Memeriksa prasyarat rilis..."
    
    # Cek Git
    if ! command -v git &> /dev/null; then
        error "Git tidak terinstall"
    fi

    # Cek GitHub CLI
    if ! command -v gh &> /dev/null; then
        warn "GitHub CLI tidak terinstall. Beberapa fungsi terbatas."
    fi

    # Cek status Git
    if [[ -n $(git status -s) ]]; then
        error "Ada perubahan yang belum di-commit"
    fi
}

# Persiapan Dokumentasi
prepare_docs() {
    log "Menyiapkan dokumentasi rilis..."
    
    # Update changelog
    sed -i "1i ## [${VERSION}] - ${RELEASE_DATE}" CHANGELOG.md
    
    # Generate dokumentasi API
    npm run generate:docs
}

# Build Artifacts
build_artifacts() {
    log "Membuat artifacts rilis..."
    
    # Build frontend
    cd frontend
    npm run build
    
    # Build backend
    cd ../backend
    npm run build
    
    # Buat arsip
    tar -czvf "../sipale-${VERSION}.tar.gz" .
}

# Git Tagging
create_git_tag() {
    log "Membuat Git tag..."
    
    git tag -a "v${VERSION}" -m "Rilis Versi ${VERSION}"
    git push origin "v${VERSION}"
}

# GitHub Release
create_github_release() {
    log "Membuat GitHub Release..."
    
    gh release create "v${VERSION}" \
        --title "SiPaLe v${VERSION}" \
        --notes-file RELEASE_NOTES.md \
        "../sipale-${VERSION}.tar.gz"
}

# Notifikasi
send_notifications() {
    log "Mengirim notifikasi rilis..."
    
    # Kirim email ke daftar distribusi
    npm run send:release-email
    
    # Posting di media sosial
    npm run post:release-announcement
}

# Main Release Workflow
main() {
    validate_prerequisites
    prepare_docs
    build_artifacts
    create_git_tag
    create_github_release
    send_notifications
    
    log "🎉 Rilis ${VERSION} Berhasil!"
}

# Jalankan
main