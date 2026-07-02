import { LuX } from "react-icons/lu";
import { useEffect } from "react";

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  size = "md",
  className = "",
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positions = {
    right: "right-0 inset-y-0 h-full animate-[slideInRight_0.3s_ease-out]",
    left: "left-0 inset-y-0 h-full animate-[slideInLeft_0.3s_ease-out]",
    bottom: "bottom-0 inset-x-0 w-full animate-[slideInUp_0.3s_ease-out]",
  };

  const sizes = {
    sm: "max-w-sm w-full",
    md: "max-w-md w-full",
    lg: "max-w-lg w-full",
    full: "max-w-full w-full",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#33251f]/40 backdrop-blur-xs transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]"
      />

      <div
        className={`
          absolute bg-white shadow-2xl flex flex-col transition-all duration-300
          ${positions[position]}
          ${position !== "bottom" ? sizes[size] : "h-[80vh]"}
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#2C1A0E]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
