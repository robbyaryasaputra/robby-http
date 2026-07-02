export default function Thumbnail({
  src,
  alt = "",
  size = "md",
  rounded = "xl",
  className = "",
}) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={`
        relative shrink-0 overflow-hidden bg-gray-50 border border-gray-100
        ${sizeMap[size] || sizeMap.md}
        rounded-${rounded}
        ${className}
      `}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
