import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";

interface ProductRatingProps {
  rating: number;
  totalReviews: number;
}

const ProductRating: React.FC<ProductRatingProps> = ({ rating, totalReviews }) => {
  const ratingFullWidth = 5.375;
  const [filledWidth, setFilledWidth] = useState(0);

  useEffect(() => {
    setFilledWidth((ratingFullWidth * rating) / 5);
  }, [rating]);

  return (
    <div className="mt-2 flex items-center">
      {/* Зірки — обгортка для перекриття */}
      <div className="relative flex items-center gap-1">
        {/* Порожні зірки */}
        {[...Array(5)].map((_, i) => (
          <img key={i} src={assets.star_dull_icon} alt="" className="w-3.5" />
        ))}

        {/* Заповнені зірки поверх */}
        <div
          className="absolute top-0 left-0 flex items-center gap-1 overflow-hidden"
          style={{ width: `${filledWidth}rem` }}
        >
          {[...Array(5)].map((_, i) => (
            <img key={i} src={assets.star_icon} alt="" className="w-3.5" />
          ))}
        </div>
      </div>

      {/* Кількість відгуків */}
      <p className="pl-2 text-base leading-none">({totalReviews})</p>
    </div>
  );
};

export default ProductRating;
