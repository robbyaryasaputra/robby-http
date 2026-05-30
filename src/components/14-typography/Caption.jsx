export default function Caption({
  children,
  className = "",
  ...props
}) {
  return (
    <span
      className={`text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
