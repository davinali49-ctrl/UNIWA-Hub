import { HashRouter, NavLink, Routes, Route } from 'react-router-dom';

import Beranda from './Beranda.jsx';
import Berita from './Berita.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import AdminDashboard from './pages/adminDashboard.jsx';
import MahasiswaDashboard from './pages/mahasiswaDashboard.jsx';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
      <header>
        <h1>Uniwa Hub</h1>
      </header>

      <nav>
        <NavLink to="/" end>
          Beranda
        </NavLink>

        <NavLink to="/berita">
          Berita
        </NavLink>

        <NavLink to="/login">
          Login
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Beranda />} />

        <Route path="/berita" element={<Berita />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
    path="/admin"
    element={
        <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>

        <Route
    path="/mahasiswa"
    element={
        <ProtectedRoute allowedRoles={['mahasiswa']}>
            <MahasiswaDashboard />
        </ProtectedRoute>
    }
/>

        <Route
          path="*"
          element={
            <main>
              <h2>Halaman tidak ditemukan</h2>
              <p>Gunakan menu Beranda, Berita, atau Login.</p>
            </main>
          }
        />
      </Routes>

      <footer>
        <p>&copy; 2026 Uniwa Hub. Muhammad Davin Ali Fikri.</p>
      </footer>
      </AuthProvider>
    </HashRouter>
  );
}