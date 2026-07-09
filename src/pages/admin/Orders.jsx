import { useState, useEffect } from "react";
import ordersData from "../../data/orders.json";
import { supabase } from "../../lib/supabase";
import { PageHeader } from "../../components/section";
import { Table, Tooltip } from "../../components/data-display";
import { TabBar, Breadcrumb } from "../../components/navigation";
import {
  StatusBadge,
  PaymentBadge,
  OrderStatus,
} from "../../components/status";
import { Drawer } from "../../components/overlay";
import { Heading, Caption } from "../../components/typography";
import { IconButton } from "../../components/action";
import { SlideUp } from "../../components/animation";
import { LuEye } from "react-icons/lu";

const statusFilters = [
  "All",
  "Completed",
  "Processing",
  "Pending",
  "Cancelled",
];

const mapPaymentMethod = (method) => {
  switch (method) {
    case "cash":
      return "Cash";
    case "card":
      return "Card";
    case "e_wallet":
      return "E-Wallet";
    case "qris":
      return "QRIS";
    default:
      return "Cash";
  }
};

const mapOrderStatus = (status) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "processing":
      return "Processing";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            order_number,
            customer_name,
            status,
            total_amount,
            subtotal,
            discount_amount,
            tax_amount,
            delivery_type,
            table_number,
            notes,
            created_at,
            profiles (
              name
            ),
            payments (
              payment_method,
              amount,
              status,
              paid_at
            ),
            order_items (
              item_name,
              quantity,
              unit_price
            )
          `,
          )
          .order("created_at", { ascending: false });

        if (!error && data) {
          const mapped = data.map((o) => {
            const customerName = o.profiles?.name || o.customer_name || "Guest";
            const rawPayment = o.payments?.[0] || null;
            const rawMethod = rawPayment?.payment_method || "cash";

            const items = (o.order_items || []).map((i) => ({
              name: i.item_name,
              qty: i.quantity,
              price: Number(i.unit_price),
            }));

            return {
              id: o.order_number || o.id,
              realId: o.id,
              customer: customerName,
              items: items,
              subtotal: Number(o.subtotal || 0),
              discount: Number(o.discount_amount || 0),
              tax: Number(o.tax_amount || 0),
              total: Number(o.total_amount),
              payment: rawPayment,
              status: mapOrderStatus(o.status),
              deliveryType: o.delivery_type,
              tableNumber: o.table_number,
              notes: o.notes,
              date: new Date(o.created_at).toISOString().split("T")[0],
              paymentMethod: mapPaymentMethod(rawMethod),
              paymentStatus: rawPayment?.status || "pending",
              paymentAmount: Number(rawPayment?.amount || 0),
              paymentPaidAt: rawPayment?.paid_at || null,
            };
          });

          setOrders(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat order dari Supabase:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateOrderStatus = async (orderId, newStatus) => {
    const orderToUpdate = orders.find((o) => o.id === orderId);
    const dbId = orderToUpdate?.realId || orderId;
    const dbStatus = newStatus.toLowerCase(); // 'Completed' -> 'completed'

    try {
      // Call database function (RPC) using POST to bypass PATCH CORS blocking
      const { error } = await supabase.rpc("update_order_status", {
        p_order_id: dbId,
        p_status: dbStatus
      });

      if (error) throw error;
    } catch (err) {
      console.error("Gagal memperbarui status order di Supabase:", err);
      alert(`Gagal memperbarui status order: ${err.message}`);
      return; // Stop update if database fails
    }

    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const filtered = orders.filter(
    (o) => filterStatus === "All" || o.status === filterStatus,
  );

  const getOrderSteps = (status) => {
    const steps = [
      { title: "Order Placed", desc: "Just now", status: "completed" },
      { title: "Brewing Coffee", desc: "In progress", status: "pending" },
      { title: "Quality Check", desc: "Pending", status: "pending" },
      { title: "Ready for Pickup", desc: "Pending", status: "pending" },
    ];
    if (status === "Completed")
      return steps.map((s) => ({ ...s, status: "completed" }));
    if (status === "Processing") {
      steps[1].status = "active";
      steps[1].desc = "Brewing your cup";
      return steps;
    }
    if (status === "Pending") {
      steps[1].status = "pending";
      steps[1].desc = "Waiting in queue";
      return steps;
    }
    if (status === "Cancelled") {
      return [
        { title: "Order Placed", desc: "Cancelled", status: "failed" },
        {
          title: "Cancelled",
          desc: "Order has been cancelled",
          status: "failed",
        },
      ];
    }
    return steps;
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Dashboard", to: "/dashboard" }, { label: "Orders" }]}
      />

      {/* Header & Filter */}
      <PageHeader
        title="Orders"
        subtitle="Manage and track all customer orders"
        action={
          <TabBar
            tabs={statusFilters}
            activeTab={filterStatus}
            onTabChange={setFilterStatus}
          />
        }
      />

      {/* Orders Table */}
      <SlideUp duration={0.4}>
        <Table
          columns={[
            { label: "Order ID" },
            { label: "Customer" },
            { label: "Items" },
            { label: "Total" },
            { label: "Payment" },
            { label: "Status" },
            { label: "Date" },
            { label: "" },
          ]}
          data={filtered}
          renderRow={(order) => (
            <tr
              key={order.id}
              className="hover:bg-amber-50/20 transition-colors duration-200"
            >
              <td className="px-6 py-4 font-bold text-[#2C1A0E]">
                <Tooltip content={`Click to view details`}>
                  <span
                    className="cursor-pointer hover:text-[#8B5F3C] transition-colors"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {order.id}
                  </span>
                </Tooltip>
              </td>
              <td className="px-6 py-4 text-gray-600 font-medium">
                <div>{order.customer}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5 capitalize flex items-center gap-1">
                  <span>
                    {order.deliveryType === "dine_in"
                      ? "☕ Dine-In"
                      : "🥡 Takeaway"}
                  </span>
                  {order.deliveryType === "dine_in" && order.tableNumber && (
                    <span className="text-[#8B5F3C]">
                      | Meja {order.tableNumber}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {order.items.map((it) => `${it.name} x${it.qty}`).join(", ")}
              </td>
              <td className="px-6 py-4 font-extrabold text-[#2C1A0E]">
                ${order.total.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <PaymentBadge method={order.paymentMethod} />
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                {order.date}
              </td>
              <td className="px-6 py-4">
                <IconButton
                  icon={LuEye}
                  variant="outline"
                  size="sm"
                  title="View Detail"
                  onClick={() => setSelectedOrder(order)}
                />
              </td>
            </tr>
          )}
        />
      </SlideUp>

      {/* Order Detail Drawer */}
      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.id || ""}`}
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer & Delivery Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Caption>Customer</Caption>
                <Heading level={4} className="mt-1">
                  {selectedOrder.customer}
                </Heading>
              </div>
              <div>
                <Caption>Layanan Penyajian</Caption>
                <p className="text-sm font-semibold text-slate-800 mt-1 capitalize">
                  {selectedOrder.deliveryType === "dine_in"
                    ? "☕ Dine In"
                    : "🥡 Takeaway"}
                  {selectedOrder.deliveryType === "dine_in" &&
                    selectedOrder.tableNumber && (
                      <span className="text-[#855C3B] font-bold ml-1.5">
                        (Meja {selectedOrder.tableNumber})
                      </span>
                    )}
                </p>
              </div>
            </div>

            {/* Notes (if exists) */}
            {selectedOrder.notes && (
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3.5 text-left">
                <Caption className="text-amber-800">Catatan Pesanan</Caption>
                <p className="text-xs font-medium text-amber-900 mt-1 italic">
                  "{selectedOrder.notes}"
                </p>
              </div>
            )}

            {/* Items */}
            <div>
              <Caption>Items Ordered</Caption>
              <div className="mt-3 space-y-3 bg-white rounded-3xl border border-[#EBE3D5] p-4">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl bg-gray-50 p-3"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-[#2C1A0E]">
                        {it.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {it.qty} x ${it.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#855C3B] text-right">
                      ${Number(it.price * it.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-amber-50/40 border border-amber-100/60 rounded-2xl p-4.5 space-y-2.5">
              {/* Payment Details */}
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>Payment Method</span>
                <span className="flex items-center gap-2">
                  <PaymentBadge method={selectedOrder.paymentMethod} />
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>Payment Status</span>
                <span className="font-semibold text-sm">
                  {selectedOrder.paymentStatus}
                </span>
              </div>
              {selectedOrder.paymentPaidAt && (
                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span>Paid At</span>
                  <span className="font-medium text-sm">
                    {new Date(selectedOrder.paymentPaidAt).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold">
                  <span>Diskon</span>
                  <span>-${selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              {selectedOrder.tax > 0 && (
                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span>Pajak (10%)</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/80 font-black text-slate-800 text-sm">
                <div className="flex items-center gap-2">
                  <span>Total Bayar</span>
                  <PaymentBadge method={selectedOrder.paymentMethod} />
                </div>
                <span className="text-lg text-[#855C3B]">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Status Tracker */}
            <div>
              <Caption>Order Progress</Caption>
              <div className="mt-3">
                <OrderStatus steps={getOrderSteps(selectedOrder.status)} />
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
              {selectedOrder.status === "Pending" && (
                <button
                  onClick={() =>
                    updateOrderStatus(selectedOrder.id, "Processing")
                  }
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors shadow-md shadow-amber-600/10 active:scale-[0.98]"
                >
                  Start Brewing
                </button>
              )}
              {selectedOrder.status === "Processing" && (
                <button
                  onClick={() =>
                    updateOrderStatus(selectedOrder.id, "Completed")
                  }
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/10 active:scale-[0.98]"
                >
                  Mark Ready
                </button>
              )}
              {(selectedOrder.status === "Pending" ||
                selectedOrder.status === "Processing") && (
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, "Cancelled")
                    }
                    className="py-3 px-4 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors active:scale-[0.98]"
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
