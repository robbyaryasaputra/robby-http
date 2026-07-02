import { useState, useMemo } from "react";
import restaurants from "./data/restaurants.json";
import SearchFilter from "./components/SearchFilter";
import GuestView from "./components/GuestView";
import AdminView from "./components/AdminView";

export default function RestaurantExplorer() {
  const [viewMode, setViewMode] = useState("guest");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.location.city.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      const matchCategory = category === "All" || r.category === category;
      const matchPrice = priceRange === "All" || r.priceRange === priceRange;
      return matchSearch && matchCategory && matchPrice;
    });
  }, [search, category, priceRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-3">
            Restaurant Explorer
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover 20 curated restaurants across Indonesia — browse as a guest or manage as an admin.
          </p>
        </header>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-lg">
            <button
              onClick={() => setViewMode("guest")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                viewMode === "guest"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Guest View
              </span>
            </button>
            <button
              onClick={() => setViewMode("admin")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                viewMode === "admin"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                </svg>
                Admin View
              </span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            Found <span className="text-purple-300 font-semibold">{filteredRestaurants.length}</span> of{" "}
            <span className="text-gray-400">{restaurants.length}</span> restaurants
          </p>
          {(search || category !== "All" || priceRange !== "All") && (
            <button
              onClick={() => { setSearch(""); setCategory("All"); setPriceRange("All"); }}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Content */}
        {viewMode === "guest" ? (
          <GuestView restaurants={filteredRestaurants} />
        ) : (
          <AdminView restaurants={filteredRestaurants} />
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-600 text-sm">
            Pertemuan 4 — React JSON Data, Components, Search &amp; Filter
          </p>
        </footer>
      </div>
    </div>
  );
}
