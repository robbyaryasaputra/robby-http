import { LuCircleCheck, LuCircleAlert, LuTriangleAlert, LuInfo, LuX } from "react-icons/lu";

const variants = {
  success: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: LuCircleCheck,
    iconColor: "text-emerald-500",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    icon: LuCircleAlert,
    iconColor: "text-red-500",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: LuTriangleAlert,
    iconColor: "text-amber-500",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: LuInfo,
    iconColor: "text-blue-500",
  },
};

export default function Alert({
  children,
  variant = "info",
  title,
  dismissible = false,
  onDismiss,
  className = "",
}) {
  const style = variants[variant] || variants.info;
  const AlertIcon = style.icon;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border
        animate-[fadeIn_0.3s_ease-out]
        ${style.bg} ${className}
      `}
    >
      <AlertIcon className={`w-5 h-5 ${style.iconColor} shrink-0 mt-0.5`} />
      <div className={`flex-1 ${style.text}`}>
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={`${style.iconColor} hover:opacity-70 transition-opacity shrink-0`}
        >
          <LuX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
