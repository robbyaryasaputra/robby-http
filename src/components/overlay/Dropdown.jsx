import { useState, useRef, useEffect } from "react";

export default function Dropdown({
  trigger,
  items = [],
  align = "right",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const alignment = {
    right: "right-0 origin-top-right",
    left: "left-0 origin-top-left",
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>

      {isOpen && (
        <div
          className={`
            absolute mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100/60 p-2 z-50
            focus:outline-none animate-[fadeIn_0.15s_ease-out]
            ${alignment[align]}
          `}
        >
          <div className="py-1" role="menu">
            {items.map((item, idx) => {
              if (item.divider) {
                return <div key={idx} className="my-1 border-t border-gray-100" />;
              }

              const Icon = item.icon;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-semibold
                    transition-all duration-200 cursor-pointer
                    ${item.danger 
                      ? "text-red-600 hover:bg-red-50" 
                      : "text-[#5F3A27] hover:bg-[#FAF6F0]"
                    }
                  `}
                  role="menuitem"
                >
                  {Icon && <Icon className={`w-4 h-4 ${item.danger ? "text-red-500" : "text-slate-400"}`} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
