export default function Card({
  children,
  hover = true,
  rounded = "2xl",
  padding = "p-5",
  className = "",
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-${rounded} ${padding} shadow-sm border border-gray-50
        transition-all duration-300
        ${hover ? "hover:shadow-md" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
