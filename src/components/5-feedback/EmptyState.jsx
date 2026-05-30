export default function EmptyState({
  icon: Icon,
  title = "No Data Found",
  description = "",
  action,
  className = "",
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-24
        bg-gradient-to-b from-amber-50 via-gray-50 to-gray-50
        rounded-3xl border-2 border-dashed border-amber-200
        ${className}
      `}
    >
      {Icon && (
        <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-lg shadow-amber-200/50">
          <Icon className="w-12 h-12 text-amber-700" />
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      {description && (
        <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
