import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuMenu,
  LuClipboardList,
  LuHeart,
  LuSettings,
  LuCoffee,
  LuRefreshCw,
  LuLogOut,
} from "react-icons/lu";
import NavItem from "../7-navigation/NavItem";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard },
  { path: "/dashboard/menu", label: "Menu", icon: LuMenu },
  { path: "/dashboard/orders", label: "Orders", icon: LuClipboardList },
  { path: "/dashboard/favorites", label: "Favorites", icon: LuHeart },
  { path: "/dashboard/settings", label: "Settings", icon: LuSettings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/auth/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-[#855C3B] flex flex-col fixed left-0 top-0 z-50 shadow-[10px_0_60px_rgba(34,20,14,0.12)]">
      {/* Logo */}
      <Link
        to="/dashboard"
        id="sidebar-logo"
        className="flex items-center gap-3 px-6 py-7"
      >
        <div className="w-11 h-11 rounded-3xl bg-[#5F3A27] flex items-center justify-center shadow-lg shadow-black/10">
          <LuCoffee className="w-5 h-5 text-white" />
        </div>
        <span className="text-[#FAF4EE] font-semibold text-lg tracking-wide">
          Coffee Shop
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-6 mt-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <NavItem
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="px-6 pb-6 space-y-3">
        <button
          id="sidebar-refresh"
          className="w-full h-11 rounded-3xl bg-[#7A503C] flex items-center justify-center text-[#F2E7DC] hover:bg-[#6d4734] transition-all duration-300"
        >
          <LuRefreshCw className="w-5 h-5" />
        </button>
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          className="w-full h-11 rounded-3xl bg-[#4B2C20] flex items-center justify-center text-[#F8EDE5] hover:bg-[#3f2419] transition-all duration-300 font-semibold text-sm"
        >
          <LuLogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}
