import { useState } from "react";
import {
  LuStar,
  LuHeart,
  LuTrash2,
  LuShoppingCart,
  LuDownload,
} from "react-icons/lu";

const favoriteCoffees = [
  {
    id: 1,
    name: "Caramel Macchiato",
    price: 5.25,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop",
    category: "Hot",
    addedAt: "2 days ago",
    description: "Sweet caramel with espresso",
  },
  {
    id: 2,
    name: "Mocha Delight",
    price: 5.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1570968015861-ad48c34c1160?w=400&h=300&fit=crop",
    category: "Hot",
    addedAt: "5 days ago",
    description: "Rich chocolate and espresso blend",
  },
  {
    id: 5,
    name: "Vanilla Latte",
    price: 4.75,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=300&fit=crop",
    category: "Hot",
    addedAt: "1 week ago",
    description: "Smooth vanilla-infused latte",
  },
  {
    id: 6,
    name: "Iced Cappuccino",
    price: 4.5,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop",
    category: "Iced",
    addedAt: "3 days ago",
    description: "Refreshing iced cappuccino",
  },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(favoriteCoffees);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2C1A0E]">Favorites</h1>
          <p className="text-sm text-gray-500 mt-1">
            {favorites.length} favorite coffee{" "}
            {favorites.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        {favorites.length > 0 && (
          <button className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-600/40 transition-all duration-300 active:scale-95 w-full sm:w-auto justify-center">
            <LuDownload className="w-4 h-4" />
            Export List
          </button>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((coffee, index) => (
            <div
              key={coffee.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-amber-200"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={coffee.image}
                  alt={coffee.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop";
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-block px-3 py-1 bg-amber-500/90 text-white text-xs font-bold rounded-full">
                    {coffee.category}
                  </span>
                </div>

                {/* Heart Icon */}
                <div className="absolute top-3 left-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                    <LuHeart className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col">
                {/* Title */}
                <h2 className="text-lg font-bold text-[#2C1A0E] group-hover:text-amber-800 transition-colors mb-2">
                  {coffee.name}
                </h2>

                {/* Rating & Meta */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <LuStar
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(coffee.rating)
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
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    Saved {coffee.addedAt}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 flex-1">
                  {coffee.description || "Premium quality coffee item"}
                </p>

                {/* Footer - Price & Actions */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      Price
                    </span>
                    <p className="text-2xl font-bold text-[#2C1A0E]">
                      ${coffee.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center justify-center gap-1 px-3 py-2.5 bg-linear-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-amber-600/30 transition-all duration-300 active:scale-95">
                      <LuShoppingCart className="w-4 h-4" />
                      <span className="text-xs hidden sm:inline">Buy</span>
                    </button>
                    <button
                      onClick={() => removeFavorite(coffee.id)}
                      className="flex items-center justify-center p-2.5 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all duration-300 hover:shadow-md"
                      title="Remove from favorites"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-linear-to-b from-amber-50 via-gray-50 to-gray-50 rounded-3xl border-2 border-dashed border-amber-200">
          <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-lg shadow-amber-200/50">
            <LuHeart className="w-12 h-12 text-amber-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Favorites Yet
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-6">
            Add coffee items to your favorites by clicking the heart icon on the
            Menu page. Your favorite items will appear here.
          </p>
          <a
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-600/40 transition-all duration-300 active:scale-95"
          >
            <LuShoppingCart className="w-4 h-4" />
            Browse Menu
          </a>
        </div>
      )}
    </div>
  );
}
