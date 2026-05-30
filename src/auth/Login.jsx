import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCoffee } from "react-icons/lu";
import axios from "axios";
import { LoginForm, AuthCard } from "../components/8-auth";

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
