import { LuAward, LuCheck } from "react-icons/lu";

export default function MemberBenefits({ activeMemberProfile }) {
  if (!activeMemberProfile) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mt-6 text-left animate-[fadeIn_0.5s_ease-out]">
      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100 mb-4 flex items-center gap-1.5">
        <LuAward className="w-4 h-4 text-amber-600" /> Benefit Level{" "}
        {activeMemberProfile.tier.name}
      </h4>
      <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
        {activeMemberProfile.tier.benefits.map((benefit, i) => (
          <li key={i} className="flex items-start gap-2">
            <LuCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
