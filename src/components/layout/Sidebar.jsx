import { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
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
  LuUsers,
  LuAward,
  LuTag,
  LuCreditCard,
  LuLifeBuoy,
  LuZap,
} from "react-icons/lu";
import NavItem from "../navigation/NavItem";

// Menggabungkan semua menu dari versi sebelumnya
const allNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard, roles: ["admin", "cashier"] },
  { path: "/dashboard/menu", label: "Menu", icon: LuMenu, roles: ["admin", "cashier"] },
  { path: "/dashboard/orders", label: "Orders", icon: LuClipboardList, roles: ["admin", "cashier"] },
  { path: "/dashboard/users", label: "Users", icon: LuUsers, roles: ["admin"] },
  { path: "/dashboard/members", label: "Members", icon: LuAward, roles: ["admin"] },
  { path: "/dashboard/favorites", label: "Favorites", icon: LuHeart, roles: ["admin"] },
  { path: "/dashboard/promotions", label: "Promotions", icon: LuTag, roles: ["admin"] },
  { path: "/dashboard/payments", label: "Payments", icon: LuCreditCard, roles: ["admin", "cashier"] },
  { path: "/dashboard/app-settings", label: "App Settings", icon: LuSettings, roles: ["admin"] },
  { path: "/dashboard/activity-logs", label: "Activity Logs", icon: LuRefreshCw, roles: ["admin"] },
  { path: "/dashboard/settings", label: "Settings", icon: LuSettings, roles: ["admin"] },
  { path: "/dashboard/react-hooks", label: "React Hooks", icon: LuZap, roles: ["admin"] },
  { path: "/dashboard/help-center", label: "Help Center", icon: LuLifeBuoy, roles: ["admin", "cashier"] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  
  // State untuk mengatur buka/tutup sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter nav items based on user role
  const navItems = useMemo(() => {
    const role = profile?.role || "admin";
    return allNavItems.filter((item) => item.roles.includes(role));
  }, [profile?.role]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex flex-col h-screen bg-[#855C3B] shadow-[10px_0_60px_rgba(34,20,14,0.12)] transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-24" : "w-72"
      }`}
    >
      {/* Bagian Header (Logo & Toggle) */}
      <div className="flex items-center justify-between px-6 py-7 shrink-0">
        <Link
          to="/dashboard"
          id="sidebar-logo"
          className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
            isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
          }`}
        >
          <div className="w-11 h-11 rounded-3xl bg-[#5F3A27] flex items-center justify-center shadow-lg shadow-black/10 shrink-0">
            <LuCoffee className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#FAF4EE] font-semibold text-lg tracking-wide whitespace-nowrap">
            Coffee Shop
          </span>
        </Link>

        {/* Tombol Toggle Buka/Tutup */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-xl text-white hover:bg-[#7A503C] transition-colors ${
            isCollapsed ? "mx-auto" : ""
          }`}
          title={isCollapsed ? "Buka Menu" : "Tutup Menu"}
        >
          <LuMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Bagian Navigasi (Bisa di-scroll) */}
      {/* Menggunakan scrollbar kustom agar tetap terlihat rapi dan elegan */}
      <nav className="flex-1 px-4 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#5F3A27] [&::-webkit-scrollbar-thumb]:rounded-full">
        <ul className="space-y-2 pb-4">
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
                  // Sembunyikan label saat ditutup agar icon tetap berada di tengah
                  label={isCollapsed ? "" : item.label}
                  isActive={isActive}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bagian Bawah (Refresh & Logout) */}
      <div className="px-4 pb-6 pt-4 space-y-3 shrink-0 bg-[#855C3B] shadow-[0_-10px_20px_rgba(133,92,59,1)]">
        <button
          id="sidebar-refresh"
          className="w-full h-11 rounded-2xl bg-[#7A503C] flex items-center justify-center text-[#F2E7DC] hover:bg-[#6d4734] transition-all duration-300"
          title="Refresh"
        >
          <LuRefreshCw className="w-5 h-5" />
        </button>
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          className={`w-full h-11 rounded-2xl bg-[#4B2C20] flex items-center justify-center text-[#F8EDE5] hover:bg-[#3f2419] transition-all duration-300 font-semibold text-sm ${
            isCollapsed ? "px-0" : "px-4"
          }`}
          title="Logout"
        >
          <LuLogOut className={`w-5 h-5 ${isCollapsed ? "mr-0" : "mr-2"}`} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}