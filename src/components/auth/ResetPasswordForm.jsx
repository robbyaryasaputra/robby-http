import { Link } from "react-router-dom";
import { LuArrowLeft, LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import PasswordInput from "./PasswordInput";
import Button from "../basic/Button";

export default function ResetPasswordForm({
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
        <div className="flex items-center gap-2 p-3 mb-4 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
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

      <PasswordInput
        id="reset-password"
        name="password"
        label="New Password"
        value={password}
        onChange={onChange}
        required
      />

      <PasswordInput
        id="reset-confirm-password"
        name="confirmPassword"
        label="confirmPassword"
        value={confirmPassword}
        onChange={onChange}
        required
      />

      <Button
        type="submit"
        loading={loading}
        fullWidth
        rounded="xl"
      >
        Reset Password
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
