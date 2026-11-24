require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

const mahasiswaRoutes = require('./routes/mahasiswaRoutes');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'UNIWA Hub API is running'
    });
});

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Terhubung ke database MongoDB');

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Gagal menjalankan server:', error.message);
        process.exit(1);
    }
}

startServer();