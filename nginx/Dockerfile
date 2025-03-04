FROM nginx:latest

# העתקת קבצי התצורה והסקריפטים
COPY nginx.conf /etc/nginx/nginx.conf
COPY init-ssl.sh /docker-entrypoint.d/

# התקנת תלויות מערכת
RUN apt-get update
RUN apt-get install -y python3 python3-venv libaugeas0

# הגדרת Certbot
RUN python3 -m venv /opt/certbot/
RUN /opt/certbot/bin/pip install --upgrade pip
RUN /opt/certbot/bin/pip install certbot certbot-nginx
RUN ln -sf /opt/certbot/bin/certbot /usr/bin/certbot

# הגדרת הרשאות הרצה לסקריפט
RUN chmod +x /docker-entrypoint.d/init-ssl.sh

# חשיפת פורטים
EXPOSE 80
EXPOSE 443