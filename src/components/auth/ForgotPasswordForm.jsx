import { Link } from "react-router-dom";
import { LuMail, LuArrowLeft, LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import Button from "../basic/Button";

export default function ForgotPasswordForm({
  email,
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
        <div className="flex items-center gap-2 p-3 mb-4 text-xs font-medium text-red-700 bg-red-550/10 border border-red-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
          <LuCircleAlert className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-3 mb-4 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
          <LuCircleCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="forgot-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={onChange}
            placeholder="admin@coffeeshop.com"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all duration-300"
          />
        </div>
      </div>

      <Button
        type="submit"
        loading={loading}
        fullWidth
        rounded="xl"
      >
        Send Reset Link
      </Button>

      <div className="mt-6 text-center text-sm">
        <Link
          to={loginPath}
          className="inline-flex items-center gap-2 text-[#8B5F3C] font-semibold hover:text-[#7A5232] transition-colors"
        >
          <LuArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    </form>
  );
}
