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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    <div className="bg-white border border-[#EBE3D5] rounded-3xl p-16 text-center max-w-md mx-auto space-y-4 animate-[fadeIn_0.5s_ease-out]">
      <LuCoffee className="w-16 h-16 text-gray-300 mx-auto animate-bounce" />
      <h3 className="font-bold text-lg text-[#4B2C20]">
        Kopi Tidak Ditemukan
      </h3>
      <p className="text-gray-500 text-sm">
        Kata kunci pencarian Anda tidak cocok dengan menu kami saat ini.
        Harap coba kata kunci lainnya.
      </p>
    </div>
  );
}
