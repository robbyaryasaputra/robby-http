// src/pertemuan-3/UserForm.jsx
import { useState } from "react";
import InputField from "./components/InputField";

export default function UserForm() {
  const [formData, setFormData] = useState({
    nama: "",
    pekerjaan: "",
    pengalaman: "",
    divisi: "",
    status: ""
  });

  const [errors, setErrors] = useState({});
  const [hasil, setHasil] = useState(null);

  const validasi = (name, value) => {
    let errorMsg = "";

    // Validasi 1: Tidak boleh kosong (Required)
    if (!value) {
      errorMsg = `${name} wajib diisi!`;
    } 
    // Validasi 2: Tidak boleh angka (untuk Nama & Pekerjaan)
    else if ((name === "nama" || name === "pekerjaan") && /\d/.test(value)) {
      errorMsg = `${name} tidak boleh mengandung angka!`;
    }
    // Validasi 3: Minimal karakter atau range angka
    else if (name === "nama" && value.length < 5) {
      errorMsg = "Nama minimal 5 karakter!";
    }
    else if (name === "pengalaman" && (value < 0 || value > 50)) {
      errorMsg = "Input tahun tidak masuk akal (0-50)!";
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validasi(name, value);
  };

  // Cek apakah semua field terisi dan tidak ada error
  const isFormValid = 
    Object.values(formData).every(val => val !== "") && 
    Object.values(errors).every(err => err === "");

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasil(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Form Data Karyawan</h2>
       
        <form onSubmit={handleSubmit}>
          {/* 3 Inputan Text/Number/Date */}
          <InputField 
            label="Nama Lengkap" name="nama" type="text" 
            value={formData.nama} onChange={handleChange} error={errors.nama}
            placeholder="Contoh: james"
          />

          <InputField 
            label="Jabatan/Pekerjaan" name="pekerjaan" type="text" 
            value={formData.pekerjaan} onChange={handleChange} error={errors.pekerjaan}
            placeholder="Contoh: Website Developer"
          />

          <InputField 
            label="Pengalaman (Tahun)" name="pengalaman" type="number" 
            value={formData.pengalaman} onChange={handleChange} error={errors.pengalaman}
            placeholder="0"
          />

          {/* 2 Dropdown Select */}
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">Divisi</label>
            <select 
              name="divisi" value={formData.divisi} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">-- Pilih Divisi --</option>
              <option value="IT">IT Department</option>
              <option value="HRD">Human Resource</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Status Karyawan</label>
            <select 
              name="status" value={formData.status} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">-- Pilih Status --</option>
              <option value="Tetap">Karyawan Tetap</option>
              <option value="Kontrak">Kontrak</option>
            </select>
          </div>

          {/* Conditional Rendering Tombol Submit */}
          {isFormValid ? (
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform active:scale-95">
              Simpan Data
            </button>
          ) : (
            <p className="text-center text-sm text-gray-400 italic">Lengkapi form dengan benar untuk submit...</p>
          )}
        </form>

        {/* Conditional Rendering Hasil Inputan */}
        {hasil && (
          <div className="mt-8 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <h3 className="text-green-800 font-bold mb-2">✅ Data Berhasil Disimpan:</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Nama:</strong> {hasil.nama}</p>
              <p><strong>Posisi:</strong> {hasil.pekerjaan} ({hasil.divisi})</p>
              <p><strong>Pengalaman:</strong> {hasil.pengalaman} Tahun</p>
              <p><strong>Status:</strong> {hasil.status}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}