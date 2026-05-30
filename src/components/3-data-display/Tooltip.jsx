import { useState } from "react";

export default function Tooltip({
  children,
  content,
  position = "top",
  className = "",
}) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-xs font-medium text-white
            bg-[#2C1A0E] rounded-lg shadow-lg whitespace-nowrap
            animate-[fadeIn_0.15s_ease-out]
            ${positionClasses[position] || positionClasses.top}
          `}
        >
          {content}
          <div
            className={`
              absolute w-2 h-2 bg-[#2C1A0E] rotate-45
              ${position === "top" ? "top-full left-1/2 -translate-x-1/2 -mt-1" : ""}
              ${position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 -mb-1" : ""}
              ${position === "left" ? "left-full top-1/2 -translate-y-1/2 -ml-1" : ""}
              ${position === "right" ? "right-full top-1/2 -translate-y-1/2 -mr-1" : ""}
            `}
          />
        </div>
      )}
    </div>
  );
}
