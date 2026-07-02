import { LuCoffee } from "react-icons/lu";

export default function FooterSection({ className = "" }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`mt-auto border-t border-gray-100 bg-white/50 px-6 py-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <LuCoffee className="w-4 h-4 text-amber-600" />
          <span>
            © {currentYear} <strong className="text-[#2C1A0E]">Coffee Shop</strong>. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <a href="#" className="hover:text-amber-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}
