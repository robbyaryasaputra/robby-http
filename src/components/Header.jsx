import { LuSearch, LuShoppingCart, LuUser } from "react-icons/lu";

export default function Header({ search, setSearch }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-2xl">
        <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          id="header-search"
          type="text"
          placeholder="Search for coffee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all duration-300"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        <button
          id="header-cart"
          className="relative p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200"
        >
          <LuShoppingCart className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <button
          id="header-profile"
          className="w-11 h-11 rounded-full bg-[#8B5B3D] flex items-center justify-center text-white hover:shadow-lg hover:shadow-[#8B5B3D]/20 transition-all duration-300 cursor-pointer"
        >
          <LuUser className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}