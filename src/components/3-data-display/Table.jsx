export default function Table({
  columns = [],
  data = [],
  renderRow,
  emptyMessage = "No data available",
  className = "",
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 text-left">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row, i) =>
                renderRow ? (
                  renderRow(row, i)
                ) : (
                  <tr
                    key={i}
                    className="hover:bg-amber-50/30 transition-colors duration-200"
                  >
                    {columns.map((col, j) => (
                      <td key={j} className="px-6 py-4 text-gray-600">
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
