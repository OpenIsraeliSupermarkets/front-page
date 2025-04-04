# שלב בסיסי - משותף לפיתוח וייצור
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# שלב פיתוח
FROM node:20 AS development
WORKDIR /workspace

# התקנת כלי פיתוח נוספים
RUN apt-get update && apt-get install -y \
    gnupg2 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 648ACFD622F3D138 0E98404D386FA1D9 DCC9EFBF77E11517 \
    && apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# הגדרת הרשאות לתיקיית העבודה
RUN chown node:node /workspace

ENV NODE_ENV=development
ENV PATH=/workspace/node_modules/.bin:$PATH
ENV WATCHPACK_POLLING=true

EXPOSE 5173
USER node
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# שלב בנייה
FROM node:20 AS builder
WORKDIR /app

# התקנת תלויות מערכת נדרשות
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN chown -R node:node /app && \
    npm ci
COPY . .
RUN chown -R node:node /app
RUN mkdir -p /app/dist/assets && chown -R node:node /app/dist
USER node
RUN npm run build

# שלב ייצור
FROM base AS production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/server.js ./dist/
COPY package*.json ./

# התקנת תלויות נדרשות לייצור
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && chown -R node:node /app \
    && npm ci --only=production

ENV HOST=0.0.0.0
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]