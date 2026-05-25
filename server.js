// server.js - แก้ไขทั้งหมด พร้อมฟังก์ชัน Clear Pod

const express = require('express');
const path = require('path');
const axios = require('axios');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ฟังก์ชัน generateReqCode
function generateReqCode() {
    return `REQ_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}



// ========== PAGE ROUTES ==========
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/dashboard-v2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard-v2.html'));
});

// ========== LOGIN API ==========
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const hasCh = username && username.toLowerCase().includes('ch');
    const has27 = password && password.includes('27');
    
    if (hasCh && has27) {
        console.log(`[Login] Success: ${username}`);
        res.json({ success: true, message: 'ล็อกอินสำเร็จ' });
    } else {
        console.log(`[Login] Failed: ${username}`);
        res.json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ต้องมี ch และ 27)' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║     POD INVENTORY SYSTEM v2.0 - SERVER STARTED          ║
╠══════════════════════════════════════════════════════════╣
║  🚀 Server running at: http://localhost:${PORT}          ║
║  📦 32 Slots: http://localhost:${PORT}/dashboard.html    ║
║  📊 304 Slots: http://localhost:${PORT}/dashboard-v2.html ║
║  🔄 Proxy API: http://localhost:${PORT}/api/...          ║
║  🤖 AGV Proxy: http://localhost:${PORT}/api/agv/scheduling ║
║  🗑️ Clear Pod: http://localhost:${PORT}/api/clearPod     ║
╚══════════════════════════════════════════════════════════╝
    `);
});