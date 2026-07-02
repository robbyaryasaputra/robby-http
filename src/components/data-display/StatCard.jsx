import { LuArrowUpRight, LuArrowDownRight } from "react-icons/lu";

export default function StatCard({
  label,
  value,
  change,
  trend = "up",
  icon: Icon,
  gradientColor = "from-amber-500 to-amber-700",
  className = "",
  children,
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50 group ${className}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-sm`}
        >
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
        {change && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
              trend === "up"
                ? "text-emerald-600 bg-emerald-50"
                : "text-red-500 bg-red-50"
            }`}
          >
            {trend === "up" ? (
              <LuArrowUpRight className="w-3 h-3" />
            ) : (
              <LuArrowDownRight className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-[#2C1A0E]">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{label}</p>
      </div>
      {children}
    </div>
  );
}
