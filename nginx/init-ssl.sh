#!/bin/bash

# יצירת תיקיית SSL
mkdir -p /etc/nginx/ssl
chmod 755 /etc/nginx/ssl

# הפקת תעודה והוספת בדיקת שגיאות
if ! certbot certonly --nginx \
  --non-interactive \
  --agree-tos \
  -m erlichsefi@gmail.com \
  -d www.openisraelisupermarkets.co.il; then
    echo "שגיאה: נכשל תהליך הפקת התעודה"
    certbot --logs-dir /var/log/letsencrypt
    exit 1
fi

# הגדרת הרשאות
chown -R www-data:www-data /etc/nginx/ssl
chmod 600 /etc/letsencrypt/live/www.openisraelisupermarkets.co.il/privkey.pem
chmod 644 /etc/letsencrypt/live/www.openisraelisupermarkets.co.il/fullchain.pem

# בדיקה אם התעודה כבר קיימת
if [ -f "/etc/nginx/nginx.conf" ] && grep -q "ssl_certificate" "/etc/nginx/nginx.conf"; then
    echo "תצורת SSL כבר מוגדרת. יוצא מהסקריפט..."
    exit 0
fi

# change config to ssl
cp /etc/nginx/sslnginx.conf /etc/nginx/nginx.conf

# הפעלת Nginx
nginx -s reload