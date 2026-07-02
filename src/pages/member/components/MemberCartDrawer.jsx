import {
  LuShoppingCart,
  LuX,
  LuMinus,
  LuPlus,
  LuTrash2,
  LuCreditCard,
  LuAward,
  LuTag,
  LuCoins,
  LuCircleCheck,
} from "react-icons/lu";

export default function MemberCartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveFromCart,
  activeMemberProfile,
  checkoutForm,
  setCheckoutForm,
  promoCode,
  setPromoCode,
  onApplyPromo,
  appliedPromo,
  promoError,
  subtotal,
  discount,
  promoDiscount,
  total,
  estimatedPoints,
  onSubmitCheckout,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-[#FAF4EE] w-full max-w-md h-full flex flex-col p-6 shadow-2xl animate-[slideLeft_0.3s_ease-out] relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <LuShoppingCart className="w-5 h-5 text-[#855C3B]" />
            <h3 className="font-extrabold text-slate-800 text-lg">Keranjang Belanja</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center font-bold text-slate-500 hover:text-slate-800 cursor-pointer border-0 bg-transparent"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-2">
              <LuShoppingCart className="w-12 h-12 text-slate-200" />
              <p className="text-xs font-semibold">Keranjang Anda masih kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl bg-slate-50"
                />
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    IDR {Number(item.price).toLocaleString("id-ID")} / item
                  </p>
                  <span className="text-xs font-extrabold text-[#855C3B] block mt-0.5">
                    IDR {Number(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-6 h-6 rounded-lg hover:bg-white text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors border-0 bg-transparent"
                  >
                    <LuMinus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black text-slate-700 w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-6 h-6 rounded-lg hover:bg-white text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors border-0 bg-transparent"
                  >
                    <LuPlus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="p-2 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 shrink-0 cursor-pointer transition-colors border-0 bg-transparent"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary Form & Pricing */}
        {cart.length > 0 && activeMemberProfile && (
          <form onSubmit={onSubmitCheckout} className="border-t border-slate-100 pt-4 space-y-4">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex gap-2">
                <label className="flex-1 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Pengantaran
                  </span>
                  <select
                    value={checkoutForm.deliveryType}
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({ ...prev, deliveryType: e.target.value }))
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none hover:cursor-pointer"
                  >
                    <option value="dine_in">Dine In (Meja)</option>
                    <option value="takeaway">Takeaway (Bawa Pulang)</option>
                  </select>
                </label>
                {checkoutForm.deliveryType === "dine_in" && (
                  <label className="w-24 text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      No Meja
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5"
                      value={checkoutForm.tableNumber}
                      onChange={(e) =>
                        setCheckoutForm((prev) => ({ ...prev, tableNumber: e.target.value }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold focus:outline-none"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Metode Pembayaran
              </span>
              <div className="grid grid-cols-2 gap-2">
                {["Cash", "QRIS", "Card", "Member Balance"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() =>
                      setCheckoutForm((prev) => ({ ...prev, paymentMethod: method }))
                    }
                    className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${
                      checkoutForm.paymentMethod === method
                        ? "bg-[#855C3B] text-white border-[#855C3B] shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {method === "Card" && <LuCreditCard className="w-3.5 h-3.5" />}
                    {method === "Member Balance" && <LuAward className="w-3.5 h-3.5" />}
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Kode Voucher / Promo
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="E.G. COFFEEBARU"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wide focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onApplyPromo(promoCode)}
                  className="px-4 bg-[#4B2C20] hover:bg-[#3f2419] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer border-0"
                >
                  Gunakan
                </button>
              </div>
              {promoError && (
                <p className="text-[10px] text-rose-500 font-bold">{promoError}</p>
              )}
            </div>

            <div className="border-t border-b border-dashed border-slate-200 py-3 space-y-1.5 text-xs font-medium text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-700 font-semibold">
                  IDR {Number(subtotal).toLocaleString("id-ID")}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>
                    Diskon Level ({activeMemberProfile.tier.name}{" "}
                    {activeMemberProfile.tier.discount_percent}%)
                  </span>
                  <span>
                    -IDR {Number(discount).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              {appliedPromo && (
                <div className="flex justify-between text-red-500">
                  <span className="flex items-center gap-1">
                    <LuTag className="w-3.5 h-3.5" /> Diskon Voucher ({appliedPromo.code})
                  </span>
                  <span>
                    -IDR {Number(promoDiscount).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-sm font-extrabold text-slate-800">
                <span>Total Pembayaran</span>
                <span className="text-[#855C3B] font-black">
                  IDR {Number(total).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-100/50 flex items-center justify-between mt-2.5 font-bold">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
                  <LuCoins className="w-4 h-4 text-emerald-600 animate-bounce" /> Poin Diperoleh
                  ({activeMemberProfile.tier.points_multiplier}x multiplier)
                </span>
                <span>+{estimatedPoints} pts</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#855C3B] hover:bg-[#6d4734] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#855C3B]/20 cursor-pointer border-0"
            >
              <LuCircleCheck className="w-4.5 h-4.5" /> Konfirmasi Order
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
