export default function MiniChart({
  data = [12, 19, 14, 15, 22, 28, 24],
  trend = "up",
  height = 40,
  width = 100,
  className = "",
}) {
  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - 2 - ((val - minVal) / range) * (height - 4);
    return { x, y };
  });

  const pathD = points.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ""
  );

  const strokeColor = trend === "up" ? "#10B981" : "#EF4444";

  return (
    <div className={`overflow-hidden ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
}
