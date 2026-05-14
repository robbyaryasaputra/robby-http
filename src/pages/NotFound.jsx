import { Link } from "react-router-dom";
import { LuCoffee, LuArrowLeft } from "react-icons/lu";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center animate-pulse">
          <LuCoffee className="w-16 h-16 text-amber-600" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-500 font-bold text-lg">?</span>
        </div>
      </div>

      <h1 className="text-7xl font-bold text-[#2C1A0E] mb-3">404</h1>
      <h2 className="text-xl font-semibold text-gray-600 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-400 text-center max-w-sm mb-8">
        Oops! The page you're looking for seems to have spilled. Let's get you
        back to the coffee shop.
      </p>

      <Link
        to="/"
        id="back-home-btn"
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full font-medium hover:shadow-lg hover:shadow-amber-200 transition-all duration-300"
      >
        <LuArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
