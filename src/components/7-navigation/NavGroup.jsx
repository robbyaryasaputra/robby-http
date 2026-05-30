export default function NavGroup({
  label,
  children,
  className = "",
}) {
  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <p className="px-5 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A88A]">
          {label}
        </p>
      )}
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}
