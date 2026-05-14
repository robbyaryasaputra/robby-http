import { LuCoffee, LuShoppingCart, LuUsers, LuTrendingUp, LuArrowUpRight, LuArrowDownRight } from "react-icons/lu";

const stats = [
  {
    label: "Total Revenue",
    value: "$12,450",
    change: "+12.5%",
    trend: "up",
    icon: LuTrendingUp,
    color: "from-amber-500 to-amber-700",
    bgLight: "bg-amber-50",
  },
  {
    label: "Total Orders",
    value: "1,245",
    change: "+8.2%",
    trend: "up",
    icon: LuShoppingCart,
    color: "from-emerald-500 to-emerald-700",
    bgLight: "bg-emerald-50",
  },
  {
    label: "Customers",
    value: "856",
    change: "+5.1%",
    trend: "up",
    icon: LuUsers,
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
  },
  {
    label: "Menu Items",
    value: "48",
    change: "-2.3%",
    trend: "down",
    icon: LuCoffee,
    color: "from-purple-500 to-purple-700",
    bgLight: "bg-purple-50",
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "Budi Santoso", item: "Americano x2", total: "$7.50", status: "Completed" },
  { id: "ORD-002", customer: "Siti Rahayu", item: "Vanilla Latte", total: "$4.75", status: "Processing" },
  { id: "ORD-003", customer: "Ahmad Hidayat", item: "Caramel Macchiato x3", total: "$15.75", status: "Completed" },
  { id: "ORD-004", customer: "Dewi Lestari", item: "Iced Cappuccino x2", total: "$9.00", status: "Pending" },
  { id: "ORD-005", customer: "Rizky Pratama", item: "Flat White", total: "$4.25", status: "Completed" },
];

const topProducts = [
  { name: "Caramel Macchiato", sold: 245, revenue: "$1,286" },
  { name: "Vanilla Latte", sold: 198, revenue: "$940" },
  { name: "Americano", sold: 187, revenue: "$701" },
  { name: "Mocha Delight", sold: 156, revenue: "$780" },
  { name: "Iced Cappuccino", sold: 134, revenue: "$603" },
];

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

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C1A0E]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's your coffee shop overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50 group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-red-500 bg-red-50"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <LuArrowUpRight className="w-3 h-3" />
                  ) : (
                    <LuArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-[#2C1A0E]">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <h2 className="text-lg font-semibold text-[#2C1A0E] mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Item</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-medium text-gray-700">{order.id}</td>
                    <td className="py-3 text-gray-600">{order.customer}</td>
                    <td className="py-3 text-gray-600">{order.item}</td>
                    <td className="py-3 font-semibold text-[#2C1A0E]">{order.total}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <h2 className="text-lg font-semibold text-[#2C1A0E] mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sold} sold</p>
                </div>
                <span className="text-sm font-semibold text-[#2C1A0E]">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
