import { useState } from "react";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";

export default function PasswordInput({
  id,
  name,
  label = "Password",
  placeholder = "••••••••",
  value,
  onChange,
  error = "",
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

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
        <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full pl-11 pr-12 py-3
            bg-slate-50 border rounded-xl text-slate-900 text-sm
            placeholder-slate-400 transition-all duration-300
            focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0]
            ${error ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-slate-200"}
            ${disabled ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus:outline-none"
        >
          {showPassword ? (
            <LuEyeOff className="w-4 h-4" />
          ) : (
            <LuEye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
