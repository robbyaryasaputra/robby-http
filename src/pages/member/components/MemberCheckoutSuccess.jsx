import { LuCircleCheck } from "react-icons/lu";

export default function MemberCheckoutSuccess({ checkoutSuccess, onClose }) {
  if (!checkoutSuccess) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center transform transition-all animate-[scaleIn_0.2s_ease-out] space-y-5">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
          <LuCircleCheck className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="font-black text-slate-800 text-lg">Pesanan Berhasil!</h3>
          <p className="text-xs text-slate-400 font-medium">
            Order ID:{" "}
            <span className="font-mono text-slate-700 font-bold">{checkoutSuccess.id}</span>
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 text-left border border-slate-100">
          <div className="flex justify-between font-medium">
            <span className="text-slate-400">Total Belanja:</span>
            <span className="text-slate-800 font-bold">
              IDR {Number(checkoutSuccess.total).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-slate-400">Pembayaran:</span>
            <span className="text-slate-800 font-bold">{checkoutSuccess.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 font-bold text-emerald-600">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
              🎁 Bonus Loyalty Points:
            </span>
            <span>+{checkoutSuccess.points} pts</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer border-0"
        >
          Tutup & Selesai
        </button>
      </div>
    </div>
  );
}
