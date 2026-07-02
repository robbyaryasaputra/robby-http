export default function BarChart({
  title = "Weekly Sales",
  data = [
    { label: "Mon", value: 45 },
    { label: "Tue", value: 65 },
    { label: "Wed", value: 50 },
    { label: "Thu", value: 85 },
    { label: "Fri", value: 70 },
    { label: "Sat", value: 95 },
    { label: "Sun", value: 60 },
  ],
  maxVal = 100,
  className = "",
}) {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-50 shadow-sm ${className}`}>
      {title && <h3 className="text-sm font-bold text-[#2C1A0E] mb-6">{title}</h3>}
      <div className="flex items-end justify-between h-48 pt-4">
        {data.map((item, idx) => {
          const heightPct = Math.min((item.value / maxVal) * 100, 100);
          return (
            <div key={idx} className="flex flex-col items-center flex-1 group">
              <div className="relative w-full flex items-end justify-center h-full">
                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 bg-[#33251f] text-white text-[10px] font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-sm whitespace-nowrap z-10">
                  {item.value} sold
                </span>
                {/* Bar */}
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-8 bg-gradient-to-t from-[#8B5F3C] to-[#C4A88A] rounded-t-lg group-hover:from-[#7A5232] group-hover:to-[#B4987A] transition-all duration-500 shadow-sm group-hover:shadow-md"
                />
              </div>
              <span className="text-[10px] font-semibold text-gray-400 mt-2.5 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
