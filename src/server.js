import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type']
}));

// הגדרת ה-proxy לשרת האחורי
app.use('/api', createProxyMiddleware({
  target: 'http://erlichsefi.ddns.net:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/', // מסיר את ה-/api מתחילת הנתיב
  },
  onProxyRes: function(proxyRes, req, res) {
    // הוספת CORS headers
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'authorization, x-client-info, apikey, content-type';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
  }
}));

// שירות קבצים סטטיים מתיקיית dist
app.use(express.static(path.join(__dirname, '../dist')));

// הפניית כל הבקשות האחרות לאפליקציית React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
}); 