import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { PageHeader } from "../../components/section";
import { Table, Tooltip } from "../../components/data-display";
import { Breadcrumb } from "../../components/navigation";
import { SlideUp } from "../../components/animation";
import { Button } from "../../components/basic";
import { PaymentBadge } from "../../components/status";
import { LuRefreshCw } from "react-icons/lu";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("payments")
        .select(
          `id, order_id, payment_method, amount, status, paid_at, created_at, orders(order_number, customer_name, profiles(name))`,
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const mapped = (data || []).map((payment) => {
        const order = payment.orders || {};
        const customerName = order.profiles?.name || order.customer_name || "Guest";
        return {
          id: payment.id,
          orderId: payment.order_id,
          orderNumber: order.order_number || "-",
          customerName: customerName,
          method: payment.payment_method || "cash",
          amount: Number(payment.amount || 0),
          status: payment.status || "pending",
          paidAt: payment.paid_at,
          createdAt: payment.created_at,
        };
      });

      setPayments(mapped);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Gagal memuat data pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatus = (status) => {
    const label =
      status === "paid"
        ? "Paid"
        : status === "refunded"
          ? "Refunded"
          : status === "failed"
            ? "Failed"
            : "Pending";
    const badgeStyle = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      refunded: "bg-sky-50 text-sky-700 border-sky-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      pending: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle[status] || badgeStyle.pending}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Payments" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Payments"
          subtitle="Pantau metode pembayaran dan status transaksi"
        />
        <Button
          variant="secondary"
          icon={LuRefreshCw}
          onClick={fetchPayments}
          className="whitespace-nowrap"
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="flex items-start gap-3">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <SlideUp duration={0.4}>
        <Table
          columns={[
            { label: "Payment ID" },
            { label: "Order" },
            { label: "Customer" },
            { label: "Method" },
            { label: "Amount" },
            { label: "Status" },
            { label: "Paid At" },
            { label: "Created" },
          ]}
          data={payments}
          renderRow={(payment) => (
            <tr
              key={payment.id}
              className="hover:bg-amber-50/20 transition-colors duration-200"
            >
              <td className="px-6 py-4 text-xs font-medium text-[#2C1A0E] break-all">
                {payment.id}
              </td>
              <td className="px-6 py-4 text-sm text-[#4B2C20] font-semibold">
                {payment.orderNumber}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {payment.customerName}
              </td>
              <td className="px-6 py-4 text-sm">
                <PaymentBadge
                  method={
                    payment.method === "e_wallet"
                      ? "E-Wallet"
                      : payment.method === "card"
                        ? "Card"
                        : payment.method === "qris"
                          ? "QRIS"
                          : "Cash"
                  }
                />
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-[#2C1A0E]">
                ${payment.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm">
                {renderStatus(payment.status)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(payment.paidAt)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(payment.createdAt)}
              </td>
            </tr>
          )}
          emptyMessage={
            loading ? "Loading payments..." : "No payment records found."
          }
          className="min-h-[320px]"
        />
      </SlideUp>
    </div>
  );
}
