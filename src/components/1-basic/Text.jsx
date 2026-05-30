const weightMap = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const sizeMap = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const colorMap = {
  primary: "text-[#2C1A0E]",
  secondary: "text-[#6B4A36]",
  muted: "text-gray-400",
  light: "text-gray-500",
  white: "text-white",
  amber: "text-amber-600",
  danger: "text-red-500",
};

export default function Text({
  children,
  as: Tag = "span",
  size = "md",
  weight = "normal",
  color = "primary",
  className = "",
  ...props
}) {
  return (
    <Tag
      className={`
        ${sizeMap[size] || sizeMap.md}
        ${weightMap[weight] || weightMap.normal}
        ${colorMap[color] || colorMap.primary}
        ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  );
}
