import React, {useState, useEffect} from "react";

export default function Berita() {
    const [berita, setBerita] = useState([]);
    const [status, setStatus] = useState('memuat');
    const [error, setError] = useState("");
    useEffect(() => {

        const fetchData = async () => {
            try {
                setStatus('memuat');
                setError("");

                const response = await fetch("https://jsonplaceholder.typicode.com/post");

                if (!response.ok) {
                    throw new Error('Gagal memuat berita.');
                }

                const data = await response.json();

                setBerita(data.slice(0, 10));
                setStatus('Berhasil');
            } catch (err) {
                setError(err.message);
                setStatus('gagal');
            }
        };

        fetchData();
    }, []);

    return (
        <main>
            <h1>Berita</h1>
            <p>Data latian dari JSONPlaceholder</p>

            {status === 'memuat' && <p>Memuat berita...</p>}
            {status === 'gagal' && <p className="error">{error}</p>}
            {status === 'Berhasil' && berita.length === 0 && <p>Tidak ada berita.</p>}

            <div className="berita-container">
                {berita.map((item) => (
                    <article key={item.id}>
                        <h2>{item.title}</h2>
                        <p>{item.body}</p>
                        <p>
                            <time dateTime={item.isoTanggal}>{item.tanggal}</time>
                        </p>
                    </article>
                ))}
            </div>
        </main>
    );
}

