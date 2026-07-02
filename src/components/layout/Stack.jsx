const gapMap = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export default function Stack({
  children,
  direction = "vertical",
  gap = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
  className = "",
  ...props
}) {
  const alignMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const justifyMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  return (
    <div
      className={`
        flex
        ${direction === "horizontal" ? "flex-row" : "flex-col"}
        ${gapMap[gap] || gapMap.md}
        ${alignMap[align] || alignMap.stretch}
        ${justifyMap[justify] || justifyMap.start}
        ${wrap ? "flex-wrap" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
