import { LuCircleCheck } from "react-icons/lu";

export default function CheckoutSuccessModal({ checkoutSuccess, onClose }) {
  if (!checkoutSuccess) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#EBE3D5] text-center space-y-6 shadow-2xl animate-[scaleUp_0.4s_ease-out]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <LuCircleCheck className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-2xl text-[#4B2C20]">
            Pesanan Berhasil Dikirim!
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            Barista kami telah menerima pesanan Anda dan siap untuk menyeduh
            cangkir kopi terbaik Anda.
          </p>
        </div>

        <div className="bg-[#F9F5EE] border border-[#EBE3D5] rounded-2xl p-4 space-y-3 text-left">
          <div>
            <span className="text-[10px] text-gray-500 font-bold block mb-1">
              ID PESANAN UNTUK PELACAKAN:
            </span>
            <span className="text-2xl font-black text-[#855C3B] tracking-widest">
              {checkoutSuccess.id}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 font-semibold">
            <div className="bg-white rounded-2xl p-3 border border-slate-100">
              <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                Metode Pembayaran
              </span>
              <span className="block pt-1 text-sm font-bold text-slate-800">
                {checkoutSuccess.paymentMethod || "Cash"}
              </span>
            </div>
            {checkoutSuccess.promoCode && (
              <div className="bg-white rounded-2xl p-3 border border-slate-100">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                  Promo Terpakai
                </span>
                <span className="block pt-1 text-sm font-bold text-slate-800">
                  {checkoutSuccess.promoCode}
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-normal">
          *Tulis atau salin ID Pesanan di atas untuk memeriksa status
          persiapan Anda pada bagian pelacakan di bawah halaman.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl bg-[#855C3B] text-white hover:bg-[#5F3A27] font-bold text-sm transition-colors shadow-lg shadow-[#855C3B]/10 active:scale-[0.98] cursor-pointer"
        >
          Lacak Pesanan Saya
        </button>
      </div>
    </div>
  );
}
