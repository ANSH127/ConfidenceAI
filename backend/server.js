require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const app = express();


app.use(express.json());

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true,
}))


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/user', userRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});