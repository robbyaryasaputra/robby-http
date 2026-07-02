import { LuHeart } from "react-icons/lu";

export default function FavoriteButton({
  isFavorite = false,
  onClick,
  className = "",
  size = "md",
}) {
  const sizes = {
    sm: "p-2 text-sm",
    md: "p-2.5 text-base",
    lg: "p-3.5 text-lg",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={`
        rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:shadow-md
        transition-all duration-300 active:scale-90 cursor-pointer border border-gray-100 focus:outline-none
        ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-400"}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      <LuHeart
        className={`w-5 h-5 transition-all duration-300 ${
          isFavorite ? "fill-red-500 scale-110" : "fill-transparent"
        }`}
      />
    </button>
  );
}
