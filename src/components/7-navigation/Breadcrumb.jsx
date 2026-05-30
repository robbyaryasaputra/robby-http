import { Link } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";

export default function Breadcrumb({
  items = [],
  className = "",
}) {
  return (
    <nav className={`flex items-center gap-1.5 text-sm ${className}`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <LuChevronRight className="w-3.5 h-3.5 text-gray-300" />
            )}
            {isLast || !item.to ? (
              <span className="font-medium text-[#2C1A0E]">{item.label}</span>
            ) : (
              <Link
                to={item.to}
                className="text-gray-400 hover:text-amber-600 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
