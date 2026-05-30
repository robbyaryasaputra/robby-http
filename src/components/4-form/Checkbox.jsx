export default function Checkbox({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <label
      htmlFor={id}
      className={`
        flex items-center gap-2.5 cursor-pointer text-sm text-slate-600
        select-none transition-colors hover:text-slate-900
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 rounded border-slate-300 bg-slate-50 accent-amber-500 cursor-pointer"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
