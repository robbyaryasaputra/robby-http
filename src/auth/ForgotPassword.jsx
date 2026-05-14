import { Link } from "react-router-dom";
import { LuMail, LuArrowLeft } from "react-icons/lu";

export default function ForgotPassword() {
  return (
    <div className="animate-[fadeIn_0.6s_ease-out]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
        <p className="text-sm text-amber-200/70 mt-2">
          Masukkan email Anda dan kami akan mengirimkan instruksi untuk mereset
          kata sandi.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        <form className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-amber-200/80 mb-2">
              Email Address
            </label>
            <div className="relative">
              <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/50" />
              <input
                type="email"
                placeholder="admin@coffeeshop.com"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-amber-500 to-amber-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-600/30 transition-all duration-300"
          >
            Send reset link
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
          >
            <LuArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
