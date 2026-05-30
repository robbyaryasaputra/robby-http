import { SearchBar } from "./4-form";
import { CartButton } from "./13-action";
import { Avatar } from "./11-media";

export default function Header({ search, setSearch }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Search Bar */}
      <SearchBar
        id="header-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for coffee..."
      />

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        <CartButton count={3} id="header-cart" />

        <div id="header-profile">
          <Avatar name="Admin User" size="md" className="cursor-pointer hover:shadow-lg transition-shadow duration-300" />
        </div>
      </div>
    </header>
  );
}