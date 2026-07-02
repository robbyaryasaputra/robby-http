import { useState } from "react";
import { LuX, LuMessageCircle, LuInstagram, LuPlay } from "react-icons/lu";
import { PulseGlow } from "../../../components/animation";

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {/* Expanded Contact Card */}
      {isOpen && (
        <div className="bg-white rounded-3xl border border-[#EBE3D5] p-5 shadow-2xl w-64 space-y-4 animate-[scaleUp_0.3s_ease-out] text-left">
          <h4 className="font-extrabold text-sm text-[#4B2C20] border-b border-[#F2E7DC] pb-2 flex justify-between items-center">
            <span>Hubungi Kami</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            >
              <LuX className="w-4 h-4" />
            </button>
          </h4>

          <div className="space-y-3">
            {/* WhatsApp Link */}
            <a
              href="https://wa.me/6281234567890?text=Halo%20Bean%20and%20Brew,%20saya%20ingin%20tanya%20reservasi%20tempat..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LuMessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold block">WhatsApp Chat</span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Reservasi & Tanya Acara
                </span>
              </div>
            </a>

            {/* Instagram Link */}
            <a
              href="https://instagram.com/coffee_shop_username"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-700 transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LuInstagram className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold block">Instagram</span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Update & Promo Harian
                </span>
              </div>
            </a>

            {/* TikTok Link */}
            <a
              href="https://tiktok.com/@coffee_shop_username"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 text-gray-700 hover:text-black transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-slate-100 text-gray-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LuPlay className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold block">TikTok</span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Keseruan Kafe Kami
                </span>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <PulseGlow color="#855C3B" className="rounded-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#855C3B] hover:bg-[#5F3A27] text-white flex items-center justify-center shadow-xl shadow-[#855C3B]/20 transition-all duration-300 hover:scale-105 active:scale-[0.97] relative group focus:outline-none cursor-pointer"
          title="Hubungi Kami"
        >
          {/* Pulsing Outer Ring */}
          <span className="absolute inset-0 rounded-full bg-[#855C3B]/40 animate-ping opacity-75 group-hover:hidden"></span>

          {isOpen ? (
            <LuX className="w-6 h-6 relative z-10" />
          ) : (
            <LuMessageCircle className="w-6 h-6 relative z-10 animate-bounce" />
          )}
        </button>
      </PulseGlow>
    </div>
  );
}
