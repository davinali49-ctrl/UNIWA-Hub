
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './mahasiswaDashboard.css';

export default function MahasiswaDashboard() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    async function handleLogout() {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (err) {
            setError(err.message || 'Logout gagal');
        }
    }

    if (loading) {
        return <p>Memuat data mahasiswa...</p>;
    }

    const mahasiswa = user?.mahasiswaId;

    return (
        <main className="mahasiswa-page">

            <section className="mahasiswa-welcome">
                <span>Dashboard Mahasiswa</span>

                <h1>
                    Selamat Datang, {mahasiswa?.nama || 'Mahasiswa'}!
                </h1>

                <p>Selamat datang di portal UNIWA Hub.</p>

                <button
                    className="mahasiswa-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </section>

            {error && (
                <p className="dashboard-error">{error}</p>
            )}

            <section className="mahasiswa-profile">

                <div className="profile-heading">
                    <h2>Profil Mahasiswa</h2>
                    <span>Informasi akun dan identitas kamu.</span>
                </div>

                {mahasiswa ? (
                    <div className="profile-info">

                        <div className="profile-item">
                            <span>Nama Lengkap</span>
                            <h3>{mahasiswa.nama}</h3>
                        </div>

                        <div className="profile-item">
                            <span>NIM</span>
                            <h3>{mahasiswa.nim}</h3>
                        </div>

                        <div className="profile-item">
                            <span>Program Studi</span>
                            <h3>{mahasiswa.prodi}</h3>
                        </div>

                        <div className="profile-item">
                            <span>Email</span>
                            <h3>{user.email}</h3>
                        </div>

                    </div>
                ) : (
                    <p>Data mahasiswa tidak ditemukan.</p>
                )}

            </section>

        </main>
    );
}
