export default function Paragraph({
  children,
  variant = "body",
  className = "",
  ...props
}) {
  const styles = {
    lead: "text-base text-gray-500 leading-relaxed",
    body: "text-sm text-gray-600 leading-relaxed",
    small: "text-xs text-gray-500 leading-relaxed",
  };

  return (
    <p className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </p>
  );
}
