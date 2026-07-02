import { LuStar } from "react-icons/lu";

export default function RatingStars({
  rating = 5,
  maxStars = 5,
  className = "",
  size = 16,
}) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars.map((star) => {
        const isFilled = star <= Math.round(rating);
        return (
          <LuStar
            key={star}
            size={size}
            className={`
              transition-all duration-300
              ${isFilled 
                ? "text-amber-500 fill-amber-500" 
                : "text-slate-200 fill-transparent"
              }
            `}
          />
        );
      })}
      <span className="text-xs font-bold text-slate-600 ml-1.5">{rating}</span>
    </div>
  );
}
