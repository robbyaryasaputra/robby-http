export default function RestaurantTable({ restaurants }) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-400 text-lg">No restaurants found</p>
        <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-xl shadow-black/20">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-white/10">
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">No</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Image</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Name</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Category</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Rating</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Price</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Status</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Location</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Contact</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Hours (Weekday)</th>
            <th className="px-4 py-4 text-purple-300 font-semibold text-xs uppercase tracking-wider">Est.</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((r, index) => (
            <tr
              key={r.id}
              className={`border-b border-white/5 transition-colors duration-200 hover:bg-purple-500/10 ${
                index % 2 === 0 ? "bg-white/[0.02]" : "bg-white/[0.04]"
              }`}
            >
              <td className="px-4 py-3 text-gray-400 font-mono">{index + 1}</td>
              <td className="px-4 py-3">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10"
                />
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold text-white">{r.name}</div>
                <div className="text-gray-500 text-xs mt-0.5 max-w-[200px] truncate">
                  {r.description}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-400/20">
                  {r.category}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-amber-300 font-semibold">{r.rating}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-300 font-semibold">{r.priceRange}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    r.isOpen
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      r.isOpen ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                  {r.isOpen ? "Open" : "Closed"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="text-gray-300 text-xs">{r.location.address}</div>
                <div className="text-gray-500 text-xs">
                  {r.location.district}, {r.location.city}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-gray-300 text-xs">{r.contact.phone}</div>
                <div className="text-gray-500 text-xs truncate max-w-[140px]">{r.contact.email}</div>
              </td>
              <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">
                {r.operationalHours.weekday}
              </td>
              <td className="px-4 py-3 text-gray-400 font-mono text-xs">{r.established}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
