import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCoffee } from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import { LoginForm, AuthCard } from "../../components/auth";

export default function Login() {
  const [dataForm, setDataForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      // Query users table for matching email and password
      const { data: user, error: loginError } = await supabase
        .from("users")
        .select("*")
        .eq("email", dataForm.username)
        .eq("password", dataForm.password)
        .maybeSingle();

      if (loginError) throw loginError;
      if (!user) {
        throw new Error("Email atau password salah.");
      }
      if (user.status !== "active") {
        throw new Error("Akun Anda tidak aktif atau dibanned. Silakan hubungi admin.");
      }

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      const message =
        err.message ||
        "Login gagal. Silakan periksa kembali email dan password Anda.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
      <AuthCard>
        <LoginForm
          username={dataForm.username}
          password={dataForm.password}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </AuthCard>
    </div>
  );
}
