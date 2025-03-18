const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Counter = require('./models/Counter');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// اتصال MongoDB مع معالجة الأخطاء
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://your_mongodb_uri', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// معالجة أخطاء اتصال MongoDB
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

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
        let counter = await Counter.findOne({ name: 'dislikes' });
        if (!counter) {
            counter = await Counter.create({ name: 'dislikes', count: 0 });
        }
        console.log('Current dislike count:', counter.count);
        res.json({ count: counter.count });
    } catch (error) {
        console.error('Error getting count:', error);
        res.status(500).json({ error: 'Server error while getting count' });
    }
});

app.post('/dislike/increment', async (req, res) => {
    try {
        let counter = await Counter.findOneAndUpdate(
            { name: 'dislikes' },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        console.log('Updated dislike count:', counter.count);
        res.json({ count: counter.count });
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
