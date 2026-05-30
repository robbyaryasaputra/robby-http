export default function DonutChart({
  title = "Order Distribution",
  data = [
    { label: "Espresso-Based", value: 55, color: "#8B5F3C" },
    { label: "Non-Coffee", value: 30, color: "#BF834F" },
    { label: "Pastries & Food", value: 15, color: "#E7D4B0" },
  ],
  className = "",
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 35;
  const circumference = 2 * Math.PI * radius; // ~219.91
  
  let accumulatedPercent = 0;

  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-50 shadow-sm ${className}`}>
      {title && <h3 className="text-sm font-bold text-[#2C1A0E] mb-6">{title}</h3>}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#F3F4F6"
              strokeWidth="12"
            />
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const strokeLength = (percentage / 100) * circumference;
              const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
              accumulatedPercent += percentage;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="12"
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-[#2C1A0E]">{total}</span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3.5 w-full">
          {data.map((item, idx) => {
            const percentage = ((item.value / total) * 100).toFixed(0);
            return (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600 font-medium">{item.label}</span>
                </div>
                <span className="font-bold text-[#2C1A0E]">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
