export default function ProgressBar({
  label = "Monthly Sales Target",
  value = 75,
  target = "100%",
  color = "bg-[#8B5F3C]",
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold mb-2">
        <span className="text-gray-500">{label}</span>
        <span className="text-[#2C1A0E]">{value}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          style={{ width: `${value}%` }}
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
        />
      </div>
      {target && (
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">
          <span>Current Progress</span>
          <span>Target: {target}</span>
        </div>
      )}
    </div>
  );
}
