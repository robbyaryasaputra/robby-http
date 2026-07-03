import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { PageHeader } from "../../components/section";
import { Table } from "../../components/data-display";
import { Breadcrumb, TabBar } from "../../components/navigation";
import { SlideUp } from "../../components/animation";
import {
  LuCheck,
  LuX,
  LuRefreshCw,
  LuLoader,
  LuStar,
  LuMessageSquare,
} from "react-icons/lu";

const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <LuStar
        key={s}
        className={`w-3.5 h-3.5 ${
          s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
        }`}
      />
    ))}
  </div>
);

const CategoryBadge = ({ category }) => {
  const colors = {
    Pelayanan: "bg-blue-50 text-blue-700 border-blue-200",
    "Rasa Menu": "bg-amber-50 text-amber-700 border-amber-200",
    Kebersihan: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Suasana: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
        colors[category] || "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {category}
    </span>
  );
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Error loading reviews:", err);
      showToast("Gagal memuat ulasan.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id, approve) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: approve })
        .eq("id", id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, is_approved: approve } : r
        )
      );
      showToast(
        approve ? "Ulasan berhasil disetujui." : "Ulasan berhasil ditolak.",
        "success"
      );
    } catch (err) {
      console.error("Error moderating review:", err);
      showToast("Gagal memperbarui status ulasan.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === "Approved") return r.is_approved === true;
    if (activeTab === "Rejected") return r.is_approved === false;
    if (activeTab === "Pending") return r.is_approved === null || r.is_approved === undefined;
    return true;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter((r) => r.is_approved === true).length,
    pending: reviews.filter((r) => r.is_approved === null || r.is_approved === undefined).length,
    avgRating:
      reviews.length > 0
        ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : "0.0",
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Reviews" },
        ]}
      />

      {/* Toast */}
      {toast.msg && (
        <div
          className={`flex items-center gap-2 p-3 text-xs font-semibold rounded-xl animate-[fadeIn_0.3s_ease-out] ${
            toast.type === "success"
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
              : "text-rose-700 bg-rose-50 border border-rose-200"
          }`}
        >
          {toast.type === "success" ? (
            <LuCheck className="w-4 h-4 shrink-0" />
          ) : (
            <LuX className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Reviews Moderation"
        subtitle="Setujui atau tolak ulasan pelanggan sebelum ditampilkan di halaman publik"
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReviews}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors border-0 cursor-pointer"
            >
              <LuRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        }
      />

      {/* Stat Cards */}
      <SlideUp duration={0.4}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Ulasan", value: stats.total, color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
            { label: "Disetujui", value: stats.approved, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
            { label: "Menunggu", value: stats.pending, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
            { label: "Rata-rata Rating", value: `⭐ ${stats.avgRating}`, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${s.bg}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </SlideUp>

      {/* Tab Filter */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <TabBar
          tabs={STATUS_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <p className="text-xs text-slate-400 font-medium">
          {filteredReviews.length} ulasan ditemukan
        </p>
      </div>

      {/* Table */}
      <SlideUp duration={0.4}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <LuLoader className="w-8 h-8 animate-spin text-slate-300" />
            <p className="text-sm text-slate-400 font-medium">Memuat ulasan...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <LuMessageSquare className="w-10 h-10 text-slate-200" />
            <p className="text-sm text-slate-400 font-medium">Tidak ada ulasan dalam kategori ini.</p>
          </div>
        ) : (
          <Table
            columns={[
              { label: "Tanggal" },
              { label: "Nama" },
              { label: "Kategori" },
              { label: "Rating" },
              { label: "Komentar" },
              { label: "Status" },
              { label: "Aksi" },
            ]}
            data={filteredReviews}
            renderRow={(review) => (
              <tr
                key={review.id}
                className="hover:bg-amber-50/10 transition-colors"
              >
                <td className="px-5 py-4 text-xs text-slate-400 font-medium whitespace-nowrap">
                  {new Date(review.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-700 whitespace-nowrap">
                  {review.customer_name || "Guest"}
                </td>
                <td className="px-5 py-4">
                  <CategoryBadge category={review.category || "Lainnya"} />
                </td>
                <td className="px-5 py-4">
                  <StarRating rating={review.rating || 0} />
                </td>
                <td className="px-5 py-4 text-xs text-slate-600 max-w-[240px] truncate font-medium" title={review.comment}>
                  {review.comment}
                </td>
                <td className="px-5 py-4">
                  {review.is_approved === true ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <LuCheck className="w-3 h-3" /> Disetujui
                    </span>
                  ) : review.is_approved === false ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                      <LuX className="w-3 h-3" /> Ditolak
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Menunggu
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {review.is_approved !== true && (
                      <button
                        onClick={() => handleModerate(review.id, true)}
                        disabled={updatingId === review.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors disabled:opacity-50 border-0 cursor-pointer"
                      >
                        {updatingId === review.id ? (
                          <LuLoader className="w-3 h-3 animate-spin" />
                        ) : (
                          <LuCheck className="w-3 h-3" />
                        )}
                        Setujui
                      </button>
                    )}
                    {review.is_approved !== false && (
                      <button
                        onClick={() => handleModerate(review.id, false)}
                        disabled={updatingId === review.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {updatingId === review.id ? (
                          <LuLoader className="w-3 h-3 animate-spin" />
                        ) : (
                          <LuX className="w-3 h-3" />
                        )}
                        Tolak
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          />
        )}
      </SlideUp>
    </div>
  );
}
