import customersData from "../data/customers.json";

function getStatusDot(status) {
  return status === "Active" ? "bg-emerald-400" : "bg-gray-300";
}

export default function Customers() {
  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-[#2C1A0E]">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage your loyal customers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {customersData.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-bold text-sm">{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#2C1A0E] truncate">{c.name}</h3>
                <p className="text-xs text-gray-400 truncate">{c.email}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${getStatusDot(c.status)}`}></span>
                <span className="text-xs text-gray-400">{c.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div>
                <p className="text-lg font-bold text-[#2C1A0E]">{c.totalOrders}</p>
                <p className="text-xs text-gray-400">Orders</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">${c.totalSpent.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Spent</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">{c.phone}</p>
              <p className="text-xs text-gray-300 mt-0.5">Joined {c.joinDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
