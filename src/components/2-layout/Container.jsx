const maxWidthMap = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export default function Container({
  children,
  maxWidth = "xl",
  padding = true,
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        mx-auto w-full
        ${maxWidthMap[maxWidth] || maxWidthMap.xl}
        ${padding ? "px-4 sm:px-6 lg:px-8" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
