import { LuCoffee } from "react-icons/lu";
import MenuItemCard from "./MenuItemCard";

export default function MenuGrid({
  filteredMenu,
  favorites,
  onToggleFavorite,
  onAddToCart,
}) {
  if (filteredMenu.length > 0) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
        {filteredMenu.map((item, index) => {
          const isFav = favorites.includes(item.id);
          return (
            <MenuItemCard
              key={item.id}
              item={item}
              index={index}
              isFavorite={isFav}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #ede8e1",
      borderRadius: "24px",
      padding: "60px 20px",
      textAlign: "center",
      maxWidth: "400px",
      margin: "0 auto",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <LuCoffee style={{ width: "48px", height: "48px", color: "#c5b8a8", margin: "0 auto 16px" }} />
      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1a0f07", margin: "0 0 8px 0", fontFamily: "'Georgia', serif" }}>
        Kopi Tidak Ditemukan
      </h3>
      <p style={{ fontSize: "13px", color: "#8a7868", margin: 0, lineHeight: "1.6" }}>
        Kata kunci pencarian Anda tidak cocok dengan menu kami saat ini. Harap coba kata kunci lainnya.
      </p>
    </div>
  );
}
