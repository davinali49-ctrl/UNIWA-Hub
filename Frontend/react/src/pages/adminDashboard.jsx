
import { useState, useEffect, useCallback } from 'react';
import './adminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/mahasiswa';

const formKosong = {
    nim: '',
    nama: '',
    prodi: ''
};

export default function AdminDashboard() {
    const [mahasiswa, setMahasiswa] = useState([]);
    const [form, setForm] = useState(formKosong);
    const [editId, setEditId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { logout } = useAuth();

    const loadMahasiswa = useCallback(async () => {
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setMahasiswa(result.data);

        } catch (error) {
            setError(error.message || 'Gagal mengambil data mahasiswa');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMahasiswa();
    }, [loadMahasiswa]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const url = editId
                ? `${API_URL}/${editId}`
                : API_URL;

            const response = await fetch(url, {
                method: editId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setSuccess(result.message);
            setForm(formKosong);
            setEditId(null);

            await loadMahasiswa();

        } catch (error) {
            setError(error.message || 'Gagal menyimpan data');
        } finally {
            setSaving(false);
        }
    }

    async function handleLogout() {
    try {
        await logout();
        navigate('/login', { replace: true });
    } catch (error) {
        setError(error.message || 'Logout gagal');
    }
}

    function handleEdit(item) {
        setForm({
            nim: item.nim,
            nama: item.nama,
            prodi: item.prodi
        });

        setEditId(item._id);
        setError('');
        setSuccess('');
    }

    async function handleDelete(id) {
        const yakin = window.confirm(
            'Yakin ingin menghapus mahasiswa ini? Akun login yang terhubung juga akan dihapus.'
        );

        if (!yakin) return;

        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setSuccess(result.message);

            if (editId === id) {
                handleCancel();
            }

            await loadMahasiswa();

        } catch (error) {
            setError(error.message || 'Gagal menghapus mahasiswa');
        }
    }

    function handleCancel() {
        setForm(formKosong);
        setEditId(null);
        setError('');
        setSuccess('');
    }

    return (
        <main className="admin-page">

            <div className="admin-heading">
                <div>
                    <h1>Dashboard Admin</h1>
                    <p>Manajemen Data Mahasiswa UNIWA Hub</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <section className="admin-summary">
                <div className="summary-card">
                    <span>Total Mahasiswa</span>
                    <h2>{mahasiswa.length}</h2>
                </div>
            </section>

            <section className="admin-content">

                <div className="admin-form-card">
                    <h2>
                        {editId
                            ? 'Edit Mahasiswa'
                            : 'Tambah Mahasiswa'}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="nim">NIM</label>
                            <input
                                type="text"
                                id="nim"
                                name="nim"
                                value={form.nim}
                                onChange={handleChange}
                                placeholder="Masukkan NIM"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nama">Nama</label>
                            <input
                                type="text"
                                id="nama"
                                name="nama"
                                value={form.nama}
                                onChange={handleChange}
                                placeholder="Masukkan nama"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="prodi">Program Studi</label>
                            <input
                                type="text"
                                id="prodi"
                                name="prodi"
                                value={form.prodi}
                                onChange={handleChange}
                                placeholder="Masukkan program studi"
                                required
                            />
                        </div>

                        <button type="submit" disabled={saving}>
                            {saving
                                ? 'Memproses...'
                                : editId
                                    ? 'Simpan Perubahan'
                                    : 'Tambah Mahasiswa'}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancel}
                            >
                                Batal
                            </button>
                        )}

                    </form>
                </div>

                <div className="admin-table-card">
                    <h2>Data Mahasiswa</h2>

                    {error && (
                        <p className="admin-error">{error}</p>
                    )}

                    {success && (
                        <p className="admin-success">{success}</p>
                    )}

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>NIM</th>
                                    <th>Nama</th>
                                    <th>Prodi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5">
                                            Memuat data mahasiswa...
                                        </td>
                                    </tr>
                                ) : mahasiswa.length > 0 ? (
                                    mahasiswa.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>{item.nim}</td>
                                            <td>{item.nama}</td>
                                            <td>{item.prodi}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(item._id)}
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">
                                            Belum ada data mahasiswa
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </section>
        </main>
    );
}
