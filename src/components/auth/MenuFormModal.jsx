import { useState, useEffect } from "react";
import { LuX, LuLoader, LuDollarSign, LuTag, LuImage, LuCoffee } from "react-icons/lu";
import Button from "../basic/Button";

export default function MenuFormModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialData = null,
  loading = false,
}) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    image_url: "",
    badge: "",
    description: "",
    is_available: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category_id: initialData.category_id || "",
        price: initialData.price || "",
        image_url: initialData.image_url || "",
        badge: initialData.badge || "",
        description: initialData.description || "",
        is_available: initialData.is_available !== false,
      });
    } else {
      setFormData({
        name: "",
        category_id: categories.length > 0 ? categories[0].id : "",
        price: "",
        image_url: "",
        badge: "",
        description: "",
        is_available: true,
      });
    }
  }, [initialData, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category_id: parseInt(formData.category_id),
      price: parseFloat(formData.price),
    });
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
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl shadow-black/20 animate-[fadeIn_0.3s_ease-out] overflow-hidden max-h-[90vh] flex flex-col z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-[#FAF6F0] to-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#2C1A0E]">
              {isEdit ? "Edit Menu Kopi" : "Tambah Menu Kopi Baru"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit
                ? "Perbarui informasi item menu kopi Anda"
                : "Isi data untuk menambahkan item menu baru"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all duration-200 cursor-pointer"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-7 space-y-4 overflow-y-auto flex-1 text-left">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nama Menu
            </label>
            <div className="relative">
              <LuCoffee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Caramel Macchiato"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kategori
              </label>
              <select
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Harga ($)
              </label>
              <div className="relative">
                <LuDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="4.50"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              URL Gambar
            </label>
            <div className="relative">
              <LuImage className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="image_url"
                type="url"
                required
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Badge */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Badge Promo (Opsional)
              </label>
              <div className="relative">
                <LuTag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all"
                >
                  <option value="">Tidak ada</option>
                  <option value="Popular">Popular</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="New">New</option>
                  <option value="Premium">Premium</option>
                  <option value="Featured">Featured</option>
                </select>
              </div>
            </div>

            {/* Is Available Toggle */}
            <div className="flex flex-col justify-end pb-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  name="is_available"
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-lg border-slate-300 text-[#BF834F] focus:ring-[#BF834F]"
                />
                <span className="text-sm font-semibold text-slate-700">Tersedia untuk Dipesan</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Deskripsi Menu
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan detail menu kopi..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all resize-none"
            />
          </div>

          {/* Footer Action */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 py-3 rounded-xl font-semibold text-sm hover:bg-[#6d4734] transition-all shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LuLoader className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                "Simpan Menu"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
