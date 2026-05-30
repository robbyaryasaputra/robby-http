export default function SkeletonLoader({
  variant = "text",
  width = "100%",
  height = "16px",
  className = "",
}) {
  const styles = {
    text: "h-4 w-full rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-2xl",
  };

  return (
    <div
      className={`
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        animate-pulse
        ${styles[variant] || styles.text}
        ${className}
      `}
      style={{
        width: variant !== "text" ? width : undefined,
        height: variant !== "text" ? height : undefined,
      }}
    />
  );
}
