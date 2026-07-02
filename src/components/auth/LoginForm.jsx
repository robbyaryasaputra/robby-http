import { Link } from "react-router-dom";
import { LuMail, LuCircleAlert, LuLoader } from "react-icons/lu";
import PasswordInput from "./PasswordInput";
import Checkbox from "../form/Checkbox";
import Button from "../basic/Button";

export default function LoginForm({
  username,
  password,
  onChange,
  onSubmit,
  loading = false,
  error = "",
  forgotPasswordPath = "/auth/forgot-password",
  registerPath = "/auth/register",
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-xs font-medium text-red-200 bg-red-500/20 border border-red-500/30 rounded-xl animate-[fadeIn_0.3s_ease-out]">
          <LuCircleAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-medium text-amber-800">
          <LuLoader className="w-4 h-4 animate-spin text-[#8B5F3C]" />
          <span>Memproses login...</span>
        </div>
      )}

      {/* Email / Username */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email
        </label>
        <div className="relative">
          <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="login-username"
            name="username"
            type="email"
            required
            value={username}
            onChange={onChange}
            placeholder="you@example.com"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all duration-300"
          />
        </div>
      </div>

      {/* Password */}
      <PasswordInput
        id="login-password"
        name="password"
        label="Password"
        value={password}
        onChange={onChange}
        required
      />

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between">
        <Checkbox
          id="remember-me"
          label="Remember me"
        />
        <Link
          to={forgotPasswordPath}
          className="text-sm font-medium text-[#8B5F3C] hover:text-[#7A5232] transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        id="login-submit"
        type="submit"
        loading={loading}
        fullWidth
        rounded="xl"
      >
        Sign In
      </Button>

      {/* Register Link */}
      <div className="mt-6 text-center text-sm">
        <span className="text-slate-500">Belum punya akun? </span>
        <Link
          to={registerPath}
          className="font-semibold text-[#8B5F3C] hover:text-[#7A5232] transition-colors"
        >
          Daftar di sini
        </Link>
      </div>
    </form>
  );
}
