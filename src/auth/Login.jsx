import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuCoffee, LuMail, LuLock, LuEye, LuEyeOff, LuLoader, LuCircleAlert } from "react-icons/lu";
import axios from "axios";

export default function Login() {
  const [dataForm, setDataForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      // Logika: Jika mengandung '@', gunakan API reqres.in (Live API)
      // Jika tidak mengandung '@', kita anggap sebagai Username (Mock Login)
      if (dataForm.username.includes("@")) {
        response = await axios.post("https://reqres.in/api/login", {
          email: dataForm.username,
          password: dataForm.password,
        });
      } else {
        // Mock Login: Beri delay sedikit agar terlihat seperti memproses
        await new Promise((resolve) => setTimeout(resolve, 1000));
        response = { data: { token: "mock-token-for-development" } };
      }

      if (response.data.token) {
        console.log("Login Success:", response.data);
        // Berpindah ke halaman Dashboard setelah login sukses
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login gagal. Silakan periksa kembali email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  const errorInfo = error && (
    <div className="flex items-center gap-2 p-3 mb-4 text-xs font-medium text-red-200 bg-red-500/20 border border-red-500/30 rounded-xl animate-in fade-in slide-in-from-top-1">
      <LuCircleAlert className="w-4 h-4 text-red-400 shrink-0" />
      <span>{error}</span>
    </div>
  );

  const loadingInfo = loading && (
    <div className="flex items-center justify-center gap-2 mb-4 text-xs font-medium text-amber-200/80">
      <LuLoader className="w-4 h-4 animate-spin" />
      <span>Memproses login...</span>
    </div>
  );

  return (
    <div className="animate-[fadeIn_0.6s_ease-out]">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-3xl bg-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
          <LuCoffee className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-2">
          Sign in to access your dashboard
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                type="text"
                required
                value={dataForm.username}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={dataForm.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <LuEyeOff className="w-4 h-4" />
                ) : (
                  <LuEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 bg-slate-50 accent-amber-500"
              />
              Remember me
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-amber-600 hover:text-amber-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all duration-300 cursor-pointer active:scale-[0.98] ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-amber-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Demo credentials:</p>
          <p className="mt-2 text-sm text-slate-600">Staff: staff@blackbird.com / staff123</p>
          <p className="text-sm text-slate-600">Manager: manager@blackbird.com / manager123</p>
        </div>
      </div>
    </div>
  );
}

