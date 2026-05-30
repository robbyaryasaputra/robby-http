export default function StatusBadge({ status = "Pending", className = "" }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-250/50 border-emerald-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200/60",
    Pending: "bg-blue-50 text-blue-700 border-blue-200/60",
    Cancelled: "bg-red-50 text-red-700 border-red-200/60",
    Delivered: "bg-purple-50 text-purple-700 border-purple-200/60",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
        ${styles[status] || "bg-gray-50 text-gray-700 border-gray-200"}
        ${className}
      `}
    >
      {status}
    </span>
  );
}
