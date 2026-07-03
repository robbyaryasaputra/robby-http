import { useEffect, useState, useCallback } from "react";
import {
  LuBell,
  LuX,
  LuAward,
  LuShoppingBag,
  LuCoins,
  LuCheckCheck,
  LuInbox,
  LuLoader,
} from "react-icons/lu";
import { supabase } from "../../../lib/supabase";

// Icon map per notification type
const NotifIcon = ({ type }) => {
  const base = "w-4 h-4";
  if (type === "tier_upgrade")
    return <LuAward className={`${base} text-amber-500`} />;
  if (type === "order_completed")
    return <LuShoppingBag className={`${base} text-emerald-500`} />;
  if (type === "points_earned")
    return <LuCoins className={`${base} text-yellow-500`} />;
  return <LuBell className={`${base} text-slate-400`} />;
};

// Color accent per type
const notifColor = (type) => {
  if (type === "tier_upgrade") return "border-l-amber-500 bg-amber-50/60";
  if (type === "order_completed") return "border-l-emerald-500 bg-emerald-50/60";
  if (type === "points_earned") return "border-l-yellow-400 bg-yellow-50/60";
  return "border-l-slate-300 bg-slate-50/60";
};

export default function NotificationDrawer({ userId, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30);

      if (!error && data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Mark single notification as read
  const markAsRead = async (notifId) => {
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notifId);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Load on open
  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications();
    }
  }, [isOpen, userId, fetchNotifications]);

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} jam lalu`;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <LuBell className="w-4 h-4 text-[#855C3B]" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-sm">Notifikasi</h2>
              {unreadCount > 0 && (
                <p className="text-[10px] text-slate-400 font-medium">
                  {unreadCount} belum dibaca
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-[#855C3B] hover:text-[#4B2C20] transition-colors flex items-center gap-1 border-0 bg-transparent cursor-pointer"
              >
                <LuCheckCheck className="w-3.5 h-3.5" />
                Tandai Semua
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors border-0 cursor-pointer"
            >
              <LuX className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <LuLoader className="w-6 h-6 animate-spin text-slate-300" />
              <p className="text-xs text-slate-400 font-medium">Memuat notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-8">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center">
                <LuInbox className="w-7 h-7 text-slate-200" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400">Belum ada notifikasi</p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Notifikasi kenaikan tier dan poin akan muncul di sini.
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`flex gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50/80 transition-colors border-l-4 ${notifColor(
                    notif.type
                  )} ${!notif.is_read ? "bg-white" : "opacity-70"}`}
                  onClick={() => {
                    if (!notif.is_read) markAsRead(notif.id);
                  }}
                >
                  {/* Icon bubble */}
                  <div className="w-9 h-9 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <NotifIcon type={notif.type} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className={`text-xs leading-snug ${
                        !notif.is_read
                          ? "font-bold text-slate-800"
                          : "font-medium text-slate-600"
                      }`}
                    >
                      {notif.title || notif.message}
                    </p>
                    {notif.title && notif.message && (
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-300 font-medium mt-1.5">
                      {formatTime(notif.created_at)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notif.is_read && (
                    <div className="w-2 h-2 rounded-full bg-[#855C3B] shrink-0 mt-2" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 shrink-0">
            <p className="text-[10px] text-center text-slate-300 font-medium">
              Menampilkan {notifications.length} notifikasi terbaru
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// Export unread count hook helper
export function useUnreadNotifCount(userId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetch = async () => {
      const { count: c } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      setCount(c || 0);
    };

    fetch();

    const channel = supabase
      .channel(`notif_count:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => fetch()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  return count;
}
