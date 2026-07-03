import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuCoffee } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";
import { LoginForm, AuthCard } from "../../components/auth";

export default function Login() {
  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || null;
  const { signIn } = useAuth();

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
      // Authenticate via Supabase Auth
      const { profile } = await signIn(dataForm.email, dataForm.password);

      // If a redirect target was specified (e.g. coming from guest cart wall), go there
      if (redirectTo) {
        navigate(redirectTo);
        return;
      }

      // Default redirect based on role
      if (profile?.role === "customer") {
        navigate("/member");
      } else {
        navigate("/dashboard");
      }
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
          email={dataForm.email}
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
