export default function TabBar({
  tabs = [],
  activeTab = "",
  onTabChange,
  variant = "pill",
  className = "",
}) {
  if (variant === "underline") {
    return (
      <div className={`flex items-center gap-6 border-b border-gray-200 ${className}`}>
        {tabs.map((tab) => {
          const value = typeof tab === "string" ? tab : tab.value;
          const label = typeof tab === "string" ? tab : tab.label;
          const isActive = activeTab === value;

          return (
            <button
              key={value}
              onClick={() => onTabChange?.(value)}
              className={`
                pb-3 text-sm font-medium transition-all duration-300 relative
                ${isActive
                  ? "text-[#2C1A0E] border-b-2 border-amber-500"
                  : "text-gray-400 hover:text-gray-600"
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: pill variant
  return (
    <div className={`flex items-center gap-3 overflow-x-auto pb-2 ${className}`}>
      {tabs.map((tab) => {
        const value = typeof tab === "string" ? tab : tab.value;
        const label = typeof tab === "string" ? tab : tab.label;
        const isActive = activeTab === value;

        return (
          <button
            key={value}
            id={`tab-${value.toLowerCase()}`}
            onClick={() => onTabChange?.(value)}
            className={`
              px-5 py-2.5 rounded-full text-sm font-semibold
              transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer
              ${
                isActive
                  ? "bg-[#4E3423] text-white shadow-[0_15px_40px_rgba(78,52,35,0.12)]"
                  : "bg-white text-[#6B4A36] border border-[#E4D7C9] hover:border-[#C1A385] hover:bg-[#FBF6F0]"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
