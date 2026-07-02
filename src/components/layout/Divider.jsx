export default function Divider({
  direction = "horizontal",
  label = "",
  color = "border-gray-100",
  spacing = "my-4",
  className = "",
}) {
  if (direction === "vertical") {
    return (
      <div className={`w-px bg-gray-200 self-stretch ${spacing} ${className}`} />
    );
  }

  if (label) {
    return (
      <div className={`flex items-center gap-4 ${spacing} ${className}`}>
        <div className={`flex-1 border-t ${color}`} />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        <div className={`flex-1 border-t ${color}`} />
      </div>
    );
  }

  return (
    <hr className={`border-t ${color} ${spacing} ${className}`} />
  );
}
