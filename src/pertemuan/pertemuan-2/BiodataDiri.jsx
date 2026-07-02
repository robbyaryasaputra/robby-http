// Child Component 1: Menampilkan Nama dan Judul
function HeaderProfile({ nama }) {
  return (
    <div className="profile-header">
      <h2>{nama}</h2>
      <small>Mahasiswa Program Studi Sistem Informasi</small>
    </div>
  );
}

// Child Component 2: Pembatas antar seksi agar rapi
function SectionDivider() {
  return <hr className="divider" />;
}

// Child Component 3: Deskripsi singkat tentang diri
function AboutMe() {
  return (
    <div className="section">
      <h3>Tentang Saya</h3>
      <p>
        Halo! Saya adalah mahasiswa yang sedang belajar di bidang IT. Saat ini
        saya sedang menempuh pendidikan untuk memperdalam ilmu mengenai
        pengembangan perangkat lunak, analisis sistem, dan manajemen data.
      </p>
    </div>
  );
}

// Child Component 4: Menampilkan data diri lengkap
function PersonalInfo({ nim, jurusan, kelas, kampus }) {
  return (
    <div className="section">
      <h3>Informasi Pribadi</h3>
      <ul>
        <li>
          <strong>NIM:</strong> {nim}
        </li>
        <li>
          <strong>Jurusan:</strong> {jurusan}
        </li>
        <li>
          <strong>Kelas:</strong> {kelas}
        </li>
        <li>
          <strong>Kampus:</strong> {kampus}
        </li>
      </ul>
    </div>
  );
}

// Child Component 5: Daftar keahlian dasar (Versi Sederhana)
function Skills() {
  return (
    <div className="section">
      <h3>Keahlian</h3>
      <ul>
        <li>ReactJS Dasar</li>
        <li>HTML & CSS</li>
        <li>System Analysis</li>
        <li>Database Dasar</li>
      </ul>
    </div>
  );
}

// Child Component 6: Informasi kontak
function Contact() {
  return (
    <div className="section">
      <h3>Kontak</h3>
      <p>✉️ Email: robby23si@mahasiswa.pcr.ac.id</p>
      <p>💼 LinkedIn: linkedin.com/in/robbyaryasaputra</p>
    </div>
  );
}

// Main Component
export default function BiodataDiri() {
  return (
    <div>
      <HeaderProfile nama="Robby Arya Saputra" />
      <SectionDivider />

      <AboutMe />
      <SectionDivider />

      <PersonalInfo
        nim="2357301119"
        jurusan="Sistem Informasi"
        kelas="2SID"
        kampus="POLITEKNIK CALTEX RIAU"
      />
      <SectionDivider />

      <Skills />
      <SectionDivider />

      <Contact />
      <img src="img/mariobros.png" alt="logo" />
    </div>
  );
}
