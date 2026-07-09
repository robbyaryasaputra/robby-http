import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LuMail, LuUser, LuLock, LuEye, LuEyeOff, LuArrowRight, LuLoader, LuCircleCheck } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";

const inputBase = {
  width: "100%",
  padding: "13px 14px 13px 42px",
  border: "1px solid #d8d2c8",
  borderRadius: "6px",
  fontSize: "15px",
  color: "#1a1209",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.1em",
  color: "#6b5e4e",
  textTransform: "uppercase",
  marginBottom: "8px",
};

function FieldInput({ id, name, type = "text", placeholder, value, onChange, icon: Icon, label, rightEl }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
        <label htmlFor={id} style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
        {rightEl}
      </div>
      <div style={{ position: "relative" }}>
        <Icon style={{
          position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
          width: "16px", height: "16px", color: "#a89880", pointerEvents: "none",
        }} />
        <input
          id={id} name={name} required value={value} onChange={onChange}
          type={isPassword ? (showPw ? "text" : "password") : type}
          placeholder={placeholder}
          style={{ ...inputBase, paddingRight: isPassword ? "44px" : inputBase.paddingRight }}
          onFocus={(e) => { e.target.style.borderColor = "#8b6f47"; }}
          onBlur={(e) => { e.target.style.borderColor = "#d8d2c8"; }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPw(!showPw)}
            style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#a89880", display: "flex" }}>
            {showPw ? <LuEyeOff style={{ width: "16px", height: "16px" }} /> : <LuEye style={{ width: "16px", height: "16px" }} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const [dataForm, setDataForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccessMessage("");
    if (dataForm.password !== dataForm.confirmPassword) { setError("Password tidak cocok."); setLoading(false); return; }
    if (dataForm.password.length < 6) { setError("Password minimal 6 karakter."); setLoading(false); return; }
    try {
      await signUp(dataForm.email, dataForm.password, { name: dataForm.name });
      setSuccessMessage("Akun berhasil dibuat! Mengalihkan ke halaman login...");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mendaftar.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "clamp(28px, 2.8vw, 38px)", fontWeight: "400", color: "#1a1209", margin: "0 0 10px 0", lineHeight: "1.2", letterSpacing: "-0.5px" }}>
        Create Account
      </h1>
      <p style={{ fontSize: "15px", color: "#7a6a58", margin: "0 0 36px 0", lineHeight: "1.5" }}>
        Join us and start your artisanal journey.
      </p>

      {error && (
        <div style={{ padding: "12px 16px", marginBottom: "20px", borderRadius: "6px", background: "#fef2f2", border: "1px solid #fca5a5", fontSize: "13px", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{ padding: "12px 16px", marginBottom: "20px", borderRadius: "6px", background: "#f0fdf4", border: "1px solid #86efac", fontSize: "13px", color: "#166534", display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <LuCircleCheck style={{ width: "15px", height: "15px", flexShrink: 0, marginTop: "1px" }} />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <FieldInput id="register-name" name="name" type="text" label="Full Name" placeholder="Your full name" value={dataForm.name} onChange={handleChange} icon={LuUser} />
        <FieldInput id="register-email" name="email" type="email" label="Email Address" placeholder="your@email.com" value={dataForm.email} onChange={handleChange} icon={LuMail} />
        <FieldInput id="register-password" name="password" type="password" label="Password" placeholder="••••••••" value={dataForm.password} onChange={handleChange} icon={LuLock} />
        <FieldInput id="register-confirm" name="confirmPassword" type="password" label="Confirm Password" placeholder="••••••••" value={dataForm.confirmPassword} onChange={handleChange} icon={LuLock} />

        <button
          id="register-submit" type="submit" disabled={loading}
          style={{ width: "100%", padding: "15px 24px", background: loading ? "#3d2d1e" : "#1f1208", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "background 0.2s", marginTop: "4px", fontFamily: "inherit" }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#3d2d1e"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1f1208"; }}
        >
          {loading ? <><LuLoader style={{ width: "15px", height: "15px", animation: "spin 1s linear infinite" }} /> Processing...</> : <>Create Account <LuArrowRight style={{ width: "15px", height: "15px" }} /></>}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "28px", fontSize: "14px", color: "#7a6a58" }}>
        Already have an account?{" "}
        <Link to="/auth/login" style={{ color: "#8b6f47", fontWeight: "500", textDecoration: "underline", textUnderlineOffset: "3px" }}>Sign In</Link>
      </p>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
