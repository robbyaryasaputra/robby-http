import { LuPlus } from "react-icons/lu";

export default function FAB({
  icon: Icon = LuPlus,
  onClick,
  label = "",
  position = "bottom-right",
  className = "",
}) {
  const positions = {
    "bottom-right": "fixed bottom-8 right-8 z-40",
    "bottom-left": "fixed bottom-8 left-8 z-40",
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 bg-[#8B5F3C] text-white hover:bg-[#7A5232]
        shadow-xl shadow-[#8B5F3C]/20 transition-all duration-300 active:scale-95
        p-4 rounded-full font-bold cursor-pointer group focus:outline-none
        ${positions[position]}
        ${className}
      `}
    >
      <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
      {label && (
        <span className="text-sm pr-2 font-bold whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}
