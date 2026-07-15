import {
  LuShoppingCart,
  LuX,
  LuMinus,
  LuPlus,
  LuTrash2,
  LuTag,
  LuUtensils,
  LuMapPin,
  LuCreditCard,
} from "react-icons/lu";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveFromCart,
  promoCode,
  setPromoCode,
  onApplyPromo,
  appliedPromo,
  promoError,
  subtotal,
  tax,
  promoDiscount,
  total,
  checkoutForm,
  setCheckoutForm,
  onSubmitOrder,
}) {
  if (!isOpen) return null;

  const formatIDR = (p) => {
    return `$${Number(p).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg bg-[#F9F5EE] h-full shadow-2xl flex flex-col z-10 border-l border-[#EBE3D5] animate-[slideInRight_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-white border-b border-[#EBE3D5] px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LuShoppingCart className="w-5.5 h-5.5 text-[#855C3B]" />
            <h3 className="font-extrabold text-lg text-[#4B2C20]">
              Keranjang Pemesanan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-[#4B2C20] hover:bg-gray-100 transition-all duration-200 cursor-pointer"
          >
            <LuX className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Scrollable list & checkout form */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {cart.length > 0 ? (
            <>
              {/* Cart Items list */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#4B2C20] text-sm text-left">
                  Item yang Dipilih:
                </h4>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#EBE3D5] p-4 flex gap-4 items-center shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 space-y-1 text-left">
                        <h5 className="font-bold text-sm text-[#4B2C20]">
                          {item.name}
                        </h5>
                        <span className="text-xs text-gray-500 font-bold">
                          {formatIDR(item.price)}
                        </span>
                      </div>

                      {/* Qty edit buttons */}
                      <div className="flex items-center border border-[#EBE3D5] rounded-xl bg-[#F9F5EE] p-1">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="p-1 text-[#855C3B] hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <LuMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="p-1 text-[#855C3B] hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <LuPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <LuTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="bg-white rounded-2xl border border-[#EBE3D5] p-5 space-y-2 text-left">
                <span className="text-xs font-bold text-[#4B2C20] block">
                  Kode Voucher / Promo
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: KOPI50"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-[#F9F5EE] border border-[#EBE3D5] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20 animate-none"
                  />
                  <button
                    type="button"
                    onClick={() => onApplyPromo(promoCode)}
                    className="bg-[#855C3B] hover:bg-[#6d4734] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Pakai
                  </button>
                </div>
                {promoError && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">
                    {promoError}
                  </p>
                )}
                {appliedPromo && (
                  <p className="text-[10px] font-semibold text-emerald-600 mt-1">
                    Promo {appliedPromo.code} Aktif: Potongan{" "}
                    {appliedPromo.discount_type === "percentage"
                      ? `${appliedPromo.discount_value}%`
                      : formatIDR(appliedPromo.discount_value)}
                    !
                  </p>
                )}
              </div>

              {/* Summary Pricing */}
              <div className="bg-white rounded-2xl border border-[#EBE3D5] p-5 space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Pajak & Layanan (10%)</span>
                  <span>{formatIDR(tax)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between items-center text-red-500 font-medium">
                    <span className="flex items-center gap-1">
                      <LuTag className="w-3.5 h-3.5" />
                      Diskon Voucher ({appliedPromo.code})
                    </span>
                    <span>-{formatIDR(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 font-black text-[#2C1A0E] text-base">
                  <span>Total Biaya</span>
                  <span>{formatIDR(total)}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <form
                onSubmit={onSubmitOrder}
                className="bg-white rounded-2xl border border-[#EBE3D5] p-5 space-y-4 text-left"
              >
                <h4 className="font-extrabold text-[#4B2C20] text-sm pb-2 border-b border-gray-100">
                  Informasi Pemesanan:
                </h4>

                {/* Customer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">
                    NAMA PELANGGAN
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap..."
                    value={checkoutForm.name}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20"
                  />
                </div>

                {/* Delivery type selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">
                    LAYANAN PENYAJIAN
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setCheckoutForm({
                          ...checkoutForm,
                          deliveryType: "table",
                        })
                      }
                      className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${checkoutForm.deliveryType === "table"
                        ? "bg-[#855C3B]/10 border-[#855C3B] text-[#855C3B]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      <LuUtensils className="w-4 h-4" />
                      Makan di Meja
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCheckoutForm({
                          ...checkoutForm,
                          deliveryType: "takeaway",
                        })
                      }
                      className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${checkoutForm.deliveryType === "takeaway"
                        ? "bg-[#855C3B]/10 border-[#855C3B] text-[#855C3B]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      <LuMapPin className="w-4 h-4" />
                      Bawa Pulang
                    </button>
                  </div>
                </div>

                {/* Table Number (conditional) */}
                {checkoutForm.deliveryType === "table" && (
                  <div className="space-y-1.5 animate-[fadeIn_0.3s_ease-out]">
                    <label className="text-xs font-bold text-gray-600 block">
                      NOMOR MEJA
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 05, 12, VIP-1..."
                      value={checkoutForm.tableNumber}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          tableNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20"
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">
                    METODE PEMBAYARAN
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Cash", "QRIS", "Card"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          setCheckoutForm({
                            ...checkoutForm,
                            paymentMethod: method,
                          })
                        }
                        className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${checkoutForm.paymentMethod === method
                          ? "bg-[#855C3B] text-white border-[#855C3B] shadow-sm"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        {method === "Card" && (
                          <LuCreditCard className="w-3.5 h-3.5" />
                        )}
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 block">
                    CATATAN KHUSUS (OPSIONAL)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Contoh: Kurangi gula, es batu dipisah..."
                    value={checkoutForm.notes}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#F9F5EE] border border-[#EBE3D5] text-[#2C1A0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#855C3B]/20 resize-none"
                  />
                </div>

                {/* Place order button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#855C3B] hover:bg-[#5F3A27] text-white font-extrabold text-sm transition-all duration-300 shadow-md shadow-[#855C3B]/10 active:scale-[0.98] mt-6 cursor-pointer"
                >
                  Konfirmasi & Kirim Pesanan
                </button>
              </form>

              {/* Alternative Food Delivery platforms */}
              <div className="border-t border-[#EBE3D5] pt-6 mt-6 space-y-3">
                <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-wider text-left">
                  Atau Pesan via Platform Pengiriman Lain:
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href="https://gofood.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 bg-[#E62E2D]/5 hover:bg-[#E62E2D]/10 text-[#E62E2D] border border-[#E62E2D]/20 rounded-xl font-bold text-[11px] text-center transition-all duration-200 active:scale-[0.97]"
                  >
                    GoFood
                  </a>
                  <a
                    href="https://grab.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 bg-[#00B14F]/5 hover:bg-[#00B14F]/10 text-[#00B14F] border border-[#00B14F]/20 rounded-xl font-bold text-[11px] text-center transition-all duration-200 active:scale-[0.97]"
                  >
                    GrabFood
                  </a>
                  <a
                    href="https://shopee.co.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 bg-[#EE4D2D]/5 hover:bg-[#EE4D2D]/10 text-[#EE4D2D] border border-[#EE4D2D]/20 rounded-xl font-bold text-[11px] text-center transition-all duration-200 active:scale-[0.97]"
                  >
                    ShopeeFood
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="py-24 text-center space-y-4 max-w-xs mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#FAF4EE] text-gray-400 flex items-center justify-center mx-auto">
                <LuShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-[#4B2C20]">
                Keranjang Masih Kosong
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                Anda belum memasukkan menu kopi apa pun. Buka katalog menu
                kami di bawah dan mulailah berbelanja!
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-6 bg-[#855C3B] text-white hover:bg-[#5F3A27] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Mulai Belanja
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
