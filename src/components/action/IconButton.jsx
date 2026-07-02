export default function IconButton({
  icon: Icon,
  onClick,
  variant = "ghost",
  size = "md",
  disabled = false,
  className = "",
  title = "",
  ...props
}) {
  const variants = {
    primary: "bg-[#8B5F3C] text-white hover:bg-[#7A5232] shadow-md shadow-[#8B5F3C]/10",
    secondary: "bg-[#F5EDE3] text-[#5F3A27] hover:bg-[#EDE2D4]",
    outline: "border border-gray-200 text-gray-500 hover:text-[#8B5F3C] hover:border-[#8B5F3C] hover:bg-[#FAF6F0]/50",
    ghost: "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
    danger: "text-red-500 hover:text-red-600 hover:bg-red-50",
  };

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        inline-flex items-center justify-center rounded-full transition-all duration-300
        active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none
        ${variants[variant] || variants.ghost}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      <Icon className="w-[45%] h-[45%]" />
    </button>
  );
}
