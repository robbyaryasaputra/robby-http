import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

export default function BackButton({
  to = "/",
  label = "Back to Dashboard",
  className = "",
}) {
  return (
    <Link
      to={to}
      id="back-btn"
      className={`
        inline-flex items-center gap-2 px-6 py-3
        bg-gradient-to-r from-amber-600 to-amber-800
        text-white rounded-full font-medium
        hover:shadow-lg hover:shadow-amber-200 transition-all duration-300
        ${className}
      `}
    >
      <LuArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  );
}
