export default function ProductSection({
  children,
  emptyMessage = "No coffee found",
  emptySubtext = "Try adjusting your search or category filter.",
  isEmpty = false,
  className = "",
}) {
  if (isEmpty) {
    return (
      <div className="rounded-[2rem] border border-dashed border-[#D8C7B2] bg-[#FFF8F1] p-10 text-center text-[#6B5443]">
        <p className="text-lg font-semibold">{emptyMessage}</p>
        <p className="mt-2 text-sm text-[#8E7A6A]">{emptySubtext}</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}
    >
      {children}
    </div>
  );
}
