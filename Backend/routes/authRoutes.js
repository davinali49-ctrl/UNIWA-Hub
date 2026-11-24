const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Mahasiswa = require('../models/mahasiswa');

const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Pengaturan cookie
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
};

// Membuat JWT
function createToken(user) {
    return jwt.sign(
        { role: user.role },
        process.env.JWT_SECRET,
        {
            subject: user._id.toString(),
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );
}

// REGISTER MAHASISWA
router.post('/register', async (req, res) => {
    try {
        const { nim, email, password } = req.body;

        if (
            typeof nim !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !nim.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'NIM, email, dan password wajib diisi'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password minimal 6 karakter'
            });
        }

        // Cari NIM mahasiswa
        const mahasiswa = await Mahasiswa.findOne({
            nim: nim.trim()
        });

        if (!mahasiswa) {
            return res.status(404).json({
                message: 'NIM belum terdaftar'
            });
        }

        // Periksa akun mahasiswa
        const existingAccount = await User.findOne({
            mahasiswaId: mahasiswa._id
        });

        if (existingAccount) {
            return res.status(409).json({
                message: 'Mahasiswa sudah memiliki akun'
            });
        }

        // Periksa email
        const normalizedEmail = email.trim().toLowerCase();

        const existingEmail = await User.findOne({
            email: normalizedEmail
        });

        if (existingEmail) {
            return res.status(409).json({
                message: 'Email sudah digunakan'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Buat akun
        const newUser = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            role: 'mahasiswa',
            mahasiswaId: mahasiswa._id
        });

        res.status(201).json({
            message: 'Registrasi berhasil',
            data: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Register error:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Data sudah digunakan'
            });
        }

        res.status(500).json({
            message: 'Terjadi kesalahan pada server'
        });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email dan password wajib diisi'
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: 'Email atau password salah'
            });
        }

        // Cocokkan password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Email atau password salah'
            });
        }

        // Buat token
        const token = createToken(user);

        // Simpan token dalam cookie
        res.cookie('token', token, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Login berhasil',
            data: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            message: 'Terjadi kesalahan pada server'
        });
    }
});

// LOGOUT
router.post('/logout', (req, res) => {
    res.clearCookie('token', cookieOptions);

    res.json({
        message: 'Logout berhasil'
    });
});

// MEMERIKSA STATUS LOGIN
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('mahasiswaId', 'nim nama prodi');

        if (!user) {
            return res.status(404).json({
                message: 'Pengguna tidak ditemukan'
            });
        }

        res.json({ user });

    } catch (error) {
        console.error('Get user error:', error);

        res.status(500).json({
            message: 'Terjadi kesalahan pada server'
        });
    }
});

module.exports = router;