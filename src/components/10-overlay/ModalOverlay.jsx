export default function ModalOverlay({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 z-50 bg-[#33251f]/40 backdrop-blur-xs
        flex items-center justify-center p-4
        animate-[fadeIn_0.2s_ease-out]
        ${className}
      `}
    >
      <div onClick={(e) => e.stopPropagation()} className="relative">
        {children}
      </div>
    </div>
  );
}
