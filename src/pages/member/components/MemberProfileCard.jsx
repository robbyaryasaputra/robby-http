import { LuCoffee, LuAward } from "react-icons/lu";

export default function MemberProfileCard({
  activeMemberProfile,
  activeUser,
  nextTierInfo,
}) {
  if (!activeMemberProfile) return null;

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br ${activeMemberProfile.tier.bg_gradient} p-6 text-white shadow-xl relative overflow-hidden border border-white/5 animate-[fadeIn_0.5s_ease-out]`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-6 -mb-6"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/15 px-2.5 py-0.5 rounded-md border border-white/10">
          Loyalty Member Card
        </span>
        <LuCoffee className="w-6 h-6 text-white/30" />
      </div>

      <div className="mb-8 relative z-10 text-left">
        <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">
          Nama Pelanggan
        </span>
        <h3 className="text-lg font-black tracking-wide leading-none">
          {activeUser?.name}
        </h3>
        <span className="text-[10px] text-white/40 block mt-1 font-mono tracking-wider">
          {activeMemberProfile.member_code}
        </span>
      </div>

      <div className="flex justify-between items-end relative z-10 pt-4 border-t border-white/10">
        <div className="text-left">
          <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">
            Status Level
          </span>
          <span className="inline-flex items-center gap-1 mt-0.5 text-xs font-black tracking-wider px-2 py-0.5 rounded bg-white text-slate-800 shadow-sm border border-slate-100">
            <LuAward
              className="w-3.5 h-3.5"
              style={{ color: activeMemberProfile.tier.badge_color }}
            />
            {activeMemberProfile.tier.name}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">
            Poin Aktif
          </span>
          <span className="text-xl font-black tracking-wide text-amber-300">
            {activeMemberProfile.current_points}{" "}
            <span className="text-[10px] text-white/80 font-bold">pts</span>
          </span>
        </div>
      </div>

      {/* Progress bar info */}
      {nextTierInfo && (
        <div className="mt-5 pt-4 border-t border-white/5 relative z-10 space-y-1.5 text-left">
          <div className="flex justify-between items-center text-[10px] font-bold text-white/70">
            <span>Progress ke {nextTierInfo.name}</span>
            <span>
              {activeMemberProfile.total_points} / {nextTierInfo.targetPoints} pts
            </span>
          </div>
          <div className="w-full bg-black/25 h-1.5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${nextTierInfo.percent}%` }}
            />
          </div>
          <p className="text-[10px] text-white/50 font-medium pt-0.5">
            Butuh {nextTierInfo.pointsNeeded} poin lagi untuk naik tingkat.
          </p>
        </div>
      )}
    </div>
  );
}
