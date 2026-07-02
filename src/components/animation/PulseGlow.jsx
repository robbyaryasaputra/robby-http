export default function PulseGlow({
  children,
  color = "#8B5F3C",
  duration = 2,
  className = "",
}) {
  const style = {
    animation: `pulseGlow ${duration}s infinite ease-in-out`,
  };

  return (
    <div className={`rounded-xl ${className}`} style={style}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 5px ${color}20, inset 0 0 5px ${color}10;
          }
          50% {
            box-shadow: 0 0 20px ${color}60, inset 0 0 10px ${color}30;
          }
        }
      `}} />
      {children}
    </div>
  );
}
