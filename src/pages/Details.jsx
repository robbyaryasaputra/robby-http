import { useOutletContext } from "react-router-dom";
import { LuStar, LuClock, LuFlame } from "react-icons/lu";

const coffeeDetails = [
  { id: 1, name: "Americano", origin: "Brazil", roast: "Medium", price: 3.75, rating: 4.6, prepTime: "3 min", calories: 15, description: "A rich, full-bodied coffee made by diluting espresso with hot water.", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=300&fit=crop" },
  { id: 2, name: "Mocha Delight", origin: "Colombia", roast: "Dark", price: 5.00, rating: 4.9, prepTime: "5 min", calories: 290, description: "A chocolate-flavored variant of a latte with espresso and steamed milk.", image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=300&fit=crop" },
  { id: 3, name: "Caramel Macchiato", origin: "Ethiopia", roast: "Light", price: 5.25, rating: 4.8, prepTime: "4 min", calories: 250, description: "Freshly steamed milk with vanilla syrup, marked with espresso and caramel.", image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop" },
  { id: 4, name: "Double Espresso", origin: "Italy", roast: "Dark", price: 4.00, rating: 4.7, prepTime: "2 min", calories: 10, description: "Two shots of concentrated coffee brewed with high pressure.", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop" },
];

export default function Details() {
  const { search } = useOutletContext();

  const filtered = coffeeDetails.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-[#2C1A0E]">Coffee Details</h1>
        <p className="text-sm text-gray-500 mt-1">Explore detailed information about our coffees</p>
      </div>

      <div className="space-y-5">
        {filtered.map((coffee) => (
          <div key={coffee.id} className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all duration-300">
            <div className="sm:w-64 h-48 sm:h-auto overflow-hidden">
              <img src={coffee.image} alt={coffee.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-[#2C1A0E]">{coffee.name}</h3>
                <span className="text-xl font-bold text-amber-700">${coffee.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{coffee.description}</p>
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <LuStar className="w-4 h-4 text-amber-500 fill-amber-500" /> {coffee.rating}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <LuClock className="w-4 h-4 text-blue-500" /> {coffee.prepTime}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <LuFlame className="w-4 h-4 text-red-400" /> {coffee.calories} cal
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">{coffee.origin}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{coffee.roast} Roast</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
