export default function Label({
  htmlFor,
  children,
  required = false,
  className = "",
  ...props
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}
