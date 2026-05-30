export default function CoffeeBeanIcon({
  size = "md",
  className = "",
  color = "#8B5F3C",
}) {
  const sizeMap = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <svg
      className={`${sizeMap[size] || sizeMap.md} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.2 3.8C16.8 0.4 10.8 0.4 7.4 3.8C5.2 6 4.3 9.1 4.6 12C3 12.5 1.7 13.8 0.9 15.5C-0.5 18.5 0.2 22 2.7 23.5C4.2 24.4 6 24.4 7.6 23.6C9.1 22.8 10.2 21.3 10.6 19.6C13.5 19.8 16.5 18.9 18.7 16.6C22.1 13.2 22.1 7.2 20.2 3.8ZM8.8 5.2C11.4 2.6 16.2 2.6 18.8 5.2C21.4 7.8 21.4 12.6 18.8 15.2C16.2 17.8 11.4 17.8 8.8 15.2C6.2 12.6 6.2 7.8 8.8 5.2Z"
        fill={color}
      />
      <path
        d="M17.5 6.5C15 9 13.5 10 11.5 10.5C9.5 11 8 13 6.5 15.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
