import {HashRouter, NavLink, Routes, Route}  from 'react-router-dom';
import Beranda from './Beranda.jsx';
import Berita from './Berita.jsx';
import './App.css';

export default function App() {
  return (
    <HashRouter>
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
      </nav>

      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/berita" element={<Berita />} />
        <Route
          path="*"
          element={
            <main>
              <h2>Halaman tidak ditemukan</h2>
              <p>Gunakan menu Beranda atau Berita untuk melanjutkan.</p>
            </main>
          }
        />
      </Routes>

      <footer>
        <p>&copy; 2026 Uniwa Hub. Muhammad Davin Ali Fikri.</p>
      </footer>
    </HashRouter>
  );
} 

 