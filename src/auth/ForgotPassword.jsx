import { useState } from "react";
import { ForgotPasswordForm, AuthCard } from "../components/8-auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Instruksi reset password telah dikirim ke email Anda.");
    }, 1500);
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
