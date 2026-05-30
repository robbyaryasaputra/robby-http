import StatCard from "../3-data-display/StatCard";

export default function StatsSection({
  stats = [],
  cols = 4,
  className = "",
}) {
  const colsMap = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${colsMap[cols] || colsMap[4]} gap-5 ${className}`}>
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          gradientColor={stat.color}
        />
      ))}
    </div>
  );
}
