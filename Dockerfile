# תמונת בסיס - Node.js
FROM node:20-alpine

# הגדרת תיקיית העבודה
WORKDIR /app

# העתקת קבצי package.json ו-package-lock.json
COPY package*.json ./

# התקנת התלויות
RUN npm i

# העתקת שאר קבצי הפרויקט
COPY . .

# בניית האפליקציה
RUN npm run build

# חשיפת פורט 3000
EXPOSE 3000

# הגדרת משתני סביבה להאזנה על כל הרשתות
ENV HOST=0.0.0.0
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# שינוי הפקודה להרצת השרת
CMD ["node", "--experimental-json-modules", "src/server.js"]