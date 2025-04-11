require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});