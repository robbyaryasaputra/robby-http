export default function SlideUp({
  children,
  duration = 0.5,
  delay = 0,
  distance = "20px",
  className = "",
}) {
  const style = {
    animation: `slideUp ${duration}s ease-out ${delay}s both`,
  };

  return (
    <div className={className} style={style}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(${distance});
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
      {children}
    </div>
  );
}
