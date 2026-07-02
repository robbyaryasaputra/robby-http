export default function ImageCard({
  src,
  alt = "",
  title,
  subtitle,
  children,
  onClick,
  className = "",
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm
        hover:shadow-md transition-all duration-300 group cursor-pointer ${className}
      `}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        {title && <h4 className="font-bold text-[#2C1A0E] text-base truncate">{title}</h4>}
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
