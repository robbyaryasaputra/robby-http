import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { ForgotPasswordForm, AuthCard } from "../../components/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Send password reset email via Supabase Auth
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (resetError) throw resetError;

      setSuccessMessage(
        "Link reset password telah dikirim ke email Anda. Silakan periksa inbox dan folder spam."
      );
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
