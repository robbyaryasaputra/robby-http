import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LuStar, LuHeart, LuShoppingCart, LuChevronDown } from "react-icons/lu";

const coffeeMenu = [
  {
    id: 1,
    name: "Americano",
    price: 3.75,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    category: "Hot",
    badge: "Popular",
    description: "Strong and bold espresso shots",
    reviews: 234,
  },
  {
    id: 2,
    name: "Mocha Delight",
    price: 5.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1570968015861-ad48c34c1160?w=400&h=300&fit=crop",
    category: "Hot",
    badge: "Best Seller",
    description: "Rich chocolate and espresso blend",
    reviews: 456,
  },
  {
    id: 3,
    name: "Caramel Macchiato",
    price: 5.25,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop",
    category: "Hot",
    badge: "Featured",
    description: "Sweet caramel with espresso",
    reviews: 389,
  },
  {
    id: 4,
    name: "Double Espresso",
    price: 4.0,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop",
    category: "Hot",
    description: "Double shot of premium espresso",
    reviews: 278,
  },
  {
    id: 5,
    name: "Vanilla Latte",
    price: 4.75,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=300&fit=crop",
    category: "Hot",
    badge: "New",
    description: "Smooth vanilla-infused latte",
    reviews: 312,
  },
  {
    id: 6,
    name: "Iced Cappuccino",
    price: 4.5,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop",
    category: "Iced",
    description: "Refreshing iced cappuccino",
    reviews: 198,
  },
  {
    id: 7,
    name: "Flat White",
    price: 4.25,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400&h=300&fit=crop",
    category: "Hot",
    description: "Velvety smooth espresso and milk",
    reviews: 167,
  },
  {
    id: 8,
    name: "Irish Coffee",
    price: 5.75,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&h=300&fit=crop",
    category: "Special",
    badge: "Premium",
    description: "Classic Irish coffee blend",
    reviews: 89,
  },
  {
    id: 9,
    name: "Affogato",
    price: 5.5,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1594631252845-29fc458631b6?w=400&h=300&fit=crop",
    category: "Special",
    description: "Espresso poured over ice cream",
    reviews: 212,
  },
];

const categories = ["All", "Hot", "Iced", "Special"];

const getBadgeColor = (badge) => {
  switch (badge) {
    case "Popular":
      return "bg-blue-100 text-blue-700";
    case "Best Seller":
      return "bg-rose-100 text-rose-700";
    case "Featured":
      return "bg-purple-100 text-purple-700";
    case "New":
      return "bg-emerald-100 text-emerald-700";
    case "Premium":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function Menu() {
  const { search } = useOutletContext();
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("popular");

  const filteredMenu = coffeeMenu.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const sortedMenu = [...filteredMenu].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return b.reviews - a.reviews;
    }
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2C1A0E]">Menu</h1>
          <p className="text-sm text-gray-500 mt-1">
            {sortedMenu.length} coffee items available
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <LuChevronDown className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-0 text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Lowest Price</option>
            <option value="price-high">Highest Price</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase()}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${activeCategory === cat
                ? "bg-[#2C1A0E] text-white shadow-md shadow-[#2C1A0E]/20"
                : "bg-white text-gray-600 hover:bg-amber-50 border border-gray-200 hover:border-amber-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Coffee Grid */}
      {sortedMenu.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMenu.map((coffee, index) => (
            <div
              key={coffee.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-amber-200"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image Container */}
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <img
                  src={coffee.image}
                  alt={coffee.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop";
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>

                {/* Badge */}
                {coffee.badge && (
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(coffee.badge)}`}
                    >
                      {coffee.badge}
                    </span>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(coffee.id)}
                  className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${favorites.includes(coffee.id)
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/50 scale-110"
                      : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:shadow-lg hover:scale-110"
                    }`}
                >
                  <LuHeart
                    className={`w-5 h-5 transition-all ${favorites.includes(coffee.id) ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col">
                {/* Title & Description */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-[#2C1A0E] group-hover:text-amber-800 transition-colors mb-1">
                    {coffee.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {coffee.description}
                  </p>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 my-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <LuStar
                        key={i}
                        className={`w-3.5 h-3.5 transition-colors ${i < Math.floor(coffee.rating)
                            ? "text-amber-400 fill-amber-400"
                            : i < coffee.rating
                              ? "text-amber-400"
                              : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {coffee.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({coffee.reviews})
                  </span>
                </div>

                {/* Footer - Price & Action */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      Price
                    </span>
                    <p className="text-2xl font-bold text-[#2C1A0E]">
                      ${coffee.price.toFixed(2)}
                    </p>
                  </div>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-600/40 transition-all duration-300 active:scale-95 group/btn">
                    <LuShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-sm hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-linear-to-b from-amber-50 to-gray-50 rounded-3xl border-2 border-dashed border-amber-200">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <LuShoppingCart className="w-10 h-10 text-amber-700" />
          </div>
          <p className="text-gray-700 text-lg font-semibold">No coffee found</p>
          <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">
            Try adjusting your search or category filter
          </p>
        </div>
      )}
    </div>
  );
}
