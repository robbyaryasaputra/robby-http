export default function Avatar({
  src,
  name = "",
  size = "md",
  className = "",
}) {
  const sizeMap = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const getInitials = (n) => {
    if (!n) return "";
    const parts = n.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n[0]?.toUpperCase() || "";
  };

  return (
    <div
      className={`
        relative shrink-0 rounded-full overflow-hidden bg-[#FAF6F0] border border-[#E7D4B0]/40
        flex items-center justify-center font-bold text-[#8B5F3C] select-none
        ${sizeMap[size] || sizeMap.md}
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
