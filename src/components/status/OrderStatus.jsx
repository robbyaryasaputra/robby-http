import { LuCheck } from "react-icons/lu";

export default function OrderStatus({
  steps = [
    { title: "Order Placed", desc: "10:30 AM", status: "completed" },
    { title: "Brewing Coffee", desc: "10:35 AM", status: "completed" },
    { title: "Quality Check", desc: "10:38 AM", status: "active" },
    { title: "Ready for Pickup", desc: "Pending", status: "pending" },
  ],
  className = "",
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = step.status === "completed";
        const isActive = step.status === "active";
        
        return (
          <div key={idx} className="relative flex items-start gap-4 group">
            {/* Vertical Line */}
            {idx !== steps.length - 1 && (
              <div
                className={`
                  absolute left-4.5 top-8 w-0.5 h-10 -ml-[1px]
                  ${isCompleted ? "bg-[#8B5F3C]" : "bg-gray-200"}
                `}
              />
            )}

            {/* Stepper Dot */}
            <div
              className={`
                w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300
                ${isCompleted 
                  ? "bg-[#8B5F3C] border-[#8B5F3C] text-white" 
                  : isActive 
                    ? "bg-white border-[#8B5F3C] text-[#8B5F3C] shadow-md shadow-[#8B5F3C]/10" 
                    : "bg-white border-gray-200 text-gray-400"
                }
              `}
            >
              {isCompleted ? (
                <LuCheck className="w-4 h-4" />
              ) : (
                <span className="text-xs font-bold">{idx + 1}</span>
              )}
            </div>

            {/* Step Info */}
            <div className="flex flex-col pt-1">
              <span
                className={`
                  text-sm font-bold transition-colors duration-300
                  ${isCompleted || isActive ? "text-[#2C1A0E]" : "text-gray-400"}
                `}
              >
                {step.title}
              </span>
              {step.desc && (
                <span className="text-xs font-medium text-gray-405 text-gray-400 mt-0.5">
                  {step.desc}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
