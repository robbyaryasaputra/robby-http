const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 lg:grid-cols-5",
};

const gapMap = {
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-6",
  xl: "gap-8",
};

export default function Grid({
  children,
  cols = 3,
  gap = "md",
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        grid
        ${colsMap[cols] || colsMap[3]}
        ${gapMap[gap] || gapMap.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
