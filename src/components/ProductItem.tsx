import React from "react";
import { useShopStore } from "../store/store";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ProductItemProps {
  id: string;
  images: string[];
  name: string;
  price: number;
}

const ProductItem: React.FC<ProductItemProps> = ({ id, images, name, price }) => {
  const { t } = useTranslation();

  const currency = useShopStore((state) => state.currency);

  return (
    <div>
      <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
        <div className="overflow-hidden">
          <img
            src={images[0]}
            className="w-full aspect-[13/15] object-cover hover:scale-110 transition ease-in-out"
            alt=""
          />
        </div>
        <p className="pt-3 pb-1 text-base sm:text-lg truncate">{name}</p>

        <p className="text-sm font-medium">
          {price} {t(currency)}
        </p>
      </Link>
    </div>
  );
};

export default ProductItem;
