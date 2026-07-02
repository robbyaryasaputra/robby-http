import { LuCoffee } from "react-icons/lu";

export default function CoffeeLoader({
  label = "Brewing your experience...",
  fullScreen = false,
  className = "",
}) {
  const containerClass = fullScreen
    ? "fixed inset-0 z-50 bg-[#fff8f2] flex flex-col justify-center items-center"
    : "flex flex-col justify-center items-center py-12";

  return (
    <div className={`${containerClass} ${className}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes steam {
          0% {
            transform: translateY(0) scaleX(1);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) scaleX(1.2);
            opacity: 0.3;
          }
          95% {
            opacity: 0;
          }
          100% {
            transform: translateY(-20px) scaleX(1.5);
            opacity: 0;
          }
        }
        .steam-line {
          animation: steam 2s infinite ease-out;
        }
        .steam-line:nth-child(2) {
          animation-delay: 0.4s;
        }
        .steam-line:nth-child(3) {
          animation-delay: 0.8s;
        }
      `}} />
      
      <div className="relative flex flex-col items-center">
        {/* Steam */}
        <div className="flex gap-1.5 mb-2 h-6">
          <span className="steam-line w-1 h-5 bg-[#C4A88A] rounded-full blur-[1px]" />
          <span className="steam-line w-1 h-5 bg-[#C4A88A] rounded-full blur-[1px]" />
          <span className="steam-line w-1 h-5 bg-[#C4A88A] rounded-full blur-[1px]" />
        </div>
        
        {/* Coffee Cup Icon */}
        <div className="w-16 h-16 rounded-3xl bg-[#8B5F3C] flex items-center justify-center shadow-lg shadow-[#8B5F3C]/20 animate-bounce">
          <LuCoffee className="w-8 h-8 text-white" />
        </div>
        
        {label && (
          <p className="mt-5 text-[#8B5F3C] text-sm font-bold tracking-wide uppercase animate-pulse">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
