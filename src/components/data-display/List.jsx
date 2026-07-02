export default function List({
  items = [],
  renderItem,
  numbered = false,
  gap = "space-y-4",
  className = "",
}) {
  return (
    <div className={`${gap} ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          {numbered && (
            <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
          )}
          <div className="flex-1 min-w-0">
            {renderItem ? renderItem(item, i) : (
              <p className="text-sm font-medium text-gray-700 truncate">
                {String(item)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
