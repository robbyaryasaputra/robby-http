export default function Heading({
  level = 1,
  children,
  className = "",
  ...props
}) {
  const Tag = `h${level}`;

  const styles = {
    1: "text-3xl font-extrabold text-[#2C1A0E] tracking-tight sm:text-4xl",
    2: "text-2xl font-bold text-[#2C1A0E] tracking-tight sm:text-3xl",
    3: "text-xl font-bold text-[#2C1A0E]",
    4: "text-lg font-bold text-[#2C1A0E]",
    5: "text-base font-bold text-[#2C1A0E]",
    6: "text-sm font-bold text-[#2C1A0E]",
  };

  return (
    <Tag className={`${styles[level]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
