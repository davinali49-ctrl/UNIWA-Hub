
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './login.css';

export default function Login() {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            const currentUser = await checkAuth();

            if (!currentUser) {
                throw new Error('Gagal memeriksa sesi login');
            }

            if (currentUser.role === 'admin') {
                navigate('/admin', { replace: true });
            } else if (currentUser.role === 'mahasiswa') {
                navigate('/mahasiswa', { replace: true });
            } else {
                throw new Error('Role pengguna tidak dikenali');
            }

        } catch (error) {
            setError(error.message || 'Gagal menghubungi server');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-card">

                <div className="login-heading">
                    <h1>UNIWA Hub</h1>
                    <p>Selamat datang kembali!</p>
                    <span>Silakan login untuk melanjutkan.</span>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Masukkan email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Masukkan password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Memproses...' : 'Login'}
                    </button>

                </form>

                <p className="register-link">
                    Belum memiliki akun?
                    {' '}
                    <Link to="/register">Daftar sekarang</Link>
                </p>

            </section>
        </main>
    );
}
