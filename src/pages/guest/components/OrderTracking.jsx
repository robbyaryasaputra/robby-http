import { useState } from "react";
import { LuUtensils, LuCircleAlert, LuLoader } from "react-icons/lu";
import { supabase } from "../../../lib/supabase";

export default function OrderTracking({
  trackIdInput,
  setTrackIdInput,
  trackedOrder: externalTrackedOrder,
  trackError: externalTrackError,
}) {
  const [internalTracked, setInternalTracked] = useState(null);
  const [internalError, setInternalError] = useState(null);
  const [searching, setSearching] = useState(false);

  // Use internal state if controlled externally is null
  const trackedOrder = externalTrackedOrder || internalTracked;
  const trackError = externalTrackError || internalError;

  const handleTrack = async (e) => {
    e.preventDefault();
    setInternalError(null);
    setInternalTracked(null);

    const input = (trackIdInput || "").trim().toUpperCase();
    if (!input) {
      setInternalError("Harap masukkan ID Pesanan terlebih dahulu.");
      return;
    }

    setSearching(true);
    try {
      // 1. Try Supabase first
      const { data: dbOrder, error: dbErr } = await supabase
        .from("orders")
        .select(`
          id, order_number, customer_name, status, total_amount,
          delivery_type, table_number, notes, created_at,
          order_items ( item_name, quantity, unit_price ),
          payments ( payment_method )
        `)
        .ilike("order_number", input)
        .maybeSingle();

      if (!dbErr && dbOrder) {
        const statusMap = {
          pending: "Pending",
          processing: "Processing",
          completed: "Completed",
          cancelled: "Cancelled",
        };
        const mapped = {
          id: dbOrder.order_number || dbOrder.id,
          customer: dbOrder.customer_name || "Guest",
          status: statusMap[dbOrder.status] || "Pending",
          total: Number(dbOrder.total_amount || 0),
          tableNumber: dbOrder.table_number,
          notes: dbOrder.notes,
          paymentMethod: dbOrder.payments?.[0]?.payment_method || "cash",
          items: (dbOrder.order_items || []).map((i) => ({
            name: i.item_name,
            qty: i.quantity,
            price: Number(i.unit_price || 0),
          })),
        };
        setInternalTracked(mapped);
        setSearching(false);
        return;
      }

      // 2. Fallback to localStorage
      const stored = localStorage.getItem("orders");
      if (stored) {
        try {
          const list = JSON.parse(stored);
          const found = list.find(
            (o) => (o.id || "").toUpperCase() === input
          );
          if (found) {
            setInternalTracked(found);
            setSearching(false);
            return;
          }
        } catch (_) { }
      }

      setInternalError(
        `ID Pesanan "${input}" tidak ditemukan. Pastikan penulisan benar (contoh: ORD-001).`
      );
    } catch (err) {
      console.error("Track order error:", err);
      setInternalError("Gagal melacak pesanan. Coba lagi.");
    } finally {
      setSearching(false);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Processing":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Pending":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getTrackingSteps = (status) => {
    const steps = [
      {
        title: "Pesanan Diterima",
        desc: "Menunggu antrean barista",
        status: "completed",
      },
      {
        title: "Kopi Sedang Diseduh",
        desc: "Barista sedang meracik kopi Anda",
        status: "pending",
      },
      {
        title: "Pemeriksaan Kualitas",
        desc: "Memastikan rasa terbaik",
        status: "pending",
      },
      {
        title: "Siap Disajikan",
        desc: "Silakan ambil atau ditunggu di meja",
        status: "pending",
      },
    ];

    if (status === "Completed") {
      return steps.map((s) => ({ ...s, status: "completed" }));
    }
    if (status === "Processing") {
      steps[0].status = "completed";
      steps[1].status = "active";
      steps[1].desc = "Kopi Anda sedang diracik!";
      return steps;
    }
    if (status === "Pending") {
      steps[0].status = "active";
      steps[0].desc = "Pesanan masuk antrean.";
      return steps;
    }
    if (status === "Cancelled") {
      return [
        {
          title: "Pesanan Dibuat",
          desc: "Pesanan telah dibuat",
          status: "completed",
        },
        {
          title: "Dibatalkan",
          desc: "Pesanan ini dibatalkan",
          status: "failed",
        },
      ];
    }
    return steps;
  };

  return (
    <section id="track" className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8b6f47]">
            Lacak Proses Brewing
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1a0f07]" style={{ fontFamily: "'Georgia', serif" }}>
            Lacak Pesanan Anda Secara Instan
          </h2>
          <p className="text-[#8a7868] text-sm max-w-lg mx-auto leading-relaxed">
            Masukkan ID Pesanan unik yang Anda peroleh setelah menyelesaikan
            checkout untuk melihat status persiapan kopi Anda secara
            real-time.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleTrack}
          className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto bg-[#faf8f3] p-3 rounded-2xl border border-[#ede8e1]"
        >
          <input
            type="text"
            placeholder="Masukkan ID Pesanan (contoh: ORD-123)..."
            value={trackIdInput}
            onChange={(e) => setTrackIdInput(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#ede8e1] text-[#1a0f07] text-sm focus:outline-none focus:border-[#8b6f47]/50"
          />
          <button
            type="submit"
            disabled={searching}
            className="py-3 px-6 rounded-xl text-white font-bold text-sm shadow-md transition-colors active:scale-[0.98] cursor-pointer disabled:opacity-60 flex items-center gap-2 border-0"
            style={{
              background: "#1a0f07",
              boxShadow: "0 2px 8px rgba(26, 15, 7, 0.2)",
            }}
          >
            {searching ? (
              <LuLoader className="w-4 h-4 animate-spin" />
            ) : null}
            {searching ? "Mencari..." : "Lacak Sekarang"}
          </button>
        </form>

        {/* Track Results */}
        {trackedOrder && (
          <div className="bg-[#faf8f3] border border-[#ede8e1] rounded-3xl p-6 md:p-8 space-y-8 animate-[fadeIn_0.5s_ease-out] text-left max-w-2xl mx-auto">
            {/* Order Info */}
            <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-[#ede8e1]">
              <div>
                <span className="text-xs text-gray-500 font-bold">
                  ID PESANAN
                </span>
                <h3 className="font-bold text-xl text-[#1a0f07]" style={{ fontFamily: "'Georgia', serif" }}>
                  {trackedOrder.id}
                </h3>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-bold block text-right">
                  STATUS
                </span>
                <span
                  className={`inline-block py-1 px-3.5 rounded-full text-xs font-extrabold mt-1 uppercase ${getStatusColor(trackedOrder.status)}`}
                >
                  {trackedOrder.status}
                </span>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-6">
              <h4 className="font-bold text-[#1a0f07] text-sm">
                Progres Pesanan:
              </h4>
              <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {getTrackingSteps(trackedOrder.status).map((step, idx) => {
                  const isCompleted = step.status === "completed";
                  const isActive = step.status === "active";
                  const isFailed = step.status === "failed";
                  return (
                    <div key={idx} className="relative flex flex-col gap-1">
                      {/* Bullet */}
                      <div
                        className={`absolute -left-8.5 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${isCompleted
                            ? "bg-[#8b6f47] border-[#8b6f47] text-white"
                            : isActive
                              ? "bg-amber-400 border-amber-400 text-[#1a0f07] animate-pulse"
                              : isFailed
                                ? "bg-red-500 border-red-500 text-white"
                                : "bg-white border-gray-300 text-gray-300"
                          }`}
                      >
                        {isCompleted ? (
                          <span className="text-[10px] font-black">✓</span>
                        ) : isFailed ? (
                          <span className="text-[10px] font-black">✗</span>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                        )}
                      </div>
                      {/* Text */}
                      <span
                        className={`font-bold text-sm ${isActive ? "text-[#8b6f47]" : isFailed ? "text-red-600" : "text-[#1a0f07]"}`}
                      >
                        {step.title}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Items */}
            <div className="pt-6 border-t border-[#ede8e1] space-y-3">
              <h4 className="font-bold text-[#1a0f07] text-sm">
                Detail Pesanan:
              </h4>
              <div className="bg-white rounded-2xl border border-[#ede8e1] p-4 space-y-3">
                {trackedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl bg-gray-50 p-3"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-[#1a0f07]">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.qty} x IDR {Number(item.price).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#8b6f47] text-right">
                      IDR {Number(item.price * item.qty).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3 pt-3 mt-3 text-xs text-slate-600 font-semibold">
                  <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                      Metode Pembayaran
                    </span>
                    <span className="block pt-1 text-sm font-bold text-slate-800 capitalize">
                      {trackedOrder.paymentMethod || "Cash"}
                    </span>
                  </div>
                  {trackedOrder.promoCode && (
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                        Promo terpakai
                      </span>
                      <span className="block pt-1 text-sm font-bold text-slate-800">
                        {trackedOrder.promoCode}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-3 mt-3 font-extrabold text-base text-[#1a0f07]">
                  <span>Total Pembayaran</span>
                  <span>IDR {Number(trackedOrder.total).toLocaleString("id-ID")}</span>
                </div>
              </div>
              {trackedOrder.tableNumber && (
                <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                  <LuUtensils className="w-4 h-4 text-[#8b6f47]" />
                  Disajikan langsung di Meja:{" "}
                  <span className="text-[#1a0f07] font-bold">
                    No. {trackedOrder.tableNumber}
                  </span>
                </p>
              )}
              {trackedOrder.notes && (
                <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100">
                  <span className="text-[10px] text-amber-800 font-bold block mb-1">
                    CATATAN:
                  </span>
                  <p className="text-xs text-amber-900 font-medium italic">
                    "{trackedOrder.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {trackError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 max-w-md mx-auto flex items-center gap-3 text-left animate-[fadeIn_0.3s_ease-out]">
            <LuCircleAlert className="w-6 h-6 shrink-0" />
            <p className="text-xs font-semibold">{trackError}</p>
          </div>
        )}
      </div>

    </section>
  );
}
