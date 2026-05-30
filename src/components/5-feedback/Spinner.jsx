const sizeMap = {
  sm: "w-6 h-6 border-2",
  md: "w-10 h-10 border-3",
  lg: "w-14 h-14 border-4",
};

export default function Spinner({
  size = "md",
  color = "border-amber-500",
  label = "",
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          ${sizeMap[size] || sizeMap.md}
          ${color} border-t-transparent
          rounded-full animate-spin
        `}
      />
      {label && (
        <p className="text-amber-600 text-sm font-medium">{label}</p>
      )}
    </div>
  );
}
