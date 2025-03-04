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

# הפעלת Nginx
nginx -g 'daemon off;' 