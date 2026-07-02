import { Link } from "react-router-dom";

export default function NavItem({
  to,
  icon: Icon,
  label,
  isActive = false,
  id,
  className = "",
  ...props
}) {
  return (
    <Link
      to={to}
      id={id || `nav-${label?.toLowerCase()}`}
      className={`
        flex items-center gap-4 px-5 py-3 rounded-3xl text-sm font-semibold
        transition-all duration-300
        ${
          isActive
            ? "bg-[#D1876A] text-white shadow-lg shadow-[#0000001a]"
            : "text-[#E9D7C7] hover:bg-[#7b4f31] hover:text-white"
        }
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{label}</span>
    </Link>
  );
}
