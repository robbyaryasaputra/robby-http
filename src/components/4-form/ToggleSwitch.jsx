export default function ToggleSwitch({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = "",
}) {
  return (
    <label
      htmlFor={id}
      className={`
        flex items-center justify-between gap-3 cursor-pointer select-none
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {label && (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      )}
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors duration-300
            peer-checked:bg-amber-500 bg-gray-300
          `}
        />
        <div
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
            shadow-md transition-transform duration-300
            peer-checked:translate-x-5
          `}
        />
      </div>
    </label>
  );
}
