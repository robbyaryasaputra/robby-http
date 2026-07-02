export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  icon: Icon,
  error = "",
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full ${Icon ? "pl-11" : "pl-4"} pr-10 py-3
            bg-slate-50 border rounded-xl text-slate-900 text-sm
            appearance-none transition-all duration-300
            focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0]
            ${error ? "border-red-400" : "border-slate-200"}
            ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={typeof opt === "string" ? opt : opt.value}
              value={typeof opt === "string" ? opt : opt.value}
            >
              {typeof opt === "string" ? opt : opt.label}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
