import { useEffect, useState } from "react";
import { PageHeader } from "../../components/section";
import db from "../../lib/db";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await db.getNotifications();
      setNotifications(data || []);
    })();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const markRead = async () => {
    if (selected.length === 0) return;
    await db.markNotificationsRead(selected);
    const { data } = await db.getNotifications();
    setNotifications(data || []);
    setSelected([]);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <PageHeader
        title="Notifications"
        subtitle="View and manage system notifications"
      />

      <div className="bg-white rounded-2xl p-4 border">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold">Notifications</div>
          <div>
            <button className="btn btn-primary" onClick={markRead}>
              Mark Selected Read
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded border ${n.is_read ? "bg-slate-50" : "bg-white"}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(n.id)}
                  onChange={() => toggleSelect(n.id)}
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {n.title || "Notification"}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{n.body}</div>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
