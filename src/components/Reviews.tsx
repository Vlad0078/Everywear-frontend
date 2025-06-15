import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import Title from "./Title";

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsProps {
  reviews: Review[];
}

const Reviews: React.FC<ReviewsProps & React.HTMLAttributes<HTMLDivElement>> = ({
  reviews,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <div {...rest}>
      <div className="inline-flex flex-wrap gap-2 items-center mb-4">
        <div className="text-center py-2 text-2xl">
          <Title text={t("reviews.title")} />
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-700 font-medium">{review.user}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < review.rating ? assets.star_icon : assets.star_dull_icon}
                    alt="star"
                    className="w-3.5"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{review.date}</p>
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
