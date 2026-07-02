import { Link } from "react-router-dom";
import { LuMail, LuUser, LuCircleAlert, LuCircleCheck, LuLoader } from "react-icons/lu";
import PasswordInput from "./PasswordInput";
import Button from "../basic/Button";

export default function RegisterForm({
  name,
  email,
  password,
  confirmPassword,
  onChange,
  onSubmit,
  loading = false,
  error = "",
  successMessage = "",
  loginPath = "/auth/login",
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-xs font-medium text-red-200 bg-red-500/20 border border-red-500/30 rounded-xl animate-[fadeIn_0.3s_ease-out]">
          <LuCircleAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-3 mb-4 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
          <LuCircleCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-medium text-amber-800">
          <LuLoader className="w-4 h-4 animate-spin text-[#8B5F3C]" />
          <span>Memproses pendaftaran...</span>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nama Lengkap
        </label>
        <div className="relative">
          <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="register-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={onChange}
            placeholder="Masukkan nama lengkap"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all duration-300"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email
        </label>
        <div className="relative">
          <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="register-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={onChange}
            placeholder="you@example.com"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all duration-300"
          />
        </div>
      </div>

      {/* Password */}
      <PasswordInput
        id="register-password"
        name="password"
        label="Password"
        value={password}
        onChange={onChange}
        required
      />

      {/* Confirm Password */}
      <PasswordInput
        id="register-confirm-password"
        name="confirmPassword"
        label="Konfirmasi Password"
        value={confirmPassword}
        onChange={onChange}
        required
      />

      {/* Submit Button */}
      <Button
        id="register-submit"
        type="submit"
        loading={loading}
        fullWidth
        rounded="xl"
      >
        Daftar Akun
      </Button>

      <div className="mt-6 text-center text-sm">
        <span className="text-slate-500">Sudah punya akun? </span>
        <Link
          to={loginPath}
          className="font-semibold text-[#8B5F3C] hover:text-[#7A5232] transition-colors"
        >
          Masuk di sini
        </Link>
      </div>
    </form>
  );
}
