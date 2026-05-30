const badgeStyles = {
  popular: "bg-blue-100 text-blue-700",
  "best-seller": "bg-rose-100 text-rose-700",
  featured: "bg-purple-100 text-purple-700",
  new: "bg-emerald-100 text-emerald-700",
  premium: "bg-amber-100 text-amber-700",
  hot: "bg-orange-100 text-orange-700",
  iced: "bg-cyan-100 text-cyan-700",
  special: "bg-indigo-100 text-indigo-700",
  default: "bg-gray-100 text-gray-700",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-[11px]",
  lg: "px-4 py-1.5 text-xs",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  const key = variant.toLowerCase().replace(/\s+/g, "-");
  const style = badgeStyles[key] || badgeStyles.default;

  return (
    <span
      className={`
        inline-block rounded-full font-semibold uppercase tracking-[0.18em]
        ${style}
        ${sizeMap[size] || sizeMap.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
