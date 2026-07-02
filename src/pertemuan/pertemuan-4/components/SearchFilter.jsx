import { useState } from "react";

const categories = [
  "All",
  "Indonesian",
  "Japanese",
  "Italian",
  "Korean",
  "Chinese",
  "Mexican",
  "French",
  "Indian",
  "Thai",
  "Mediterranean",
  "American",
  "Cafe",
  "Vietnamese",
];

const priceRanges = ["All", "$", "$$", "$$$", "$$$$"];

export default function SearchFilter({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search restaurants by name, category, or city..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-lg"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div className="relative">
          <label className="block text-xs font-semibold text-purple-300 mb-1 ml-1 uppercase tracking-wider">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-lg appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-900 text-white">
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
          <div className="absolute right-4 bottom-3.5 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="relative">
          <label className="block text-xs font-semibold text-purple-300 mb-1 ml-1 uppercase tracking-wider">
            Price Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => onPriceRangeChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-lg appearance-none cursor-pointer"
          >
            {priceRanges.map((pr) => (
              <option key={pr} value={pr} className="bg-gray-900 text-white">
                {pr === "All" ? "All Prices" : pr}
              </option>
            ))}
          </select>
          <div className="absolute right-4 bottom-3.5 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
