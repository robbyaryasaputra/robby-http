export default function CategorySlider({
  categoriesList,
  activeCategory,
  onSelectCategory,
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
      {categoriesList.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
            activeCategory === cat
              ? "bg-[#855C3B] text-white shadow-md shadow-[#855C3B]/20"
              : "bg-[#FAF4EE] text-[#5F3A27] hover:bg-[#F2E7DC]"
          }`}
        >
          {cat === "All" ? "Semua" : cat}
        </button>
      ))}
    </div>
  );
}
