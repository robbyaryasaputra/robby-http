export default function PageHeader({
  title,
  subtitle,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
    >
      <div>
        <h1 className="text-2xl font-bold text-[#2C1A0E]">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}
