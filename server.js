const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// مسار ملف تخزين العدد
const countFilePath = path.join(__dirname, 'dislike-count.txt');

// قراءة العدد من الملف أو إنشاء ملف جديد إذا لم يكن موجوداً
let dislikeCount = 0;
try {
    if (fs.existsSync(countFilePath)) {
        dislikeCount = parseInt(fs.readFileSync(countFilePath, 'utf8')) || 0;
    } else {
        fs.writeFileSync(countFilePath, '0');
    }
} catch (error) {
    console.error('Error reading count file:', error);
}

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('content'));

// Routes
app.get('/dislike/count', (req, res) => {
    try {
        res.json({ count: dislikeCount });
    } catch (error) {
        console.error('Error getting count:', error);
        res.status(500).json({ error: 'Server error while getting count' });
    }
});

app.post('/dislike/increment', (req, res) => {
    try {
        dislikeCount++;
        // حفظ العدد في الملف
        fs.writeFileSync(countFilePath, dislikeCount.toString());
        console.log('Updated dislike count:', dislikeCount);
        res.json({ count: dislikeCount });
    } catch (error) {
        console.error('Error incrementing count:', error);
        res.status(500).json({ error: 'Server error while incrementing count' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'content', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Server error occurred',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app; 
