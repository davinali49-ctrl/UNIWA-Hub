
const express = require('express');
const mongoose = require('mongoose');

const Mahasiswa = require('../models/mahasiswa');
const User = require('../models/user');

const {
    authenticateToken,
    authorize
} = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken, authorize('admin'));

router.get('/', async (req, res) => {
    try {
        const mahasiswa = await Mahasiswa.find()
            .sort({ createdAt: -1 });

        res.json({
            message: 'Data mahasiswa berhasil diambil',
            data: mahasiswa
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Gagal mengambil data mahasiswa'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'ID mahasiswa tidak valid'
            });
        }

        const mahasiswa = await Mahasiswa.findById(id);

        if (!mahasiswa) {
            return res.status(404).json({
                message: 'Mahasiswa tidak ditemukan'
            });
        }

        res.json({ data: mahasiswa });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Gagal mengambil data mahasiswa'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nim, nama, prodi } = req.body;

        if (
            typeof nim !== 'string' ||
            typeof nama !== 'string' ||
            typeof prodi !== 'string' ||
            !nim.trim() ||
            !nama.trim() ||
            !prodi.trim()
        ) {
            return res.status(400).json({
                message: 'NIM, nama, dan prodi wajib diisi'
            });
        }

        const newMahasiswa = await Mahasiswa.create({
            nim: nim.trim(),
            nama: nama.trim(),
            prodi: prodi.trim()
        });

        res.status(201).json({
            message: 'Mahasiswa berhasil ditambahkan',
            data: newMahasiswa
        });

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'NIM sudah terdaftar'
            });
        }

        res.status(500).json({
            message: 'Gagal menambahkan mahasiswa'
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nim, nama, prodi } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'ID mahasiswa tidak valid'
            });
        }

        if (
            typeof nim !== 'string' ||
            typeof nama !== 'string' ||
            typeof prodi !== 'string' ||
            !nim.trim() ||
            !nama.trim() ||
            !prodi.trim()
        ) {
            return res.status(400).json({
                message: 'NIM, nama, dan prodi wajib diisi'
            });
        }

        const updatedMahasiswa = await Mahasiswa.findByIdAndUpdate(
            id,
            {
                nim: nim.trim(),
                nama: nama.trim(),
                prodi: prodi.trim()
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!updatedMahasiswa) {
            return res.status(404).json({
                message: 'Mahasiswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data mahasiswa berhasil diperbarui',
            data: updatedMahasiswa
        });

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'NIM sudah digunakan mahasiswa lain'
            });
        }

        res.status(500).json({
            message: 'Gagal memperbarui data mahasiswa'
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'ID mahasiswa tidak valid'
            });
        }

        const mahasiswa = await Mahasiswa.findById(id);

        if (!mahasiswa) {
            return res.status(404).json({
                message: 'Mahasiswa tidak ditemukan'
            });
        }

        await User.deleteOne({
            mahasiswaId: mahasiswa._id
        });

        await mahasiswa.deleteOne();

        res.json({
            message: 'Data mahasiswa berhasil dihapus'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Gagal menghapus data mahasiswa'
        });
    }
});

module.exports = router;
