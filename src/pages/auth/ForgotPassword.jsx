import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ForgotPasswordForm, AuthCard } from "../../components/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // 1. Verify email exists in users table
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) {
        throw new Error("Email tidak terdaftar.");
      }

      // 2. Trigger Supabase password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccessMessage("Link reset password telah dikirim ke email Anda!");
      // We don't navigate immediately since the user needs to check their email
      // but they can also use the local flow if email isn't configured, so let's allow them to navigate:
      setTimeout(() => {
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 3000);
    } catch (err) {
      setError(err.message || "Gagal memproses permintaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.6s_ease-out]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Forgot Password</h1>
        <p className="text-sm text-slate-500 mt-2">
          Masukkan email Anda dan kami akan mengirimkan instruksi untuk mereset
          kata sandi.
        </p>
      </div>

      <AuthCard>
        <ForgotPasswordForm
          email={email}
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
