import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { LuMail, LuLock, LuEye, LuEyeOff, LuArrowRight, LuLoader } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";

/* ── shared input style ─────────────────────────────── */
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

export default function Login() {
  const [dataForm, setDataForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || null;
  const { signIn } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { profile } = await signIn(dataForm.email, dataForm.password);
      if (redirectTo) { navigate(redirectTo); return; }
      navigate(profile?.role === "customer" ? "/member" : "/dashboard");
    } catch (err) {
      setError(err.message || "Login gagal. Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Heading */}
      <h1 style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: "clamp(32px, 3vw, 42px)",
        fontWeight: "400",
        color: "#1a1209",
        margin: "0 0 10px 0",
        lineHeight: "1.2",
        letterSpacing: "-0.5px",
      }}>
        Welcome Back
      </h1>
      <p style={{ fontSize: "15px", color: "#7a6a58", margin: "0 0 40px 0", lineHeight: "1.5" }}>
        Log in to continue your artisanal journey.
      </p>

      {/* Error */}
      {error && (
        <div style={{
          padding: "12px 16px", marginBottom: "20px", borderRadius: "6px",
          background: "#fef2f2", border: "1px solid #fca5a5",
          fontSize: "13px", color: "#991b1b",
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Email */}
        <div>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: "relative" }}>
            <LuMail style={{
              position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
              width: "16px", height: "16px", color: "#a89880", pointerEvents: "none",
            }} />
            <input
              id="login-email"
              name="email"
              type="email"
              required
              value={dataForm.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={inputBase}
              onFocus={(e) => { e.target.style.borderColor = "#8b6f47"; }}
              onBlur={(e) => { e.target.style.borderColor = "#d8d2c8"; }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
            <Link
              to="/auth/forgot-password"
              style={{ fontSize: "13px", color: "#8b6f47", fontStyle: "italic", fontWeight: "400" }}
            >
              Forgot Password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <LuLock style={{
              position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
              width: "16px", height: "16px", color: "#a89880", pointerEvents: "none",
            }} />
            <input
              id="login-password"
              name="password"
              type={showPw ? "text" : "password"}
              required
              value={dataForm.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ ...inputBase, paddingRight: "44px" }}
              onFocus={(e) => { e.target.style.borderColor = "#8b6f47"; }}
              onBlur={(e) => { e.target.style.borderColor = "#d8d2c8"; }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: "#a89880", display: "flex", alignItems: "center",
              }}
            >
              {showPw ? <LuEyeOff style={{ width: "16px", height: "16px" }} /> : <LuEye style={{ width: "16px", height: "16px" }} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px 24px",
            background: loading ? "#3d2d1e" : "#1f1208",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "background 0.2s, transform 0.15s",
            marginTop: "4px",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#3d2d1e"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1f1208"; }}
        >
          {loading ? (
            <><LuLoader style={{ width: "15px", height: "15px", animation: "spin 1s linear infinite" }} /> Processing...</>
          ) : (
            <>Sign In <LuArrowRight style={{ width: "15px", height: "15px" }} /></>
          )}
        </button>
      </form>

      {/* Register link */}
      <p style={{ textAlign: "center", marginTop: "28px", fontSize: "14px", color: "#7a6a58" }}>
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          style={{ color: "#8b6f47", fontWeight: "500", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          Create an Account
        </Link>
      </p>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
