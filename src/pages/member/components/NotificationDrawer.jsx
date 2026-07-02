import { LuBell, LuX } from "react-icons/lu";

export default function NotificationDrawer({ isOpen, onClose, notifications }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white w-full max-w-sm h-full flex flex-col p-6 shadow-2xl animate-[slideLeft_0.3s_ease-out]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <LuBell className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-slate-800 text-base">Notifikasi Member</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center font-bold text-slate-400 hover:text-slate-700 cursor-pointer border-0 bg-transparent"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400 font-semibold">
              Tidak ada pemberitahuan baru
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`py-4 transition-colors text-left ${!n.is_read ? "bg-amber-50/10" : ""}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-slate-800">{n.title}</span>
                  {!n.is_read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                  {new Date(n.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  {new Date(n.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
