import { LuCoins } from "react-icons/lu";
import { SlideUp } from "../../../components/animation";

export default function MemberRewards({
  memberRewards,
  activeMemberProfile,
  onRedeemReward,
  SAMPLE_REWARDS,
}) {
  const rewardsList = memberRewards.length > 0 ? memberRewards : SAMPLE_REWARDS;

  return (
    <SlideUp duration={0.4}>
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6 text-left animate-[fadeIn_0.5s_ease-out]">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-black text-slate-800 text-lg">Tukar Reward Points</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Gunakan poin Anda untuk mengklaim voucher minuman atau makanan gratis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewardsList.map((reward) => {
            const meetsTier = activeMemberProfile
              ? activeMemberProfile.tier_id >= (reward.min_tier_id || 1)
              : false;
            const hasPoints = activeMemberProfile
              ? activeMemberProfile.current_points >= reward.points_required
              : false;
            const isRedeemable = meetsTier && hasPoints;

            return (
              <div
                key={reward.id}
                className="border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-slate-200 transition-colors bg-slate-50/40"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-slate-800 text-sm">{reward.name}</h4>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                        isRedeemable
                          ? "text-amber-700 bg-amber-50 border border-amber-200"
                          : "text-slate-400 bg-slate-50 border border-slate-100"
                      }`}
                    >
                      {reward.points_required} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {reward.description}
                  </p>
                  <div className="flex items-center gap-1 pt-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Syarat Level:
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        meetsTier ? "text-slate-600" : "text-amber-600 font-extrabold"
                      }`}
                    >
                      {reward.min_tier_name || "Bronze"}
                    </span>
                  </div>
                </div>
                <div>
                  {isRedeemable ? (
                    <button
                      onClick={() => onRedeemReward(reward)}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/10 active:scale-[0.98] border-0"
                    >
                      <LuCoins className="w-4 h-4" /> Klaim Sekarang
                    </button>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center text-slate-400 text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5">
                      {!meetsTier ? (
                        <>🔒 Butuh Level {reward.min_tier_name}</>
                      ) : (
                        <>
                          🔒 Poin Kurang{" "}
                          {reward.points_required -
                            (activeMemberProfile?.current_points || 0)}{" "}
                          pts
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SlideUp>
  );
}
