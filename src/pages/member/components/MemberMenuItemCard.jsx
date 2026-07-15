import { LuPlus } from "react-icons/lu";

export default function MemberMenuItemCard({ item, discountPercent, onAddToCart }) {
  const hasDiscount = discountPercent > 0;
  const discountedPrice = item.price * (1 - discountPercent / 100);

  const formatPrice = (p) => {
    return `$${Number(p).toFixed(2)}`;
  };

  // Determine badge from item fields
  const badge = item.badge || item.tag || null;
  const badgeUpper = badge ? badge.toUpperCase() : null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid #ede8e1",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div style={{ height: "180px", position: "relative", background: "#f5ede3", overflow: "hidden" }}>
        {item.image || item.image_url ? (
          <img
            src={item.image || item.image_url}
            alt={item.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
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
        {hasDiscount && (
          <span style={{
            position: "absolute", top: "10px", right: "10px",
            background: "#dc2626", color: "#fff",
            fontSize: "9px", fontWeight: "700",
            padding: "3px 9px", borderRadius: "5px",
          }}>
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px 18px" }}>
        <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#1a0f07", margin: "0 0 5px 0", fontFamily: "'Georgia', serif" }}>
          {item.name}
        </h4>
        <p style={{ fontSize: "12px", color: "#8a7868", lineHeight: "1.55", margin: "0 0 14px 0", minHeight: "36px" }}>
          {item.description}
        </p>

        {/* Price + Add button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            {hasDiscount ? (
              <>
                <p style={{ fontSize: "10px", color: "#c5b8a8", textDecoration: "line-through", margin: "0 0 1px 0" }}>
                  {formatPrice(item.price)}
                </p>
                <p style={{ fontSize: "15px", fontWeight: "700", color: "#7c3c1a", margin: 0 }}>
                  {formatPrice(discountedPrice)}
                </p>
              </>
            ) : (
              <p style={{ fontSize: "15px", fontWeight: "700", color: "#7c3c1a", margin: 0 }}>
                {formatPrice(item.price)}
              </p>
            )}
          </div>
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
  );
}
