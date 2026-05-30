export default function Gallery({
  images = [],
  cols = 3,
  gap = "gap-4",
  className = "",
}) {
  const colsMap = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={`grid ${colsMap[cols] || colsMap[3]} ${gap} ${className}`}>
      {images.map((img, idx) => (
        <div
          key={idx}
          className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-gray-100/60 shadow-sm"
        >
          <img
            src={img.src}
            alt={img.alt || `Gallery image ${idx}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {img.title && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#33251f]/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xs font-semibold">{img.title}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
