import { LuHistory } from "react-icons/lu";
import { SlideUp } from "../../../components/animation";

export default function MemberTransactions({ transactions }) {
  return (
    <SlideUp duration={0.4}>
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6 text-left animate-[fadeIn_0.5s_ease-out]">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-black text-slate-800 text-lg">Riwayat Mutasi Poin</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Catatan penambahan dan penukaran point loyalti Anda.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center space-y-2">
            <LuHistory className="w-10 h-10 text-slate-200" />
            <p className="text-xs font-medium">Belum ada transaksi poin tersedia</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Jumlah</th>
                  <th className="px-4 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {transactions.map((tx) => {
                  const isPositive = tx.type === "earn";
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            isPositive
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-rose-50 text-rose-500 border border-rose-100"
                          }`}
                        >
                          {tx.type === "earn"
                            ? "Belanja"
                            : tx.type === "redeem"
                              ? "Tukar"
                              : "Koreksi"}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3.5 font-bold text-sm ${
                          isPositive ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {isPositive ? `+${tx.points}` : tx.points}{" "}
                        <span className="text-[10px] font-semibold text-slate-400">
                          pts
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 break-words leading-relaxed max-w-[220px]">
                        {tx.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SlideUp>
  );
}
