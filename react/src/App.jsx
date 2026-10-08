import { useState } from 'react';
import './App.css';

// Data Mahasiswa
const DATA_MAHASISWA = [
  { nama: "Muhammad Anggoro Wijaya", nilai: 80 },
  { nama: "Andhika Wahyu Rizky", nilai: 70 },
  { nama: "Muhammad Kholil Arsyad Ramadhan", nilai: 90 },
  { nama: "Kaka Dino Riady", nilai: 60 },
  { nama: "Muhammad Faqih Ali Ridho", nilai: 75 },
  { nama: "Daffa Al Fariz", nilai: 50 },
  { nama: "Tazkiya Latifatun Nadhiroh", nilai: 100 },
];

// Data Pengumuman
const DATA_PENGUMUMAN = [
  {
    id: 1,
    judul: "Penerimaan Anggota Baru UKM SUFI",
    kategori: "Kemahasiswaan",
    tanggal: "17 September 2026",
    isoTanggal: "2026-09-17",
    isi: "[Open Recruitment anggota UKM SUFI 2026] Hallo seluruh mahasiswa UNIWA Kalian yang berjiwa muda, kalian yang ingin berkontribusi lebih untuk UKM SUFI Kami memberikan kesempatan kepada teman-teman untuk bergabung bersama kami dalam UKM SUFI.",
    alur: [
      "1. Follow akun instagram @pers_uniwa",
      "2. Mengisi formulir pendaftaran dari Departemen PSDM BEM UNIWA"
    ]
  },
  {
    id: 2,
    judul: "Jum'at Sehat",
    kategori: "Kegiatan",
    tanggal: "11 September 2026",
    isoTanggal: "2026-09-11",
    isi: "Kegiatan Jum'at Sehat akan dilaksanakan pada Jumat pagi sebagai kegiatan bersama untuk menjaga kebugaran dan meningkatkan semangat mahasiswa dalam menjalani aktivitas."
  },
  {
    id: 3,
    judul: "Pelaksanaan Mujahadah Syahriah Memperingati Maulid Nabi Muhammad SAW 1448 H",
    kategori: "Kegiatan",
    tanggal: "25 September 2026",
    isoTanggal: "2026-09-25",
    isi: "Kegiatan Mujahadah Syahriah dalam rangka memperingati Maulid Nabi Muhammad SAW 1448 H. Disponsori oleh Fakultas Teknik Universitas Wahidiyah."
  }
];

export default function App() {
  const [keyword, setKeyword] = useState('');
  const [mhsTerpilih, setMhsTerpilih] = useState(null);

  // Filter daftar mahasiswa berdasarkan keyword
  const hasilFilter = DATA_MAHASISWA.filter((mhs) =>
    mhs.nama.toLowerCase().includes(keyword.toLowerCase().trim())
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    if (val.trim() === '') {
      setMhsTerpilih(null);
    }
  };

  return (
    <>
      <header>
        <h1>Uniwa Hub</h1>
      </header>

      <nav>
        <a href="#">Beranda</a>
        <a href="#">Pengumuman</a>
        <a href="#">Tentang</a>
      </nav>

      {/* Form Pencarian Mahasiswa */}
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q">Pencarian Mahasiswa:</label>
        <input
          id="q"
          name="q"
          type="search"
          placeholder="Ketik nama mahasiswa..."
          autoComplete="off"
          value={keyword}
          onChange={handleSearchChange}
        />
      </form>

      {/* Area Hasil Pencarian & Detail Mahasiswa */}
      <div className="mhs-container">
        <div className="mhs-box">
          <h3>Hasil Pencarian</h3>
          <ul id="list-mahasiswa">
            {keyword.trim() === '' ? (
              <li className="empty">Ketik nama di kotak pencarian...</li>
            ) : hasilFilter.length === 0 ? (
              <li className="empty">Mahasiswa tidak ditemukan</li>
            ) : (
              hasilFilter.map((mhs, index) => (
                <li key={index} onClick={() => setMhsTerpilih(mhs)}>
                  {mhs.nama}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="mhs-box">
          <h3>Detail Mahasiswa</h3>
          <div id="detail-mahasiswa">
            {!mhsTerpilih ? (
              <p className="empty">
                Klik nama mahasiswa di sebelah kiri untuk melihat detail nilai.
              </p>
            ) : (
              <div>
                <p><strong>Nama:</strong> {mhsTerpilih.nama}</p>
                <p><strong>Nilai:</strong> {mhsTerpilih.nilai}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  {mhsTerpilih.nilai >= 70 ? 'Lulus' : 'Tidak Lulus'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <main>
        <section id="daftar-pengumuman">
          {DATA_PENGUMUMAN.map((item) => (
            <article key={item.id} data-category={item.kategori}>
              <h2>{item.judul}</h2>
              <p>{item.isi}</p>
              {item.alur && (
                <>
                  <p>Alur Pendaftaran:</p>
                  {item.alur.map((langkah, idx) => (
                    <p key={idx}>{langkah}</p>
                  ))}
                </>
              )}
              <p>
                <time dateTime={item.isoTanggal}>{item.tanggal}</time> · {item.kategori.toLowerCase()}
              </p>
            </article>
          ))}
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Uniwa Hub. Muhammad Davin Ali Fikri.</p>
      </footer>
    </>
  );
} 