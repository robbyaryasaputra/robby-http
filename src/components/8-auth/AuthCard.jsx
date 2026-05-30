export default function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white rounded-[2rem] p-8 border border-slate-200 
        shadow-[0_30px_80px_rgba(15,23,42,0.08)] ${className}
      `}
    >
      {children}
    </div>
  );
}
