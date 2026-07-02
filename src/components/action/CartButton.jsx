import { LuShoppingCart } from "react-icons/lu";

export default function CartButton({ count = 0, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-3 rounded-full bg-[#FAF6F0] text-[#8B5F3C] border border-[#E7D4B0]/40
        hover:bg-[#F5EDE3] transition-all duration-300 active:scale-95 cursor-pointer focus:outline-none
        ${className}
      `}
    >
      <LuShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span
          className="
            absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white
            text-[10px] font-extrabold flex items-center justify-center border border-white
            animate-pulse
          "
        >
          {count}
        </span>
      )}
    </button>
  );
}
