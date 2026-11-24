
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';

export default function Register() {
    const navigate = useNavigate();

    const [nim, setNim] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister(event) {
        event.preventDefault();

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        nim,
                        email,
                        password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setSuccess('Registrasi berhasil! Silakan login.');

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            setError(error.message || 'Registrasi gagal');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="register-page">
            <section className="register-card">

                <div className="register-heading">
                    <h1>UNIWA Hub</h1>
                    <p>Buat Akun Mahasiswa</p>
                    <span>Silakan lengkapi data untuk mendaftar.</span>
                </div>

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label htmlFor="nim">NIM</label>
                        <input
                            type="text"
                            id="nim"
                            value={nim}
                            onChange={(event) => setNim(event.target.value)}
                            placeholder="Masukkan NIM"
                            required
                        />
                    </div>

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
                            placeholder="Buat password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="register-error">{error}</p>
                    )}

                    {success && (
                        <p className="register-success">{success}</p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Memproses...' : 'Daftar'}
                    </button>

                </form>

                <p className="login-link">
                    Sudah memiliki akun?
                    {' '}
                    <Link to="/login">Login</Link>
                </p>

            </section>
        </main>
    );
}
