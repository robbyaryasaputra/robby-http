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
  const padding = 28; // Increased padding for labels
  
  // Calculate points
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - minVal) / range) * (height - padding * 2.5);
    return { x, y };
  });

  // Construct smooth cubic bezier path coordinates
  const linePath = (pts) => {
    if (pts.length === 0) return "";
    return pts.reduce((acc, pt, idx, arr) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[idx - 1];
      const cpX1 = prev.x + (pt.x - prev.x) / 3;
      const cpY1 = prev.y;
      const cpX2 = prev.x + 2 * (pt.x - prev.x) / 3;
      const cpY2 = pt.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
    }, "");
  };

  const pathD = linePath(points);

  // Construct area coordinates for gradient fill
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
    : "";

  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-50 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-base font-bold text-[#2C1A0E] mb-4" style={{ fontFamily: "'Georgia', serif" }}>
          {title}
        </h3>
      )}
      
      <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="trend-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={strokeColor} floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.5, 0.8].map((ratio, index) => {
            const y = padding + ratio * (height - padding * 2);
            return (
              <line
                key={index}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#F3EDE6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

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
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-shadow)"
            />
          )}

          {/* Data Points & Value Labels */}
          {points.map((pt, idx) => {
            const val = data[idx];
            const formattedVal = val >= 1000 
              ? `$ ${(val / 1000).toFixed(1)}K` 
              : `$ ${val % 1 === 0 ? val : val.toFixed(2)}`;
            
            return (
              <g key={idx} className="group cursor-pointer">
                {/* Value label text */}
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  className="text-[9px] font-extrabold fill-[#5F3A27] transition-all duration-200 group-hover:fill-[#f5c842]"
                >
                  {formattedVal}
                </text>
                
                {/* Outer pulsing hover circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="8"
                  fill={strokeColor}
                  fillOpacity="0"
                  className="transition-all duration-300 group-hover:fill-opacity-15"
                />

                {/* Main circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#ffffff"
                  stroke={strokeColor}
                  strokeWidth="3"
                  className="transition-all duration-300 group-hover:r-6 group-hover:stroke-[#f5c842] shadow-sm"
                />
              </g>
            );
          })}
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
