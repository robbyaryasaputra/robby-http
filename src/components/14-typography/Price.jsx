export default function Price({
  value,
  currency = "$",
  size = "md",
  className = "",
}) {
  const numValue = typeof value === "number" ? value : parseFloat(value) || 0;
  const parts = numValue.toFixed(2).split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
  };

  return (
    <span className={`inline-flex items-baseline font-bold text-[#8B5F3C] ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="text-[0.8em] font-medium mr-0.5 opacity-80">{currency}</span>
      <span>{integerPart}</span>
      <span className="text-[0.75em] font-semibold">.{decimalPart}</span>
    </span>
  );
}
