import { SlideUp } from "../../../components/animation";

export default function GuestHero() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] bg-[#3F2419] flex items-center overflow-hidden animate-[fadeIn_0.6s_ease-out]"
    >
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=900&fit=crop"
          alt="Coffee shop ambient"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Abstract shapes */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-amber-700/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-left">
          <SlideUp delay={0.1}>
            <span className="inline-block bg-[#855C3B]/50 border border-amber-600/30 text-amber-200 text-xs font-bold tracking-widest uppercase py-1.5 px-4 rounded-full">
              ☕ Kedai Kopi Premium Terfavorit
            </span>
          </SlideUp>
          <SlideUp delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#FAF4EE] leading-tight">
              Nikmati Sensasi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Kopi Racikan Asli
              </span>
            </h1>
          </SlideUp>
          <SlideUp delay={0.3}>
            <p className="text-base md:text-lg text-amber-100/80 max-w-lg leading-relaxed">
              Setiap cangkir menyajikan racikan biji kopi terbaik, dipanggang
              dengan suhu presisi, serta diracik sepenuh hati oleh barista
              handal kami untuk menemani setiap cerita Anda.
            </p>
          </SlideUp>
          <SlideUp delay={0.4}>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#menu"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-[#4B2C20] hover:from-amber-400 hover:to-amber-500 font-extrabold text-base rounded-2xl shadow-xl shadow-amber-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Pesan Kopi Sekarang
              </a>
              <a
                href="#about"
                className="px-8 py-4 border border-amber-400/40 text-amber-200 hover:bg-white/5 font-extrabold text-base rounded-2xl transition-all duration-300 active:scale-[0.98]"
              >
                Tentang Kedai Kami
              </a>
            </div>
          </SlideUp>
        </div>

        {/* Featured Hero Card */}
        <SlideUp delay={0.5} className="hidden lg:block relative">
          <div className="absolute inset-0 bg-[#855C3B]/20 rounded-3xl blur-2xl transform rotate-6 scale-95 pointer-events-none"></div>
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=450&fit=crop"
              alt="Latte signature"
              className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md"
            />
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl text-[#FAF4EE]">
                  Signature Cafe Latte
                </h3>
                <p className="text-xs text-amber-200/70 mt-1">
                  Perpaduan espresso arabika & susu premium
                </p>
              </div>
              <span className="text-2xl font-black text-amber-400">
                $4.50
              </span>
            </div>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}
