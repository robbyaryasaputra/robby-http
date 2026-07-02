export default function TrendLine({
  title = "Sales Trend",
  data = [30, 45, 35, 60, 50, 75, 90],
  labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  height = 150,
  strokeColor = "#8B5F3C",
  className = "",
}) {
  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal;

  const width = 500;
  const padding = 20;
  
  // Calculate points
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
    return { x, y };
  });

  // Construct path coordinates
  const pathD = points.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ""
  );

  // Construct area coordinates for gradient fill
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
    : "";

  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-50 shadow-sm ${className}`}>
      {title && <h3 className="text-sm font-bold text-[#2C1A0E] mb-4">{title}</h3>}
      
      <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="trend-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area under the line */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#trend-area-grad)"
              className="transition-all duration-500 ease-in-out"
            />
          )}

          {/* Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="#ffffff"
                stroke={strokeColor}
                strokeWidth="2.5"
                className="transition-all duration-300 hover:r-6"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* X Axis Labels */}
      <div className="flex items-center justify-between mt-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {labels.map((lbl, idx) => (
          <span key={idx}>{lbl}</span>
        ))}
      </div>
    </div>
  );
}
