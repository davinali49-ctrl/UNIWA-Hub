require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Mahasiswa = require('../models/mahasiswa');

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Terhubung ke MongoDB');

        // 1. Membuat atau memperbarui akun Admin
        const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();

        const adminPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            12
        );

        await User.findOneAndUpdate(
            { email: adminEmail },
            {
                $set: {
                    password: adminPassword,
                    role: 'admin'
                },
                $unset: {
                    mahasiswaId: 1
                }
            },
        {
        upsert: true,
        returnDocument: 'after',
        runValidators: true
        }
        );

        console.log('Akun Admin siap');

        // Hapus akun demo Admin lama
        if (adminEmail !== 'admin@uniwa.local') {
            await User.deleteOne({
                email: 'admin@uniwa.local',
                role: 'admin'
            });
        }

        // 2. Membuat atau mencari data mahasiswa
        let mahasiswa = await Mahasiswa.findOne({
            nim: process.env.DEMO_MAHASISWA_NIM.trim()
        });

        if (!mahasiswa) {
            mahasiswa = await Mahasiswa.create({
                nim: process.env.DEMO_MAHASISWA_NIM.trim(),
                nama: process.env.DEMO_MAHASISWA_NAMA,
                prodi: process.env.DEMO_MAHASISWA_PRODI
            });
        }

        console.log('Data mahasiswa siap');

        // 3. Menyiapkan akun mahasiswa
        const mhsEmail = process.env.DEMO_MAHASISWA_EMAIL
            .trim()
            .toLowerCase();

        const mhsPassword = await bcrypt.hash(
            process.env.DEMO_MAHASISWA_PASSWORD,
            12
        );

        let mhsAccount = await User.findOne({
            mahasiswaId: mahasiswa._id
        });

        const emailOwner = await User.findOne({
            email: mhsEmail
        });

        if (
            emailOwner &&
            (!mhsAccount || !emailOwner._id.equals(mhsAccount._id))
        ) {
            throw new Error('Email mahasiswa sudah digunakan akun lain');
        }

        if (mhsAccount) {
            mhsAccount.email = mhsEmail;
            mhsAccount.password = mhsPassword;
            mhsAccount.role = 'mahasiswa';

            await mhsAccount.save();
        } else {
            await User.create({
                email: mhsEmail,
                password: mhsPassword,
                role: 'mahasiswa',
                mahasiswaId: mahasiswa._id
            });
        }

        console.log('Akun mahasiswa siap');
        console.log('Seeding selesai!');

    } catch (error) {
        console.error('Seeding gagal:', error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
}

const requiredEnv = [
    'MONGO_URI',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'DEMO_MAHASISWA_NIM',
    'DEMO_MAHASISWA_NAMA',
    'DEMO_MAHASISWA_PRODI',
    'DEMO_MAHASISWA_EMAIL',
    'DEMO_MAHASISWA_PASSWORD'
];

if (requiredEnv.some((key) => !process.env[key]?.trim())) {
    console.error('Konfigurasi .env belum lengkap');
    process.exit(1);
}

seedDatabase();