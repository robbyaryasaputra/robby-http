export default function FadeIn({
  children,
  duration = 0.5,
  delay = 0,
  className = "",
}) {
  const style = {
    animation: `fadeIn ${duration}s ease-out ${delay}s both`,
  };

  return (
    <div className={className} style={style}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
      {children}
    </div>
  );
}
