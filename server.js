const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5500;

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'content')));

// Store dislike count in memory (can be replaced with a database)
let dislikeCount = 0;

// Routes
app.get('/dislike/count', (req, res) => {
    res.json({ count: dislikeCount });
});

app.post('/dislike/increment', (req, res) => {
    try {
        dislikeCount++;
        console.log('Dislike count incremented:', dislikeCount);
        res.json({ success: true, count: dislikeCount });
    } catch (error) {
        console.error('Error incrementing count:', error);
        res.status(500).json({ error: 'Failed to increment count' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'content', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error occurred' });
});

app.listen(port, '127.0.0.1', () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
}); 