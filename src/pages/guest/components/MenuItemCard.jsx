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
  return (
    <FadeIn
      duration={0.4}
      delay={Math.min(index * 0.05, 0.3)}
      className="h-full"
    >
      <div className="group bg-white rounded-3xl border border-[#EBE3D5] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#855C3B]/25 transition-all duration-300 flex flex-col h-full">
        {/* Image & Badge overlay */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge */}
          {item.badge && (
            <span className="absolute top-4 left-4 bg-amber-500 text-[#4B2C20] text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
              {item.badge}
            </span>
          )}
          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(item.id)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 transition-colors shadow-md cursor-pointer"
          >
            <LuHeart
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorite ? "text-red-500 fill-red-500 scale-110" : ""
              }`}
            />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-lg text-[#4B2C20] group-hover:text-[#855C3B] transition-colors">
                {item.name}
              </h3>
              <span className="inline-block bg-[#F9F5EE] text-[#855C3B] font-semibold text-xs py-0.5 px-2 rounded-lg">
                {item.category}
              </span>
            </div>
            {/* Rating */}
            <RatingStars rating={item.rating} size={14} />
            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#F2E7DC]">
            <span className="text-lg font-black text-[#4B2C20]">
              ${item.price.toFixed(2)}
            </span>
            <button
              onClick={() => onAddToCart(item)}
              className="flex items-center gap-2 py-2 px-5 rounded-xl bg-[#FAF4EE] hover:bg-[#855C3B] text-[#855C3B] hover:text-white border border-[#855C3B]/20 transition-all duration-300 font-bold text-xs active:scale-[0.97] cursor-pointer"
            >
              <LuPlus className="w-4 h-4" />
              Keranjang
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
