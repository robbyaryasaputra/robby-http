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
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-4 shadow-lg shadow-amber-900/30">
          <LuCoffee className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-amber-200/60 text-sm mt-1">
          Sign in to Coffee Shop Admin
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email / Username */}
          <div>
            <label className="block text-xs font-medium text-amber-200/80 mb-2">
              Username or Email
            </label>
            <div className="relative">
              <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/50" />
              <input
                id="login-username"
                name="username"
                type="text"
                required
                value={dataForm.username}
                onChange={handleChange}
                placeholder="admin atau admin@coffeeshop.com"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-amber-200/80 mb-2">
              Password
            </label>
            <div className="relative">
              <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/50" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={dataForm.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-amber-500"
              />
              <span className="text-xs text-white/50">Remember me</span>
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-linear-to-r from-amber-500 to-amber-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-600/30 transition-all duration-300 cursor-pointer active:scale-[0.98] ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs text-white/30">or</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-white/40">
          Don't have an account?{" "}
          <span className="text-amber-400 hover:text-amber-300 cursor-pointer transition-colors font-medium">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

