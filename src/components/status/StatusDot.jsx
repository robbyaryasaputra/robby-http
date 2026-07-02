export default function StatusDot({ active = true, label = "", className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          active 
            ? "bg-emerald-500 shadow-sm shadow-emerald-500/30" 
            : "bg-gray-300"
        }`}
      />
      {label && <span className="text-xs font-semibold text-gray-500">{label}</span>}
    </div>
  );
}
