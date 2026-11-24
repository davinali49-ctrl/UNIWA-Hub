const mongoose = require('mongoose');

const MahasiswaSchema = new mongoose.Schema({
    nim: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nama: {
        type: String,
        required: true,
        trim: true
    },
    prodi: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    'Mahasiswa',
    MahasiswaSchema,
    'mahasiswas'
);