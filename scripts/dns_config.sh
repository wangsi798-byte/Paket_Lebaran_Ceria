#!/bin/bash

# DNS Configuration for SiPaLe

# Domain Configuration
DOMAIN="sipale.com"
WWW_DOMAIN="www.${DOMAIN}"
BACKEND_SUBDOMAIN="api.${DOMAIN}"

# Cloudflare DNS Configuration (menggunakan Cloudflare API)
CLOUDFLARE_API_TOKEN="your_cloudflare_api_token"
CLOUDFLARE_ZONE_ID="your_cloudflare_zone_id"

# IP Address (ganti dengan IP server Anda)
SERVER_IP="123.456.789.0"

# Fungsi untuk menambahkan DNS record
add_dns_record() {
    local name="$1"
    local content="$2"
    local type="$3"

    curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records" \
         -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
         -H "Content-Type: application/json" \
         --data '{
             "type":"'"${type}"'",
             "name":"'"${name}"'",
             "content":"'"${content}"'",
             "ttl":1,
             "proxied":true
         }'
}

# Konfigurasi DNS
configure_dns() {
    echo "🌐 Mengonfigurasi DNS untuk ${DOMAIN}"

    # A record untuk domain utama
    add_dns_record "${DOMAIN}" "${SERVER_IP}" "A"

    # A record untuk www
    add_dns_record "${WWW_DOMAIN}" "${SERVER_IP}" "A"

    # A record untuk backend
    add_dns_record "${BACKEND_SUBDOMAIN}" "${SERVER_IP}" "A"

    # MX Record (opsional)
    add_dns_record "${DOMAIN}" "mail.${DOMAIN}" "MX"

    echo "✅ Konfigurasi DNS Selesai"
}

# SSL/TLS Configuration
configure_ssl() {
    echo "🔒 Mengonfigurasi SSL dengan Certbot"
    
    # Install Certbot
    snap install --classic certbot

    # Dapatkan sertifikat SSL
    certbot certonly \
        --standalone \
        -d "${DOMAIN}" \
        -d "${WWW_DOMAIN}" \
        -d "${BACKEND_SUBDOMAIN}"

    echo "🔐 SSL Certificates berhasil diterbitkan"
}

# Main
main() {
    configure_dns
    configure_ssl
}

# Jalankan
main