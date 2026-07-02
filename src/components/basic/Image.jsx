import { useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop";

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-[2rem]",
  full: "rounded-full",
};

export default function Image({
  src,
  alt = "",
  fallback = FALLBACK_IMAGE,
  rounded = "lg",
  aspectRatio = "auto",
  className = "",
  containerClassName = "",
  hoverZoom = false,
  overlay = false,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgSrc = error ? fallback : src;

  return (
    <div
      className={`overflow-hidden ${roundedMap[rounded] || roundedMap.lg} bg-slate-100 relative ${containerClassName}`}
      style={aspectRatio !== "auto" ? { aspectRatio } : undefined}
    >
      {/* Skeleton placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      <img
        src={imgSrc}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`
          w-full h-full object-cover transition-all duration-700
          ${loaded ? "opacity-100" : "opacity-0"}
          ${hoverZoom ? "group-hover:scale-105" : ""}
          ${className}
        `}
        {...props}
      />

      {/* Optional gradient overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      )}
    </div>
  );
}
