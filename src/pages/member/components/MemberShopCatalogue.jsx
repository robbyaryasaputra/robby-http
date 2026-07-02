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
      <div className="space-y-6">
        {/* Filter Controls Header */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border-0 ${
                  activeCategory === cat
                    ? "bg-[#855C3B] text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {cat === "All" ? "Semua" : cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <LuSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari menu favorit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#855C3B]/50 transition-colors"
            />
          </div>
        </div>

        {/* Grid of Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredMenu.map((item) => (
            <MemberMenuItemCard
              key={item.id}
              item={item}
              discountPercent={discountPercent}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </SlideUp>
  );
}
