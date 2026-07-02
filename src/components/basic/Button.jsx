import { LuLoader } from "react-icons/lu";

const variants = {
  primary:
    "bg-[#8B5F3C] text-white hover:bg-[#7A5232] shadow-lg shadow-[#8B5F3C]/20",
  secondary:
    "bg-[#F5EDE3] text-[#5F3A27] hover:bg-[#EDE2D4] border border-[#E4D7C9]",
  outline:
    "bg-transparent text-[#8B5F3C] border-2 border-[#8B5F3C] hover:bg-[#8B5F3C] hover:text-white",
  ghost:
    "bg-transparent text-[#6B4A36] hover:bg-[#F5EDE3]",
  danger:
    "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  fullWidth = false,
  rounded = "full",
  className = "",
  disabled = false,
  ...props
}) {
  const roundedClass = rounded === "full" ? "rounded-full" : `rounded-${rounded}`;

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-300 cursor-pointer active:scale-[0.97]
        ${roundedClass}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <LuLoader className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="w-4 h-4" />}
    </button>
  );
}
