import { useState, useRef, useEffect } from "react";

export default function Popover({
  trigger,
  children,
  position = "bottom-right",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const positionClasses = {
    "bottom-right": "right-0 top-full mt-2 origin-top-right",
    "bottom-left": "left-0 top-full mt-2 origin-top-left",
    "top-right": "right-0 bottom-full mb-2 origin-bottom-right",
    "top-left": "left-0 bottom-full mb-2 origin-bottom-left",
  };

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 rounded-2xl bg-white shadow-xl border border-gray-100/60 p-4
            focus:outline-none animate-[fadeIn_0.15s_ease-out]
            ${positionClasses[position]}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}
