import { useState } from "react";
import ordersData from "../data/orders.json";
import { PageHeader } from "../components/6-section";
import { Table, Tooltip } from "../components/3-data-display";
import { TabBar, Breadcrumb } from "../components/7-navigation";
import { StatusBadge, PaymentBadge, OrderStatus } from "../components/12-status";
import { Drawer } from "../components/10-overlay";
import { Heading, Caption } from "../components/14-typography";
import { IconButton } from "../components/13-action";
import { SlideUp } from "../components/15-animation";
import { LuEye } from "react-icons/lu";

const statusFilters = ["All", "Completed", "Processing", "Pending", "Cancelled"];

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = ordersData.filter(
    (o) => filterStatus === "All" || o.status === filterStatus
  );

  const getOrderSteps = (status) => {
    const steps = [
      { title: "Order Placed", desc: "10:30 AM", status: "completed" },
      { title: "Brewing Coffee", desc: "10:35 AM", status: "completed" },
      { title: "Quality Check", desc: "10:38 AM", status: "pending" },
      { title: "Ready for Pickup", desc: "Pending", status: "pending" },
    ];
    if (status === "Completed") return steps.map(s => ({ ...s, status: "completed" }));
    if (status === "Processing") {
      steps[2].status = "active";
      return steps;
    }
    if (status === "Pending") {
      steps[1].status = "active";
      steps[1].desc = "Waiting";
      return steps;
    }
    return steps;
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Orders" },
        ]}
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
            { label: "" }
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
              <td className="px-6 py-4 text-gray-600 font-medium">{order.customer}</td>
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
            {/* Customer Info */}
            <div>
              <Caption>Customer</Caption>
              <Heading level={4} className="mt-1">{selectedOrder.customer}</Heading>
            </div>

            {/* Items */}
            <div>
              <Caption>Items Ordered</Caption>
              <ul className="mt-2 space-y-2">
                {selectedOrder.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">{it.name}</span>
                    <span className="text-xs font-bold text-[#8B5F3C]">x{it.qty}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total & Payment */}
            <div className="flex items-center justify-between bg-amber-50 rounded-xl px-4 py-3">
              <div>
                <Caption>Total</Caption>
                <p className="text-xl font-bold text-[#2C1A0E] mt-1">${selectedOrder.total.toFixed(2)}</p>
              </div>
              <PaymentBadge method={selectedOrder.paymentMethod} />
            </div>

            {/* Order Status Tracker */}
            <div>
              <Caption>Order Progress</Caption>
              <div className="mt-3">
                <OrderStatus steps={getOrderSteps(selectedOrder.status)} />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
