import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import Title from "./Title";

const stringifyDate = (timestamp: number) => {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  // return `${day} ${t(`month-names.short.${month}`)} ${year}`;
  return `${year}-${month < 9 ? "0" : ""}${month + 1}-${day}`;
};

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: Date;
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
      {reviews.length ? (
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
                <p className="text-sm text-gray-600">{stringifyDate(review.date)}</p>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-gray-600 font-normal text-start py-2">
          {t("reviews.no-reviews")}
        </p>
      )}
    </div>
  );
};

export default Reviews;
