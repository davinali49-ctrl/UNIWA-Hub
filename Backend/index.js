require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/user');

const app = express();

app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB Lokal
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Terhubung ke MongoDB Lokal!'))
  .catch((err) => console.error('Gagal konek ke MongoDB Lokal:', err));

// API Endpoint (POST Data)
app.post('/api/users', async (req, res) => {
  try {
    const { nama, email } = req.body;
    const newUser = new User({ nama, email });
    await newUser.save();

    res.status(201).json({
      message: 'Data berhasil disimpan di MongoDB Lokal!',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menyimpan data',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running di http://localhost:${PORT}`));