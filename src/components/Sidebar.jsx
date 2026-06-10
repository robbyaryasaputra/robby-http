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
  LuLifeBuoy,
} from "react-icons/lu";
import { NavItem, NavGroup } from "./7-navigation";
import { IconButton } from "./13-action";
import { Divider } from "./2-layout";
import { CoffeeBeanIcon } from "./11-media";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard },
  { path: "/dashboard/menu", label: "Menu", icon: LuMenu },
  { path: "/dashboard/orders", label: "Orders", icon: LuClipboardList },
  { path: "/dashboard/favorites", label: "Favorites", icon: LuHeart },
  { path: "/dashboard/settings", label: "Settings", icon: LuSettings },
  { path: "/dashboard/help-center", label: "Help Center", icon: LuLifeBuoy },
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
        className="flex items-center gap-3 px-6 py-7 group"
      >
        <div className="w-11 h-11 rounded-3xl bg-[#5F3A27] flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-105 transition-transform duration-300">
          <CoffeeBeanIcon size="sm" color="#FAF4EE" />
        </div>
        <span className="text-[#FAF4EE] font-semibold text-lg tracking-wide">
          Coffee Shop
        </span>
      </Link>

      <Divider color="border-white/10" spacing="my-2" className="mx-6" />

      {/* Navigation */}
      <nav className="flex-1 px-6 mt-4">
        <NavGroup label="Main Menu">
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
        </NavGroup>
      </nav>

      {/* Bottom Section */}
      <div className="px-6 pb-6 space-y-3">
        <IconButton
          icon={LuRefreshCw}
          id="sidebar-refresh"
          variant="primary"
          className="w-full h-11 rounded-3xl !bg-[#7A503C] !text-[#F2E7DC] hover:!bg-[#6d4734]"
          title="Refresh"
        />
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          className="w-full h-11 rounded-3xl bg-[#4B2C20] flex items-center justify-center text-[#F8EDE5] hover:bg-[#3f2419] transition-all duration-300 font-semibold text-sm active:scale-[0.97]"
        >
          <LuLogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}
