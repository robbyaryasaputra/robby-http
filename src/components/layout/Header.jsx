import { useState, useEffect, useCallback } from "react";
import { SearchBar } from "../form";
import { CartButton } from "../action";
import { Avatar } from "../media";
import { Link } from "react-router-dom";
import { LuExternalLink } from "react-icons/lu";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function Header({ search, setSearch }) {
  const { profile } = useAuth();
  
  const userName = profile?.name || "Admin User";
  const userRole = profile?.role || "admin";

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
        <Link
          to="/"
          className="flex items-center gap-1.5 px-4 py-2 border border-[#855C3B]/25 text-[#855C3B] hover:bg-[#FAF4EE] rounded-full text-xs font-bold transition-all"
        >
          View Shop
          <LuExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-slate-800">{userName}</div>
            <div className="text-xs font-medium text-slate-500 capitalize">{userRole}</div>
          </div>
          <Avatar name={userName} size="md" className="ring-2 ring-white shadow-md" />
        </div>
      </div>
    </header>
  );
}