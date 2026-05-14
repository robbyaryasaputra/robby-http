export default function Settings() {
  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-[#2C1A0E]">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage app preferences, theme options, and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[#2C1A0E]">General</h2>
          <p className="text-sm text-gray-500 mt-2">
            Configure basic app settings and administrative preferences.
          </p>
          <div className="mt-5 space-y-4 text-sm text-gray-600">
            <div className="rounded-2xl bg-gray-50 p-4">Theme: Dark Mode</div>
            <div className="rounded-2xl bg-gray-50 p-4">
              Notifications: Enabled
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              Language: Indonesian
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[#2C1A0E]">Security</h2>
          <p className="text-sm text-gray-500 mt-2">
            Update password and access controls for your admin account.
          </p>
          <div className="mt-5 space-y-4 text-sm text-gray-600">
            <div className="rounded-2xl bg-gray-50 p-4">
              Password: Updated 3 days ago
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">2FA: Disabled</div>
            <div className="rounded-2xl bg-gray-50 p-4">
              Session timeout: 30 min
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
