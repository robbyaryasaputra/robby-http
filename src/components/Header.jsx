import { LuSearch, LuShoppingCart, LuUser } from "react-icons/lu";

export default function Header({ search, setSearch }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          id="header-search"
          type="text"
          placeholder="Search for coffee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-300 font-[Poppins]"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        <button
          id="header-cart"
          className="relative p-2.5 rounded-full hover:bg-amber-50 transition-colors duration-200"
        >
          <LuShoppingCart className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <button
          id="header-profile"
          className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center hover:shadow-lg hover:shadow-amber-200 transition-all duration-300 cursor-pointer"
        >
          <LuUser className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  );
}