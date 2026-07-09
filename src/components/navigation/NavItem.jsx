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
            ? "bg-[#8b6f47] text-white shadow-lg shadow-[#0000001a]"
            : "text-[#ede8e1] hover:bg-[#3d2311]/40 hover:text-white"
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
