import { useState, useEffect, useRef } from "react";

export default function ContextMenu({
  items = [],
  children,
  className = "",
}) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  };

  useEffect(() => {
    const handleClick = () => setVisible(false);
    const handleScroll = () => setVisible(false);

    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div onContextMenu={handleContextMenu} className={className}>
      {children}

      {visible && (
        <div
          ref={menuRef}
          style={{ top: `${position.y}px`, left: `${position.x}px` }}
          className="fixed z-50 min-w-[160px] bg-white rounded-xl shadow-xl border border-gray-100/80 p-1.5 animate-[fadeIn_0.1s_ease-out]"
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="my-1 border-t border-gray-100" />;
            }

            const Icon = item.icon;

            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick?.();
                  setVisible(false);
                }}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold
                  transition-all duration-150 cursor-pointer
                  ${item.danger 
                    ? "text-red-650 hover:bg-red-50 text-red-600" 
                    : "text-[#5F3A27] hover:bg-[#FAF6F0]"
                  }
                `}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${item.danger ? "text-red-500" : "text-slate-400"}`} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
