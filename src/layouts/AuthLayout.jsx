import { Outlet } from "react-router-dom";
import { LuCoffee } from "react-icons/lu";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#f5eadb] relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1/2 bg-[#fff8f2]"></div>
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[#33251f]"></div>
      <div className="absolute top-16 left-16 w-72 h-72 bg-[#d99032]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-16 right-16 w-96 h-96 bg-[#f0c46a]/15 rounded-full blur-3xl"></div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[minmax(420px,480px)_minmax(520px,1fr)]">
        <div className="rounded-[2rem] bg-[#fdf7ed] p-8 shadow-[0_40px_120px_rgba(15,23,42,0.12)] border border-slate-200/60">
          <Outlet />
        </div>

        <div className="flex flex-col justify-center rounded-[2rem] bg-[#362516] p-12 text-white shadow-[0_40px_120px_rgba(15,23,42,0.22)] overflow-hidden">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-amber-500/20 text-amber-100 shadow-lg shadow-amber-500/10 mb-8">
            <LuCoffee className="h-7 w-7" />
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Coffee Shop
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">
            Track sales, manage inventory, and delight your customers with an elegant admin dashboard built for fast service and reliable control.
          </p>

          <div className="mt-10 grid gap-4 text-sm text-white/70">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold text-white">Sales insights</p>
              <p className="mt-2 text-white/70">Pantau kinerja penjualan dan update menu secara real-time.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold text-white">Stock management</p>
              <p className="mt-2 text-white/70">Kelola bahan baku, pesanan, dan permintaan pelanggan dengan mudah.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
