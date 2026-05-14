import { Outlet } from "react-router-dom";
import { LuCoffee } from "react-icons/lu";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E1210] via-[#2C1A0E] to-[#3D2518] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-amber-700/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl"></div>

      {/* Coffee beans pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-[10%] text-amber-200">
          <LuCoffee className="w-8 h-8 rotate-12" />
        </div>
        <div className="absolute top-[30%] right-[15%] text-amber-200">
          <LuCoffee className="w-6 h-6 -rotate-12" />
        </div>
        <div className="absolute bottom-[20%] left-[20%] text-amber-200">
          <LuCoffee className="w-10 h-10 rotate-45" />
        </div>
        <div className="absolute top-[60%] right-[30%] text-amber-200">
          <LuCoffee className="w-7 h-7 -rotate-30" />
        </div>
      </div>

      {/* Auth Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Outlet />
      </div>
    </div>
  );
}
