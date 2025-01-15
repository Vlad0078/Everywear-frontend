import React, { useEffect, useState } from "react";
import { useShopStore } from "../store/store";
import { ProductData } from "../types/products";
import Title from "./Title";
import { useTranslation } from "react-i18next";
import ProductItem from "./ProductItem";

const BestSellers: React.FC = () => {
  const { t } = useTranslation();
  const products = useShopStore((state) => state.products);
  const [bestSellers, setBestSellers] = useState<ProductData[]>([]);

  useEffect(() => {
    const bestProducts = products.filter((item) => item.bestseller);
    setBestSellers(bestProducts.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text={t("best-sellers")} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
          esse, rerum ipsam laboriosam, pariatur aperiam obcaecati officia
          magnam culpa qui eius corrupti. Totam optio aperiam labore corrupti
          at, ex eveniet!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestSellers.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
