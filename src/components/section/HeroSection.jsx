export default function HeroSection({
  greeting = "Good Morning",
  title = "Grab Your Coffee Today",
  description = "Discover the best coffee flavors for your mood, with handcrafted blends and fast delivery.",
  buttonText = "Order Now",
  onButtonClick,
  imageSrc = "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop",
  imageAlt = "Coffee cup",
  className = "",
}) {
  return (
    <div
      className={`rounded-[2rem] bg-gradient-to-br from-[#8B5F3C] to-[#6A3F27] p-8 text-white shadow-[0_30px_80px_rgba(34,20,14,0.18)] ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1.4fr] gap-8 items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#f5e9dd] opacity-90 mb-3">
            {greeting}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-[#f2dfca] leading-7">
            {description}
          </p>
          <button
            onClick={onButtonClick}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#5F3A27] shadow-lg shadow-[#472F1E]/20 hover:bg-slate-50 transition-all duration-300"
          >
            {buttonText}
          </button>
        </div>
        <div className="rounded-[2rem] overflow-hidden bg-[#020202]/5 shadow-inner shadow-black/10">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
