import { useEffect, useState } from "react";
import { PageHeader } from "../../components/section";
import db from "../../lib/db";

export default function AppSettings() {
  const [settings, setSettings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await db.getAppSettings();
      setSettings(data || []);
    })();
  }, []);

  const handleEdit = (item) => {
    setEditing(item.key);
    setValue(item.value || "");
  };

  const save = async (key) => {
    await db.updateAppSetting(key, value, "admin");
    const { data } = await db.getAppSettings();
    setSettings(data || []);
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <PageHeader
        title="App Settings"
        subtitle="Manage application-wide settings"
      />

      <div className="bg-white rounded-2xl p-6 border">
        <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-slate-600 pb-3 border-b mb-3">
          <div>Key</div>
          <div>Value</div>
          <div>Actions</div>
        </div>

        <div className="space-y-3">
          {settings.map((s) => (
            <div key={s.key} className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm">{s.key}</div>
              <div>
                {editing === s.key ? (
                  <input
                    className="w-full p-2 border rounded"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                ) : (
                  <div className="text-sm text-slate-500">{s.value}</div>
                )}
              </div>
              <div>
                {editing === s.key ? (
                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => save(s.key)}
                    >
                      Save
                    </button>
                    <button className="btn" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="btn" onClick={() => handleEdit(s)}>
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
