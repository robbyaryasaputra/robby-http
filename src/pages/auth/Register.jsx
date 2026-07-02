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

<<<<<<< HEAD
=======
    // Validasi password match
>>>>>>> 2a55e1abcd64a1f7358cceba9e08b24c924586ee
    if (dataForm.password !== dataForm.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

<<<<<<< HEAD
=======
    // Validasi panjang password minimal 6 karakter
>>>>>>> 2a55e1abcd64a1f7358cceba9e08b24c924586ee
    if (dataForm.password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
<<<<<<< HEAD
      // 1. Daftar via Supabase Auth — password dikelola sepenuhnya oleh Supabase
      const { data, error: registerError } = await supabase.auth.signUp({
        email: dataForm.email,
        password: dataForm.password,
      });

      if (registerError) {
        // Error ini terjadi jika trigger di Supabase masih aktif
        if (registerError.message?.includes("Database error")) {
          throw new Error(
            "Konfigurasi database belum selesai. Silakan hubungi admin untuk menghapus trigger lama di Supabase."
          );
        }
        throw registerError;
      }

      const userId = data?.user?.id;
      if (!userId) throw new Error("Gagal mendapatkan ID user.");

      // Cek apakah Supabase meminta konfirmasi email
      // (identities kosong = email belum dikonfirmasi, user sudah terdaftar sebelumnya)
      const needsConfirmation = data?.user?.identities?.length === 0;
      if (needsConfirmation) {
        setSuccessMessage(
          "Email sudah terdaftar. Silakan cek email Anda untuk konfirmasi, atau login jika sudah terdaftar."
        );
        setTimeout(() => navigate("/auth/login"), 3000);
        return;
      }

      // 2. Hitung member_code berikutnya (MBR-00001, MBR-00002, ...)
      const { data: existing } = await supabase
        .from("users")
        .select("member_code")
        .not("member_code", "is", null);

      const maxNum = (existing || []).reduce((max, u) => {
        const m = u.member_code?.match(/^MBR-(\d+)$/);
        return m ? Math.max(max, parseInt(m[1])) : max;
      }, 0);

      const memberCode = `MBR-${String(maxNum + 1).padStart(5, "0")}`;

      // 3. Insert profil ke public.users
      const { error: profileError } = await supabase.from("users").insert({
        id: userId,
        name: dataForm.name,
        email: dataForm.email,
        role: "customer",
        status: "active",
        member_code: memberCode,
        tier: "Bronze",
        total_points: 0,
        current_points: 0,
      });

      if (profileError) console.warn("Profil gagal disimpan:", profileError.message);

      // Cek apakah Supabase mengirim email konfirmasi
      const emailSent = !data?.session; // session null = perlu konfirmasi email
      setSuccessMessage(
        emailSent
          ? "Pendaftaran berhasil! Cek email Anda untuk konfirmasi akun sebelum login."
          : "Pendaftaran berhasil! Akun Anda siap digunakan. Mengalihkan ke login..."
=======
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
>>>>>>> 2a55e1abcd64a1f7358cceba9e08b24c924586ee
      );

      setTimeout(() => {
        navigate("/auth/login");
<<<<<<< HEAD
      }, 3000);
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
=======
      }, 2000);
    } catch (err) {
      console.error("Register error:", err);
      const message =
        err.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.";
      setError(message);
>>>>>>> 2a55e1abcd64a1f7358cceba9e08b24c924586ee
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
