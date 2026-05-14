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
    <aside className="w-50 min-h-screen bg-[#1E1210] flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <Link
        to="/dashboard"
        id="sidebar-logo"
        className="flex items-center gap-3 px-5 py-6 group"
      >
        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-amber-600 to-amber-800 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-amber-900/30 transition-all duration-300">
          <LuCoffee className="w-5 h-5 text-white" />
        </div>
        <span className="text-[#E8D5C4] font-semibold text-base tracking-wide">
          Coffee Shop
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  id={`nav-${item.label.toLowerCase()}`}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-[#C4956A] text-white shadow-md shadow-[#C4956A]/25"
                      : "text-[#B8A598] hover:bg-[#2C1E18] hover:text-[#E8D5C4]"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-6 space-y-2">
        <button
          id="sidebar-refresh"
          className="w-full h-9 rounded-lg bg-[#2C1E18] flex items-center justify-center text-[#B8A598] hover:text-[#E8D5C4] hover:bg-[#3D2A20] transition-all duration-300"
        >
          <LuRefreshCw className="w-4 h-4" />
        </button>
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          className="w-full h-9 rounded-lg bg-red-900/20 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/40 transition-all duration-300 font-medium text-sm"
        >
          <LuLogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}
