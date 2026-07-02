export default function PaymentBadge({ method = "Cash", className = "" }) {
  const getBadgeStyle = (m) => {
    switch (m) {
      case "Cash":
        return "bg-green-50 text-green-600 border-green-200";
      case "Card":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "E-Wallet":
        return "bg-purple-50 text-purple-600 border-purple-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(method)} ${className}`}
    >
      {method}
    </span>
  );
}
