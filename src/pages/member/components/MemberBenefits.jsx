import { LuAward, LuCheck, LuStar, LuTrendingUp, LuPercent, LuCoins, LuZap } from "react-icons/lu";

const TIER_META = {
  Bronze: { gradient: "from-amber-600 to-amber-800", icon: "🥉", ring: "ring-amber-300", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  Silver: { gradient: "from-slate-400 to-slate-600", icon: "🥈", ring: "ring-slate-300", badge: "bg-slate-100 text-slate-700 border-slate-300" },
  Gold:   { gradient: "from-yellow-400 to-amber-500", icon: "🥇", ring: "ring-yellow-300", badge: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  Platinum: { gradient: "from-purple-500 to-slate-700", icon: "💎", ring: "ring-purple-300", badge: "bg-purple-100 text-purple-800 border-purple-300" },
};

const NEXT_TIER = { Bronze: "Silver", Silver: "Gold", Gold: "Platinum", Platinum: null };

export default function MemberBenefits({ activeMemberProfile }) {
  if (!activeMemberProfile) return null;

  const tierName = activeMemberProfile.tier?.name || "Bronze";
  const meta = TIER_META[tierName] || TIER_META.Bronze;
  const nextTierName = NEXT_TIER[tierName];
  const nextMeta = nextTierName ? TIER_META[nextTierName] : null;

  const discount = activeMemberProfile.tier?.discount_percent ?? 0;
  const multiplier = activeMemberProfile.tier?.points_multiplier ?? 1.0;

  return (
    <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
      {/* Active Tier Stats */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Bar */}
        <div className={`bg-gradient-to-r ${meta.gradient} px-5 py-3.5 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.icon}</span>
            <div>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Level Aktif</p>
              <h4 className="text-sm font-black text-white tracking-wide">{tierName} Member</h4>
            </div>
          </div>
          <LuAward className="w-5 h-5 text-white/40" />
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
          <div className="px-4 py-3.5 text-left">
            <div className="flex items-center gap-1.5 mb-1">
              <LuPercent className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auto Diskon</span>
            </div>
            <p className="text-xl font-black text-slate-800">
              {discount > 0 ? `${discount}%` : <span className="text-sm font-bold text-slate-400">—</span>}
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">setiap pembelian</p>
          </div>
          <div className="px-4 py-3.5 text-left">
            <div className="flex items-center gap-1.5 mb-1">
              <LuCoins className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Poin Multiplier</span>
            </div>
            <p className="text-xl font-black text-slate-800">{multiplier}x</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">dari setiap transaksi</p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <LuStar className="w-3.5 h-3.5 text-amber-500" /> Keuntungan Level Ini
          </p>
          <ul className="space-y-2">
            {(activeMemberProfile.tier?.benefits || []).map((benefit, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <LuCheck className="w-2.5 h-2.5 text-emerald-600" />
                </div>
                <span className="text-xs text-slate-600 font-medium leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Tier Preview (if not Platinum) */}
      {nextTierName && nextMeta && (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-4 text-left">
          <div className="flex items-center gap-2 mb-3">
            <LuTrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Level Berikutnya
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${nextMeta.gradient} flex items-center justify-center text-lg shadow-md`}>
              {nextMeta.icon}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">{nextTierName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${nextMeta.badge}`}>
                  <LuZap className="inline w-2.5 h-2.5 mr-0.5" />
                  Diskon lebih besar
                </span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-3 leading-relaxed">
            Kumpulkan lebih banyak poin untuk membuka level <strong>{nextTierName}</strong> dan
            nikmati diskon otomatis yang lebih besar serta multiplier poin eksklusif.
          </p>
        </div>
      )}

      {/* Platinum badge if at top */}
      {!nextTierName && (
        <div className="bg-gradient-to-r from-purple-500/10 to-slate-700/10 rounded-3xl border border-purple-200/40 p-4 text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <div>
              <p className="text-sm font-black text-purple-800">Platinum Member</p>
              <p className="text-[10px] text-purple-600 font-medium">Level tertinggi — Anda sudah di puncak!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
