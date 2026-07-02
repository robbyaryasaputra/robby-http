import { useState, useEffect } from "react";
import { SearchBar } from "../form";
import { CartButton } from "../action";
import { Avatar } from "../media";
import { Link } from "react-router-dom";
import { LuExternalLink, LuBell, LuCheckCheck } from "react-icons/lu";
import { supabase } from "../../lib/supabase";

export default function Header({ search, setSearch }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const stored = localStorage.getItem("user");
      const userObj = stored ? JSON.parse(stored) : null;
      
      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (userObj) {
        query = query.or(`user_id.is.null,user_id.eq.${userObj.id}`);
      } else {
        query = query.is("user_id", null);
      }

      const { data } = await query.limit(10);
      setNotifications(data || []);
    } catch (e) {
      console.error("Gagal memuat notifikasi:", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 12000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", unreadIds);

      if (!error) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      }
    } catch (e) {
      console.error("Gagal menandai semua dibaca:", e);
    }
  };

  const userName = user?.name || "Admin User";
  const userRole = user?.role || "admin";

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Search Bar */}
      <SearchBar
        id="header-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for coffee..."
      />

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-4 py-2 border border-[#855C3B]/25 text-[#855C3B] hover:bg-[#FAF4EE] rounded-full text-xs font-bold transition-all"
        >
          View Shop
          <LuExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                fetchNotifications();
              }
            }}
            className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-all cursor-pointer relative"
          >
            <LuBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#FAF6F0] to-white border-b border-slate-100">
                  <span className="text-sm font-bold text-slate-800">Notifikasi</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-[#855C3B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <LuCheckCheck className="w-3.5 h-3.5" /> Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">Tidak ada notifikasi baru</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 text-left transition-colors ${!n.is_read ? "bg-amber-50/20" : "hover:bg-slate-50"}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800">{n.title}</span>
                          {!n.is_read && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          {new Date(n.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <CartButton count={3} id="header-cart" />

        <div id="header-profile" className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">{userName}</p>
            <p className="text-[10px] text-[#855C3B] font-bold uppercase tracking-wider mt-1">{userRole}</p>
          </div>
          <Avatar name={userName} size="md" className="cursor-pointer hover:shadow-lg transition-shadow duration-300" />
        </div>
      </div>
    </header>
  );
}