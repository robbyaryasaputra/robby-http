import { useState } from "react";
import { ResetPasswordForm, AuthCard } from "../components/8-auth";

export default function ResetPassword() {
  const [dataForm, setDataForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (dataForm.password !== dataForm.confirmPassword) {
      setError("Kata sandi tidak cocok.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Kata sandi berhasil direset.");
    }, 1500);
  };

  return (
    <div className="animate-[fadeIn_0.6s_ease-out]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Reset Password</h1>
        <p className="text-sm text-slate-500 mt-2">
          Masukkan kata sandi baru Anda untuk mengakses kembali akun.
        </p>
      </div>

      <AuthCard>
        <ResetPasswordForm
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
