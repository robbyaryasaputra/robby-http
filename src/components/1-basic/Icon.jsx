const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

export default function Icon({
  icon: IconComponent,
  size = "md",
  color = "currentColor",
  className = "",
  ...props
}) {
  if (!IconComponent) return null;

  return (
    <IconComponent
      className={`${iconSizes[size] || iconSizes.md} ${className}`}
      style={{ color }}
      {...props}
    />
  );
}
