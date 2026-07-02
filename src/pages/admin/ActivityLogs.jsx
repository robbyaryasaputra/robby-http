import { useEffect, useState } from "react";
import { PageHeader } from "../../components/section";
import db from "../../lib/db";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await db.getActivityLogs({ limit: 200 });
      setLogs(data || []);
    })();
  }, []);

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <PageHeader
        title="Activity Logs"
        subtitle="Audit trail and system events"
      />

      <div className="bg-white rounded-2xl p-4 border">
        <div className="text-sm text-slate-600 font-semibold mb-3">
          Recent Activity
        </div>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {logs.map((l) => (
            <div
              key={l.id}
              className="p-3 rounded border bg-slate-50 flex justify-between items-start"
            >
              <div>
                <div className="text-sm font-medium">{l.action}</div>
                <div className="text-xs text-slate-500">{l.description}</div>
              </div>
              <div className="text-xs text-slate-400">
                {new Date(l.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
