import { LuSearch } from "react-icons/lu";
import { SlideUp } from "../../../components/animation";
import MemberMenuItemCard from "./MemberMenuItemCard";

export default function MemberShopCatalogue({
  categoriesList,
  activeCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  filteredMenu,
  activeMemberProfile,
  onAddToCart,
}) {
  const discountPercent = activeMemberProfile
    ? parseFloat(activeMemberProfile.tier.discount_percent)
    : 0;

  return (
    <SlideUp duration={0.4}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Filter bar */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #ede8e1",
          padding: "12px 16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          {/* Category pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", flex: 1 }}>
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "600",
                    border: isActive ? "none" : "1px solid #ede8e1",
                    background: isActive ? "#1a0f07" : "transparent",
                    color: isActive ? "#fff" : "#7a6a58",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#f5f0ea"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  {cat === "All" ? "Semua" : cat}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <LuSearch style={{
              position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
              width: "14px", height: "14px", color: "#b0a090", pointerEvents: "none",
            }} />
            <input
              type="text"
              placeholder="Cari menu favorit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: "36px", paddingRight: "14px", paddingTop: "8px", paddingBottom: "8px",
                width: "200px",
                background: "#faf7f4",
                border: "1px solid #ede8e1",
                borderRadius: "999px",
                fontSize: "13px",
                color: "#1a0f07",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#8b6f47"; }}
              onBlur={(e) => { e.target.style.borderColor = "#ede8e1"; }}
            />
          </div>
        </div>

        {/* Menu grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <MemberMenuItemCard
                key={item.id}
                item={item}
                discountPercent={discountPercent}
                onAddToCart={onAddToCart}
              />
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", color: "#b0a090" }}>
              <p style={{ fontSize: "32px", margin: "0 0 10px" }}>☕</p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#7a6a58" }}>Tidak ada menu ditemukan</p>
              <p style={{ fontSize: "13px", color: "#b0a090", margin: "4px 0 0" }}>Coba kata kunci atau kategori lain</p>
            </div>
          )}
        </div>
      </div>
    </SlideUp>
  );
}
