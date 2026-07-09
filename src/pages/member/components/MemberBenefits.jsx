import { LuCheck, LuTrendingUp, LuZap, LuInfo } from "react-icons/lu";

const TIER_META = {
  Bronze:   { icon: "🥉", nextBadge: "bg-slate-100 text-slate-700 border-slate-300", nextGradient: "linear-gradient(135deg, #9ca3af, #6b7280)" },
  Silver:   { icon: "🥈", nextBadge: "bg-yellow-100 text-yellow-800 border-yellow-300", nextGradient: "linear-gradient(135deg, #facc15, #d97706)" },
  Gold:     { icon: "🥇", nextBadge: "bg-purple-100 text-purple-800 border-purple-300", nextGradient: "linear-gradient(135deg, #a855f7, #6b21a8)" },
  Platinum: { icon: "💎", nextBadge: null, nextGradient: null },
};
const NEXT_TIER = { Bronze: "Silver", Silver: "Gold", Gold: "Platinum", Platinum: null };

export default function MemberBenefits({ activeMemberProfile }) {
  if (!activeMemberProfile) return null;

  const tierName = activeMemberProfile.tier?.name || "Bronze";
  const meta = TIER_META[tierName] || TIER_META.Bronze;
  const nextTierName = NEXT_TIER[tierName];
  const discount = activeMemberProfile.tier?.discount_percent ?? 0;
  const multiplier = activeMemberProfile.tier?.points_multiplier ?? 1.0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Active Level Card */}
      <div style={{
        background: "#fff", borderRadius: "14px",
        border: "1px solid #ede8e1",
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", borderBottom: "1px solid #f0ebe3",
          background: "#faf7f4",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #cd7f32, #9e5e1e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
            }}>
              {meta.icon}
            </div>
            <div>
              <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#a89078", margin: 0 }}>Level Aktif</p>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "#1a0f07", margin: 0 }}>{tierName} Member</p>
            </div>
          </div>
          <LuInfo style={{ width: "16px", height: "16px", color: "#c5b8a8" }} />
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #f0ebe3" }}>
          <div style={{ padding: "14px 18px", borderRight: "1px solid #f0ebe3" }}>
            <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0a090", margin: "0 0 4px 0" }}>
              % Auto Diskon
            </p>
            <p style={{ fontSize: "20px", fontWeight: "800", color: "#1a0f07", margin: 0, lineHeight: 1 }}>
              {discount > 0 ? `${discount}%` : <span style={{ fontSize: "16px", color: "#c5b8a8" }}>—</span>}
            </p>
            <p style={{ fontSize: "10px", color: "#c5b8a8", margin: "3px 0 0 0" }}>setiap pembelian</p>
          </div>
          <div style={{ padding: "14px 18px" }}>
            <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0a090", margin: "0 0 4px 0" }}>
              🔁 Poin Multiplier
            </p>
            <p style={{ fontSize: "20px", fontWeight: "800", color: "#1a0f07", margin: 0, lineHeight: 1 }}>
              {multiplier}x
            </p>
            <p style={{ fontSize: "10px", color: "#c5b8a8", margin: "3px 0 0 0" }}>dari setiap transaksi</p>
          </div>
        </div>

        {/* Benefits list */}
        <div style={{ padding: "14px 18px" }}>
          <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0a090", margin: "0 0 10px 0" }}>
            ☆ Keuntungan Level Ini
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
            {(activeMemberProfile.tier?.benefits || []).slice(0, 4).map((benefit, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                  background: "#ecfdf5", border: "1px solid #bbf7d0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <LuCheck style={{ width: "9px", height: "9px", color: "#16a34a" }} />
                </div>
                <span style={{ fontSize: "12px", color: "#5a4a3a", fontWeight: "500" }}>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Tier Card */}
      {nextTierName && (
        <div style={{
          background: "#fff", borderRadius: "14px",
          border: "1px dashed #ddd8d0",
          padding: "14px 18px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <LuTrendingUp style={{ width: "13px", height: "13px", color: "#b0a090" }} />
            <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0a090", margin: 0 }}>
              Level Berikutnya
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: meta.nextGradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", flexShrink: 0,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
              {TIER_META[nextTierName]?.icon}
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "#1a0f07", margin: "0 0 4px 0" }}>{nextTierName}</p>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "3px",
                fontSize: "10px", fontWeight: "600", padding: "2px 8px",
                borderRadius: "999px", border: "1px solid",
                background: "#fef9f0", color: "#92400e", borderColor: "#fed7aa",
              }}>
                <LuZap style={{ width: "10px", height: "10px" }} />
                Diskon lebih besar
              </span>
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "#8a7868", lineHeight: "1.6", margin: 0 }}>
            Kumpulkan lebih banyak poin untuk membuka level <strong>{nextTierName}</strong> dan
            nikmati diskon otomatis yang lebih besar serta multiplier poin eksklusif.
          </p>
        </div>
      )}

      {/* Platinum badge */}
      {!nextTierName && (
        <div style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(107,33,168,0.06))", borderRadius: "14px", border: "1px solid rgba(168,85,247,0.2)", padding: "14px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>💎</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#6b21a8", margin: 0 }}>Platinum Member</p>
              <p style={{ fontSize: "11px", color: "#9333ea", margin: "2px 0 0 0" }}>Level tertinggi — Anda sudah di puncak!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
