import { LuPlus } from "react-icons/lu";
import RatingStars from "../../../components/status/RatingStars";

export default function MemberMenuItemCard({
  item,
  discountPercent,
  onAddToCart,
}) {
  const hasDiscount = discountPercent > 0;
  const discountedPrice = item.price * (1 - discountPercent / 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col group animate-[fadeIn_0.4s_ease-out]">
      <div className="h-44 relative bg-slate-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.badge && (
          <span className="absolute top-3 left-3 bg-[#4B2C20] text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            {item.badge}
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
            Diskon {discountPercent}%
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
        <div className="space-y-1.5">
          <div className="flex justify-between items-start gap-1">
            <h4 className="font-extrabold text-slate-800 text-base">
              {item.name}
            </h4>
            <div className="flex items-center gap-0.5 text-xs text-amber-500 shrink-0 font-bold">
              <RatingStars rating={item.rating} size="xs" />
              <span className="text-slate-400 font-semibold text-[10px] ml-0.5">
                ({item.reviews})
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div>
            {hasDiscount ? (
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 line-through block font-medium">
                  IDR {Number(item.price).toLocaleString("id-ID")}
                </span>
                <span className="text-[#855C3B] font-black text-sm">
                  IDR {Number(discountedPrice).toLocaleString("id-ID")}
                </span>
              </div>
            ) : (
              <span className="text-slate-800 font-black text-sm">
                IDR {Number(item.price).toLocaleString("id-ID")}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(item)}
            className="p-2.5 rounded-xl bg-[#855C3B] text-white hover:bg-[#6d4734] transition-colors cursor-pointer group-hover:scale-105 duration-300 shadow-md shadow-[#855C3B]/10 border-0"
          >
            <LuPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
