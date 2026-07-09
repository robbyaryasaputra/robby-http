import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{
      display: "flex",
      width: "100%",
      minHeight: "100vh",
    }}>
      {/* ===== LEFT: Coffee Photo ===== */}
      <div
        className="hidden lg:block"
        style={{
          flex: "1 1 50%",
          backgroundImage: "url('/coffee-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {/* Subtle dark vignette at bottom */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 100%)",
        }} />
      </div>

      {/* ===== RIGHT: Form Area ===== */}
      <div style={{
        flex: "1 1 50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 48px",
        background: "#faf8f5",
        minHeight: "100vh",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
