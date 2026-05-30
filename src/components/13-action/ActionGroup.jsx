export default function ActionGroup({
  children,
  align = "left",
  gap = "gap-2.5",
  className = "",
}) {
  const alignment = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  return (
    <div className={`flex items-center ${alignment[align]} ${gap} ${className}`}>
      {children}
    </div>
  );
}
