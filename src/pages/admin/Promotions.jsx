import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { PageHeader } from "../../components/section";
import { Table, Tooltip } from "../../components/data-display";
import { Breadcrumb } from "../../components/navigation";
import { SlideUp } from "../../components/animation";
import { Button } from "../../components/basic";
import { Input, Select, ToggleSwitch } from "../../components/form";
import { ModalOverlay } from "../../components/overlay";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuLoader,
  LuRefreshCw,
  LuTag,
  LuCircleCheck,
  LuCircleAlert,
} from "react-icons/lu";

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage" },
  { value: "fixed", label: "Fixed Amount" },
];

const TIERS = [
  { value: "Bronze", label: "Bronze" },
  { value: "Silver", label: "Silver" },
  { value: "Gold", label: "Gold" },
  { value: "Platinum", label: "Platinum" },
];

const DEFAULT_FORM = {
  code: "",
  name: "",
  description: "",
  discount_type: "percentage",
  discount_value: 0,
  min_order_amount: 0,
  start_date: new Date().toISOString().split("T")[0],
  end_date: new Date().toISOString().split("T")[0],
  is_active: true,
  max_uses: null,
  member_only: false,
  min_tier: "Bronze",
};

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setPromotions(data || []);
    } catch (err) {
      console.error("Error fetching promotions:", err);
      setError(err.message || "Gagal memuat data promosi.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPromotion(null);
    setFormData(DEFAULT_FORM);
    setModalOpen(true);
  };

  const openEditModal = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code || "",
      name: promotion.name || "",
      description: promotion.description || "",
      discount_type: promotion.discount_type || "percentage",
      discount_value: Number(promotion.discount_value) || 0,
      min_order_amount: Number(promotion.min_order_amount) || 0,
      start_date: promotion.start_date
        ? promotion.start_date.split("T")[0]
        : new Date().toISOString().split("T")[0],
      end_date: promotion.end_date
        ? promotion.end_date.split("T")[0]
        : new Date().toISOString().split("T")[0],
      is_active: promotion.is_active,
      max_uses: promotion.max_uses || null,
      member_only: promotion.member_only,
      min_tier: promotion.min_tier || "Bronze",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        min_order_amount: Number(formData.min_order_amount),
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
        max_uses: formData.max_uses ? Number(formData.max_uses) : null,
        member_only: formData.member_only,
        min_tier: formData.min_tier,
      };

      if (!payload.code || !payload.name) {
        throw new Error("Kode dan nama promosi wajib diisi.");
      }
      if (payload.end_date < payload.start_date) {
        throw new Error("Tanggal akhir harus sama atau setelah tanggal mulai.");
      }

      if (editingPromotion) {
        const { error: updateError } = await supabase
          .from("promotions")
          .update(payload)
          .eq("id", editingPromotion.id);

        if (updateError) throw updateError;
        setSuccess("Promosi berhasil diperbarui.");
      } else {
        const { error: insertError } = await supabase
          .from("promotions")
          .insert([payload]);

        if (insertError) throw insertError;
        setSuccess("Promosi baru berhasil ditambahkan.");
      }

      setModalOpen(false);
      fetchPromotions();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menyimpan promosi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus promosi ini? Aksi tidak dapat dibatalkan.")) return;

    setDeleteLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error: deleteError } = await supabase
        .from("promotions")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      setSuccess("Promosi berhasil dihapus.");
      fetchPromotions();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menghapus promosi.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Promotions" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Promotions"
          subtitle="Kelola kupon, diskon, dan promosi toko kopi Anda"
        />
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={LuRefreshCw}
            onClick={fetchPromotions}
            className="whitespace-nowrap"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={LuPlus}
            onClick={openCreateModal}
            className="whitespace-nowrap"
          >
            Tambah Promosi
          </Button>
        </div>
      </div>

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <div className="flex items-start gap-3">
            <LuCircleCheck className="w-5 h-5" />
            <p>{success}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="flex items-start gap-3">
            <LuCircleAlert className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <SlideUp duration={0.4}>
        <Table
          columns={[
            { label: "Code" },
            { label: "Nama" },
            { label: "Tipe Diskon" },
            { label: "Nilai" },
            { label: "Periode" },
            { label: "Member" },
            { label: "Aktif" },
            { label: "Aksi" },
          ]}
          data={promotions}
          renderRow={(promo) => (
            <tr
              key={promo.id}
              className="hover:bg-amber-50/30 transition-colors duration-200"
            >
              <td className="px-6 py-4 text-sm font-semibold text-[#2C1A0E]">
                {promo.code}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{promo.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                {promo.discount_type}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {promo.discount_type === "percentage"
                  ? `${promo.discount_value}%`
                  : `IDR ${Number(promo.discount_value).toLocaleString("id-ID")}`}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {promo.start_date?.split("T")[0]} -{" "}
                {promo.end_date?.split("T")[0]}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {promo.member_only ? promo.min_tier || "Bronze" : "Umum"}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {promo.is_active ? "Ya" : "Tidak"}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Tooltip content="Edit promosi">
                  <button
                    onClick={() => openEditModal(promo)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <LuPencil className="w-4 h-4" />
                  </button>
                </Tooltip>
                <Tooltip content="Hapus promosi">
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    disabled={deleteLoading}
                  >
                    <LuTrash2 className="w-4 h-4" />
                  </button>
                </Tooltip>
              </td>
            </tr>
          )}
          emptyMessage={
            loading ? "Memuat promosi..." : "Belum ada promosi tersimpan."
          }
          className={loading ? "opacity-80" : ""}
        />
      </SlideUp>

      <ModalOverlay isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl shadow-black/10 overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-7 py-6 border-b border-slate-100 bg-[#FAF6F0]">
            <div>
              <h2 className="text-xl font-bold text-[#2C1A0E]">
                {editingPromotion ? "Edit Promosi" : "Tambah Promosi Baru"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {editingPromotion
                  ? "Perbarui detail promosi di sini"
                  : "Buat promo baru yang tampil di seluruh aplikasi."}
              </p>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="w-11 h-11 rounded-3xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="promo-code"
                name="code"
                label="Kode Promo"
                value={formData.code}
                onChange={handleChange}
                required
              />
              <Input
                id="promo-name"
                name="name"
                label="Nama Promo"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Select
                id="discount_type"
                name="discount_type"
                label="Tipe Diskon"
                value={formData.discount_type}
                onChange={handleChange}
                options={DISCOUNT_TYPES}
              />
              <Input
                id="discount_value"
                name="discount_value"
                label="Nilai Diskon"
                type="number"
                value={formData.discount_value}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
              <Input
                id="min_order_amount"
                name="min_order_amount"
                label="Minimum Order"
                type="number"
                value={formData.min_order_amount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Input
                id="start_date"
                name="start_date"
                label="Mulai"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
              <Input
                id="end_date"
                name="end_date"
                label="Berakhir"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
              <Input
                id="max_uses"
                name="max_uses"
                label="Maks Penggunaan"
                type="number"
                value={formData.max_uses || ""}
                onChange={handleChange}
                min="1"
                placeholder="Kosong = tidak terbatas"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Select
                id="min_tier"
                name="min_tier"
                label="Minimum Tier"
                value={formData.min_tier}
                onChange={handleChange}
                options={TIERS}
              />
              <div className="space-y-4">
                <ToggleSwitch
                  id="member_only"
                  label="Hanya untuk member"
                  checked={formData.member_only}
                  onChange={handleChange}
                />
                <ToggleSwitch
                  id="is_active"
                  label="Aktif"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deskripsi Promosi
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon={LuTag}
                className="w-full sm:w-auto"
                loading={submitting}
              >
                {editingPromotion ? "Perbarui Promosi" : "Simpan Promosi"}
              </Button>
            </div>
          </form>
        </div>
      </ModalOverlay>
    </div>
  );
}
