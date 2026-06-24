import { useState, useEffect } from "react";
import { LuX, LuUser, LuMail, LuLock, LuLoader } from "react-icons/lu";
import Button from "../1-basic/Button";

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl shadow-black/20 animate-[fadeIn_0.3s_ease-out] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-[#FAF6F0] to-white">
          <div>
            <h2 className="text-lg font-bold text-[#2C1A0E]">
              {isEdit ? "Edit User" : "Tambah User Baru"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit
                ? "Perbarui informasi user yang sudah ada"
                : "Isi data untuk menambahkan user baru"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all duration-200 cursor-pointer"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all duration-300"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="email"
                type="email"
                required={!isEdit}
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                disabled={isEdit}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all duration-300 ${
                  isEdit ? "opacity-60 cursor-not-allowed bg-slate-100" : ""
                }`}
              />
            </div>
            {isEdit && (
              <p className="text-xs text-slate-400 mt-1.5">
                Email tidak dapat diubah
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password {isEdit && <span className="text-slate-400 font-normal">(kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <div className="relative">
              <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="password"
                type="password"
                required={!isEdit}
                value={formData.password}
                onChange={handleChange}
                placeholder={isEdit ? "••••••••" : "Masukkan password"}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all duration-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all duration-200 cursor-pointer"
            >
              Batal
            </button>
            <Button
              type="submit"
              loading={loading}
              fullWidth
              rounded="xl"
              className="flex-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LuLoader className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </span>
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Tambah User"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
