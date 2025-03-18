const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Counter = require('./models/Counter');

const app = express();
const port = process.env.PORT || 3000;

// اتصال MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://your_mongodb_uri', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('content'));

// Routes
app.get('/dislike/count', async (req, res) => {
    try {
        let counter = await Counter.findOne({ name: 'dislikes' });
        if (!counter) {
            counter = await Counter.create({ name: 'dislikes', count: 0 });
        }
        res.json({ count: counter.count });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في الخادم' });
    }
});

app.post('/dislike/increment', async (req, res) => {
    try {
        let counter = await Counter.findOne({ name: 'dislikes' });
        if (!counter) {
            counter = await Counter.create({ name: 'dislikes', count: 1 });
        } else {
            counter.count += 1;
            await counter.save();
        }
        res.json({ count: counter.count });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في الخادم' });
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

// Export the Express API
module.exports = app; 
