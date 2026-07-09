import { useState } from "react";
import { Link } from "react-router-dom";
import { LuMail, LuArrowRight, LuArrowLeft, LuLoader, LuCircleCheck } from "react-icons/lu";
import { supabase } from "../../lib/supabase";

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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccessMessage("");
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (resetError) throw resetError;
      setSuccessMessage("Link reset password telah dikirim ke email Anda. Periksa inbox dan folder spam.");
    } catch (err) {
      setError(err.message || "Gagal memproses permintaan.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "clamp(28px, 2.8vw, 38px)", fontWeight: "400", color: "#1a1209", margin: "0 0 10px 0", lineHeight: "1.2", letterSpacing: "-0.5px" }}>
        Forgot Password?
      </h1>
      <p style={{ fontSize: "15px", color: "#7a6a58", margin: "0 0 36px 0", lineHeight: "1.6" }}>
        Enter your email and we'll send you instructions to reset your password.
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

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: "relative" }}>
            <LuMail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a89880", pointerEvents: "none" }} />
            <input
              id="forgot-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={inputBase}
              onFocus={(e) => { e.target.style.borderColor = "#8b6f47"; }}
              onBlur={(e) => { e.target.style.borderColor = "#d8d2c8"; }}
            />
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          style={{ width: "100%", padding: "15px 24px", background: loading ? "#3d2d1e" : "#1f1208", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "background 0.2s", fontFamily: "inherit" }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#3d2d1e"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1f1208"; }}
        >
          {loading ? <><LuLoader style={{ width: "15px", height: "15px", animation: "spin 1s linear infinite" }} /> Sending...</> : <>Send Reset Link <LuArrowRight style={{ width: "15px", height: "15px" }} /></>}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <Link to="/auth/login" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#8b6f47", fontWeight: "500", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          <LuArrowLeft style={{ width: "14px", height: "14px" }} />
          Back to Sign In
        </Link>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
