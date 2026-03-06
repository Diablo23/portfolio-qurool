/* ================================================================
   qurool portfolio — static file server
   ================================================================
   Usage:  node backend/server.js
   Open :  http://localhost:3000
   ================================================================ */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2':'font/woff2',
    '.ttf':  'font/ttf',
    '.otf':  'font/otf',
};

http.createServer((req, res) => {
    let url = req.url.split('?')[0];

    // route / → frontend/index.html
    let filePath;
    if (url === '/' || url === '/index.html') {
        filePath = path.join(ROOT, 'frontend', 'index.html');
    } else if (url.startsWith('/assets/')) {
        filePath = path.join(ROOT, url);
    } else {
        filePath = path.join(ROOT, 'frontend', url);
    }

    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(err.code === 'ENOENT' ? 404 : 500);
            res.end(err.code === 'ENOENT' ? '404' : '500');
            return;
        }
        res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'public, max-age=3600' });
        res.end(data);
    });
}).listen(PORT, () =>
    console.log(`\n  qurool's portfolio → http://localhost:${PORT}\n`)
);
