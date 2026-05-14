import { useState } from "react";
import ordersData from "../data/orders.json";
import { LuFilter } from "react-icons/lu";

function getStatusStyle(status) {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700";
    case "Processing":
      return "bg-amber-100 text-amber-700";
    case "Pending":
      return "bg-blue-100 text-blue-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getPaymentBadge(method) {
  switch (method) {
    case "Cash":
      return "bg-green-50 text-green-600 border-green-200";
    case "Card":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "E-Wallet":
      return "bg-purple-50 text-purple-600 border-purple-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

const statusFilters = ["All", "Completed", "Processing", "Pending", "Cancelled"];

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = ordersData.filter(
    (o) => filterStatus === "All" || o.status === filterStatus
  );

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1A0E]">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LuFilter className="w-4 h-4 text-gray-400" />
          {statusFilters.map((s) => (
            <button
              key={s}
              id={`order-filter-${s.toLowerCase()}`}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                filterStatus === s
                  ? "bg-[#2C1A0E] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-amber-50/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-semibold text-[#2C1A0E]">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {order.items.map((it) => `${it.name} x${it.qty}`).join(", ")}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#2C1A0E]">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentBadge(
                        order.paymentMethod
                      )}`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
