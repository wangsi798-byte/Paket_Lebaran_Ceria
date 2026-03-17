# Domain Configuration Guide for SiPaLe

## Domain Details
- **Primary Domain:** sipale.com
- **WWW Domain:** www.sipale.com
- **Backend API:** api.sipale.com

## DNS Configuration
- A Record: 
  - `sipale.com` → Server IP
  - `www.sipale.com` → Server IP
  - `api.sipale.com` → Server IP

## SSL/TLS
- SSL Provider: Let's Encrypt
- Domains Covered:
  - sipale.com
  - www.sipale.com
  - api.sipale.com

## Cloudflare Settings
- DNS Management
- SSL/TLS Encryption Mode: Full
- Always Use HTTPS: Enabled
- HTTP Strict Transport Security (HSTS): Enabled

## Email Configuration
- MX Record: Configured for basic email routing

## Recommended DNS Providers
- Cloudflare
- Digital Ocean
- Google Cloud DNS

## Security Recommendations
- Enable DNSSEC
- Use CAA records
- Implement SPF/DKIM for email

## Renewal Process
- SSL Certificates auto-renew via Certbot
- Recommended: Set up monthly cron job for renewal check