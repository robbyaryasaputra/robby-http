import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuUserPlus } from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import { RegisterForm, AuthCard } from "../../components/auth";

export default function Register() {
  const [dataForm, setDataForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
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
    setSuccessMessage("");

    // Validasi password match
    if (dataForm.password !== dataForm.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    // Validasi panjang password minimal 6 karakter
    if (dataForm.password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", dataForm.email)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingUser) {
        throw new Error("Email sudah terdaftar.");
      }

      // Create new user record in custom users table
      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            name: dataForm.name,
            email: dataForm.email,
            password: dataForm.password,
            role: "customer",
            status: "active",
          },
        ]);

      if (insertError) throw insertError;

      setSuccessMessage(
        "Pendaftaran berhasil! Akun Anda telah terdaftar. Mengalihkan ke halaman login...",
      );

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      console.error("Register error:", err);
      const message =
        err.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.";
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
          <LuUserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Buat Akun Baru
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Daftarkan diri Anda untuk mulai menggunakan dashboard
        </p>
      </div>

      {/* Form Card */}
      <AuthCard>
        <RegisterForm
          name={dataForm.name}
          email={dataForm.email}
          password={dataForm.password}
          confirmPassword={dataForm.confirmPassword}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          successMessage={successMessage}
        />
      </AuthCard>
    </div>
  );
}
