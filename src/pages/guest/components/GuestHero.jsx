import { SlideUp } from "../../../components/animation";

export default function GuestHero() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center overflow-hidden animate-[fadeIn_0.6s_ease-out]"
      style={{
        background: "linear-gradient(135deg, #1f1208 0%, #2c1a0e 100%)",
      }}
    >
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=900&fit=crop"
          alt="Coffee shop ambient"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Subtle vignettes */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1f1208] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-[#f5c842]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#8b6f47]/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-left">
          <SlideUp delay={0.1}>
            <span
              className="inline-block"
              style={{
                background: "rgba(139, 111, 71, 0.2)",
                border: "1px solid rgba(245, 200, 66, 0.3)",
                color: "#f5c842",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: "6px",
              }}
            >
              ☕ Kedai Kopi Premium Terfavorit
            </span>
          </SlideUp>
          <SlideUp delay={0.2}>
            <h1
              className="text-4xl md:text-6xl font-normal tracking-tight text-[#FAF4EE] leading-tight"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Nikmati Sensasi <br />
              <span style={{ color: "#f5c842", fontWeight: "400" }}>
                Kopi Racikan Asli
              </span>
            </h1>
          </SlideUp>
          <SlideUp delay={0.3}>
            <p className="text-base md:text-lg text-amber-100/70 max-w-lg leading-relaxed">
              Setiap cangkir menyajikan racikan biji kopi terbaik, dipanggang
              dengan suhu presisi, serta diracik sepenuh hati oleh barista
              handal kami untuk menemani setiap cerita Anda.
            </p>
          </SlideUp>
          <SlideUp delay={0.4}>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#menu"
                className="px-8 py-4 text-white font-semibold text-base rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
                style={{
                  background: "#8b6f47",
                  boxShadow: "0 4px 18px rgba(139, 111, 71, 0.3)",
                }}
              >
                Pesan Kopi Sekarang
              </a>
              <a
                href="#about"
                className="px-8 py-4 border text-[#f5c842] hover:bg-white/5 font-semibold text-base rounded-lg transition-all duration-300 active:scale-[0.98] text-center"
                style={{
                  borderColor: "rgba(245, 200, 66, 0.4)",
                }}
              >
                Tentang Kedai Kami
              </a>
            </div>
          </SlideUp>
        </div>

        {/* Featured Hero Card */}
        <SlideUp delay={0.5} className="hidden lg:block relative">
          <div className="absolute inset-0 bg-[#8b6f47]/10 rounded-3xl blur-2xl transform rotate-6 scale-95 pointer-events-none"></div>
          <div
            className="relative p-6 rounded-2xl shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=450&fit=crop"
              alt="Latte signature"
              className="w-full h-64 object-cover rounded-xl mb-6 shadow-md"
            />
            <div className="flex justify-between items-center text-left">
              <div>
                <h3
                  className="text-xl text-[#FAF4EE]"
                  style={{ fontFamily: "'Georgia', serif", fontWeight: "normal" }}
                >
                  Signature Cafe Latte
                </h3>
                <p className="text-xs text-amber-200/60 mt-1">
                  Perpaduan espresso arabika & susu premium
                </p>
              </div>
              <span className="text-xl font-bold text-[#f5c842]">
                IDR 45K
              </span>
            </div>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}

