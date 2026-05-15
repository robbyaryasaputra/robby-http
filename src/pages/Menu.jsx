import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LuStar, LuHeart, LuShoppingCart } from "react-icons/lu";

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

  const filteredMenu = coffeeMenu.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Hero Card */}
      <div className="rounded-[2rem] bg-gradient-to-br from-[#8B5F3C] to-[#6A3F27] p-8 text-white shadow-[0_30px_80px_rgba(34,20,14,0.18)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1.4fr] gap-8 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#f5e9dd] opacity-90 mb-3">
              Good Morning
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
              Grab Your Coffee Today
            </h1>
            <p className="mt-4 max-w-xl text-sm text-[#f2dfca] leading-7">
              Discover the best coffee flavors for your mood, with handcrafted blends and fast delivery.
            </p>
            <button className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#5F3A27] shadow-lg shadow-[#472F1E]/20 hover:bg-slate-50 transition-all duration-300">
              Order Now
            </button>
          </div>
          <div className="rounded-[2rem] overflow-hidden bg-[#020202]/5 shadow-inner shadow-black/10">
            <img
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop"
              alt="Coffee cup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase()}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${
              activeCategory === cat
                ? "bg-[#4E3423] text-white shadow-[0_15px_40px_rgba(78,52,35,0.12)]"
                : "bg-white text-[#6B4A36] border border-[#E4D7C9] hover:border-[#C1A385] hover:bg-[#FBF6F0]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Coffee Grid */}
      {filteredMenu.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMenu.map((coffee, index) => (
            <div
              key={coffee.id}
              className="group relative overflow-hidden rounded-[2rem] border border-[#EEE3D8] bg-white shadow-[0_20px_40px_rgba(34,20,14,0.06)] transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative h-64 overflow-hidden rounded-t-[2rem] bg-slate-100">
                <img
                  src={coffee.image}
                  alt={coffee.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                {coffee.badge && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getBadgeColor(coffee.badge)}`}
                    >
                      {coffee.badge}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(coffee.id)}
                  className={`absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
                    favorites.includes(coffee.id)
                      ? "bg-[#D16A4D] text-white shadow-lg shadow-[#D16A4D]/25"
                      : "bg-white/90 text-[#6B4A36] hover:bg-white shadow-sm"
                  }`}
                >
                  <LuHeart className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-[#3F2A1E]">{coffee.name}</h3>
                  <p className="text-lg font-bold text-[#5C3D2A]">${coffee.price.toFixed(2)}</p>
                </div>
                <p className="text-sm leading-6 text-[#7A604F] mb-5">{coffee.description}</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <LuStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(coffee.rating) ? "text-[#D28D52]" : "text-[#E9DBD0]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[#6C4A34]">
                      {coffee.rating}
                    </span>
                  </div>
                  <span className="text-sm text-[#A98968]">{coffee.reviews} reviews</span>
                </div>
                <button className="mt-6 w-full rounded-full bg-[#8B5F3C] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7b5237]/20 hover:bg-[#7f5032] transition-all duration-300">
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-[#D8C7B2] bg-[#FFF8F1] p-10 text-center text-[#6B5443]">
          <p className="text-lg font-semibold">No coffee found</p>
          <p className="mt-2 text-sm text-[#8E7A6A]">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}
