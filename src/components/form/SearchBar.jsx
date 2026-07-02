import { LuSearch } from "react-icons/lu";

export default function SearchBar({
  id = "search-bar",
  value = "",
  onChange,
  placeholder = "Search for coffee...",
  className = "",
  ...props
}) {
  return (
    <div className={`relative flex-1 max-w-2xl ${className}`}>
      <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#BF834F] focus:ring-2 focus:ring-[#E7D4B0] transition-all duration-300"
        {...props}
      />
    </div>
  );
}
