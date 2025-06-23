import { t } from "i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { submitReview } from "../utils/api";
import { useShopStore } from "../store/store";

interface ReviewFormProps {
  productId: string;
  loadProductData: CallableFunction;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, loadProductData }) => {
	const token = useShopStore((state) => state.token);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error(t("reviews.select-rating"));
      return;
    }
    try {
      const response = await submitReview(productId, rating, comment, token);
      if (response.success) {
        toast.success(t("reviews.submit-success"));
        setRating(0);
        setComment("");
        loadProductData();
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error(t("reviews.submit-error"));
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-medium text-gray-800 mb-4">{t("reviews.write-review")}</h2>
      <form onSubmit={submitReviewHandler} className="flex flex-col gap-4">
        <div className="relative flex items-center gap-2">
          {/* Порожні зірки */}
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              onClick={() => setRating(i + 1)}
              src={i >= rating ? assets.star_dull_icon : assets.star_icon}
              alt=""
              className="w-3.5"
            />
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("reviews.comment-placeholder")}
          className="w-full p-3 border border-gray-700 rounded-md text-gray-800 text-sm resize-none h-24"
        />
        <button
          type="submit"
          className="bg-black hover:bg-gray-800 active:bg-gray-700 text-white px-8 py-3 text-sm font-normal w-fit"
        >
          {t("reviews.submit-review")}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
