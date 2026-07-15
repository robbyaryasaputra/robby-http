import { LuHeart, LuPlus } from "react-icons/lu";
import RatingStars from "../../../components/status/RatingStars";
import { FadeIn } from "../../../components/animation";

export default function MenuItemCard({
  item,
  index,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}) {
  const formatPrice = (p) => {
    return `$${Number(p).toFixed(2)}`;
  };

  const badge = item.badge || item.tag || null;
  const badgeUpper = badge ? badge.toUpperCase() : null;

  return (
    <FadeIn
      duration={0.4}
      delay={Math.min(index * 0.05, 0.3)}
      className="h-full"
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #ede8e1",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.2s, transform 0.2s",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Image & Favorite button */}
        <div style={{ height: "180px", position: "relative", background: "#f5ede3", overflow: "hidden" }}>
          {item.image || item.image_url ? (
            <img
              src={item.image || item.image_url}
              alt={item.name}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null; // cegah infinite loop
                e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop";
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>☕</div>
          )}
          {badgeUpper && (
            <span style={{
              position: "absolute", top: "10px", left: "10px",
              background: "rgba(30,15,5,0.75)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "3px 9px", borderRadius: "5px",
            }}>
              {badgeUpper}
            </span>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
            style={{
              position: "absolute", top: "10px", right: "10px",
              width: "32px", height: "32px", borderRadius: "50%",
              background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            <LuHeart
              className={`w-4.5 h-4.5 transition-all duration-300 ${isFavorite ? "text-red-500 fill-red-500 scale-110" : "text-gray-500"
                }`}
            />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#1a0f07", margin: 0, fontFamily: "'Georgia', serif" }}>
                {item.name}
              </h4>
              <span style={{
                fontSize: "10px", fontWeight: "600", color: "#8b6f47",
                background: "#fdf8f0", border: "1px solid #fed7aa",
                padding: "2px 8px", borderRadius: "999px",
              }}>
                {item.category}
              </span>
            </div>

            <div style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
              <RatingStars rating={item.rating} size={11} />
            </div>

            <p style={{ fontSize: "12px", color: "#8a7868", lineHeight: "1.55", margin: 0 }}>
              {item.description}
            </p>
          </div>

          {/* Price + Add button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #f2e7dc", marginTop: "14px" }}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#7c3c1a" }}>
              {formatPrice(item.price)}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "#1a0f07", color: "#fff",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s, transform 0.15s",
                boxShadow: "0 2px 8px rgba(26,15,7,0.25)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#3d2311"; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1a0f07"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <LuPlus style={{ width: "16px", height: "16px" }} />
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
