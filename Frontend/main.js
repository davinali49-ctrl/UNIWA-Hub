const inputCari = document.getElementById("q"); 
const listMahasiswa = document.getElementById("list-mahasiswa");
const detailMahasiswa = document.getElementById("detail-mahasiswa");


function tampilkanListMahasiswa(daftar) {
  listMahasiswa.innerHTML = "";

  if (daftar.length === 0) {
    listMahasiswa.innerHTML = `<li class="empty">Mahasiswa tidak ditemukan</li>`;
    return;
  }

  daftar.forEach(function (mhs) {
    const li = document.createElement("li");
    li.textContent = mhs.nama;
    li.setAttribute("data-nama", mhs.nama);
    listMahasiswa.appendChild(li);
  });
}


inputCari.addEventListener("input", function (e) {
  const keyword = e.target.value.toLowerCase().trim();

  if (keyword === "") {
    listMahasiswa.innerHTML = `<li class="empty">Ketik nama di kotak pencarian...</li>`;
    detailMahasiswa.innerHTML = `<p class="empty">Klik nama mahasiswa di sebelah kiri untuk melihat detail nilai.</p>`;
    return;
  }

  const hasilfilter = mahasiswa.filter(function (mhs) {
    return mhs.nama.toLowerCase().includes(keyword);
  });


  tampilkanListMahasiswa(hasilfilter);
});


listMahasiswa.addEventListener("click", function (e) {
  if (e.target.tagName === "LI" && !e.target.classList.contains("empty")) {
    const nama = e.target.getAttribute("data-nama");

    const mahasiswaTerpilih = mahasiswa.find(function (mhs) {
      return mhs.nama === nama;
    });

    if (mahasiswaTerpilih) {
      const status = mahasiswaTerpilih.nilai >= 70 ? "Lulus" : "Tidak Lulus";

      detailMahasiswa.innerHTML = `
        <p><strong>Nama:</strong> ${mahasiswaTerpilih.nama}</p>
        <p><strong>Nilai:</strong> ${mahasiswaTerpilih.nilai}</p>
        <p><strong>Status:</strong> ${status}</p>
      `;
    }
  }
});