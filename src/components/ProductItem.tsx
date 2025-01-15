import React from "react";
import { useShopStore } from "../store/store";
import { Link } from "react-router-dom";

interface ProductItemProps {
  id: string;
  image: string[];
  name: string;
  price: number;
}

const ProductItem: React.FC<ProductItemProps> = ({
  id,
  image,
  name,
  price,
}) => {
  const currency = useShopStore((state) => state.currency);

  return (
    <div>
      <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
        <div className="overflow-hidden">
          <img
            src={image[0]}
            className="hover:scale-110 transition ease-in-out"
            alt=""
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </Link>
    </div>
  );
};

export default ProductItem;
