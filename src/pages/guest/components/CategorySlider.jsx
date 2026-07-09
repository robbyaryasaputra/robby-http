export default function CategorySlider({
  categoriesList,
  activeCategory,
  onSelectCategory,
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", overflowX: "auto" }}>
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
  );
}
