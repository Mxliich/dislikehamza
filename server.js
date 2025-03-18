const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Redis = require('ioredis');

const app = express();
const port = process.env.PORT || 3000;

// إعداد Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('content'));

// Routes
app.get('/dislike/count', async (req, res) => {
    try {
        const count = await redis.get('dislikeCount') || '0';
        res.json({ count: parseInt(count) });
    } catch (error) {
        console.error('Error getting count:', error);
        res.status(500).json({ error: 'Server error while getting count' });
    }
});

app.post('/dislike/increment', async (req, res) => {
    try {
        const count = await redis.incr('dislikeCount');
        console.log('Updated dislike count:', count);
        res.json({ count: parseInt(count) });
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
