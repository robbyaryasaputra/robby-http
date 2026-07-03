import { LuLock, LuX, LuUserPlus, LuLogIn, LuCoffee } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

/**
 * AuthPromptModal — ditampilkan saat guest tanpa login mencoba membuka keranjang.
 * Menawarkan tombol Login dan Register dengan redirect kembali ke halaman guest.
 */
export default function AuthPromptModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    // Simpan intent ke sessionStorage agar setelah login cart otomatis terbuka
    sessionStorage.setItem("cart_intent", "open");
    navigate("/auth/login?redirect=/");
  };

  const handleRegister = () => {
    sessionStorage.setItem("cart_intent", "open");
    navigate("/auth/register?redirect=/");
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-[scaleIn_0.25s_ease-out]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors border-0 cursor-pointer"
        >
          <LuX className="w-4 h-4 text-slate-500" />
        </button>

        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20">
          <LuLock className="w-9 h-9 text-white" />
        </div>

        {/* Branding */}
        <div className="flex items-center gap-1.5 mb-3">
          <LuCoffee className="w-4 h-4 text-[#855C3B]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#855C3B]">
            Bean &amp; Brew
          </span>
        </div>

        {/* Heading */}
        <h3 className="text-xl font-black text-[#2C1A0E] mb-2 leading-tight">
          Login Diperlukan
        </h3>
        <p className="text-sm text-slate-500 mb-7 leading-relaxed max-w-xs">
          Anda perlu <strong className="text-slate-700">masuk ke akun</strong>{" "}
          terlebih dahulu untuk membuka keranjang belanja dan melanjutkan
          pemesanan.
        </p>

        {/* Benefits reminder */}
        <div className="w-full bg-amber-50 rounded-2xl px-4 py-3.5 border border-amber-100 mb-6 text-left space-y-1.5">
          {[
            "☕ Kumpulkan poin loyalitas setiap pesanan",
            "🎁 Akses reward & voucher eksklusif",
            "📋 Lacak semua riwayat transaksi",
          ].map((b, i) => (
            <p key={i} className="text-[11px] font-semibold text-amber-800">
              {b}
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={handleLogin}
            className="w-full py-3.5 rounded-2xl bg-[#855C3B] hover:bg-[#6d4734] text-white font-extrabold text-sm transition-all shadow-lg shadow-[#855C3B]/20 active:scale-[0.98] flex items-center justify-center gap-2 border-0 cursor-pointer"
          >
            <LuLogIn className="w-4 h-4" />
            Masuk ke Akun Member
          </button>

          <button
            onClick={handleRegister}
            className="w-full py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-[#855C3B] font-extrabold text-sm transition-all border border-amber-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <LuUserPlus className="w-4 h-4" />
            Daftar Akun Baru
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-transparent hover:bg-slate-50 text-slate-400 font-semibold text-sm transition-all border-0 cursor-pointer"
          >
            Lanjut Browsing Dulu
          </button>
        </div>
      </div>
    </div>
  );
}
