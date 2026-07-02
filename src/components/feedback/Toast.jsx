import { useEffect, useState } from "react";
import { LuCircleCheck, LuCircleAlert, LuTriangleAlert, LuInfo, LuX } from "react-icons/lu";

const iconMap = {
  success: { icon: LuCircleCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  error: { icon: LuCircleAlert, color: "text-red-500", bg: "bg-red-50" },
  warning: { icon: LuTriangleAlert, color: "text-amber-500", bg: "bg-amber-50" },
  info: { icon: LuInfo, color: "text-blue-500", bg: "bg-blue-50" },
};

export default function Toast({
  message,
  variant = "success",
  duration = 3000,
  isVisible = false,
  onClose,
  className = "",
}) {
  const [show, setShow] = useState(isVisible);
  const style = iconMap[variant] || iconMap.success;
  const ToastIcon = style.icon;

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className={`
        fixed top-6 right-6 z-[110] flex items-center gap-3
        px-5 py-4 bg-white rounded-xl shadow-2xl border border-gray-100
        animate-[slideInRight_0.4s_ease-out]
        max-w-sm
        ${className}
      `}
    >
      <div className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
        <ToastIcon className={`w-5 h-5 ${style.color}`} />
      </div>
      <p className="text-sm font-medium text-gray-700 flex-1">{message}</p>
      {onClose && (
        <button
          onClick={() => {
            setShow(false);
            onClose();
          }}
          className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
        >
          <LuX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
