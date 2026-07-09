import { LuQrCode, LuAward } from "react-icons/lu";

export default function MemberProfileCard({
  activeMemberProfile,
  activeUser,
  nextTierInfo,
}) {
  if (!activeMemberProfile) return null;

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #2c1a0e 0%, #3d2311 60%, #4a2c16 100%)",
        borderRadius: "16px",
        padding: "22px 24px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(44,26,14,0.35)",
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
      <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <span style={{
          fontSize: "9px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase",
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "5px", padding: "4px 10px", color: "rgba(255,255,255,0.85)",
        }}>
          Loyalty Member Card
        </span>
        <LuQrCode style={{ width: "22px", height: "22px", color: "rgba(255,255,255,0.25)" }} />
      </div>

      {/* Customer info */}
      <div style={{ marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "0 0 5px 0" }}>
          Nama Pelanggan
        </p>
        <h3 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 4px 0", letterSpacing: "-0.3px", fontFamily: "'Georgia', serif" }}>
          {activeUser?.name || "—"}
        </h3>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", letterSpacing: "0.05em" }}>
          {activeMemberProfile.member_code}
        </span>
      </div>

      {/* Status + Points row */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)",
        position: "relative", zIndex: 1,
      }}>
        <div>
          <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "0 0 6px 0" }}>
            Status Level
          </p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: "#fff", color: "#1a0f07",
            fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "6px",
          }}>
            <LuAward style={{ width: "12px", height: "12px", color: activeMemberProfile.tier?.badge_color }} />
            {activeMemberProfile.tier?.name}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "0 0 4px 0" }}>
            Poin Aktif
          </p>
          <span style={{ fontSize: "26px", fontWeight: "800", color: "#f5c842", lineHeight: 1 }}>
            {activeMemberProfile.current_points}
          </span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginLeft: "4px" }}>pts</span>
        </div>
      </div>

      {/* Progress bar */}
      {nextTierInfo && (
        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>
              Progress ke {nextTierInfo.name}
            </span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>
              {activeMemberProfile.total_points} / {nextTierInfo.targetPoints} pts
            </span>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "99px", height: "5px", overflow: "hidden" }}>
            <div style={{
              width: `${nextTierInfo.percent}%`,
              height: "100%",
              background: "linear-gradient(90deg, #f5c842, #e09b2a)",
              borderRadius: "99px",
              transition: "width 0.5s ease",
            }} />
          </div>
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.38)", marginTop: "6px", fontWeight: "500" }}>
            Butuh {nextTierInfo.pointsNeeded} poin lagi untuk naik tingkat.
          </p>
        </div>
      )}
    </div>
  );
}
