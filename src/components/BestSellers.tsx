import React, { useEffect, useState } from "react";
import { ProductData } from "../types/product";
import Title from "./Title";
import { useTranslation } from "react-i18next";
import ProductItem from "./ProductItem";
import i18n from "../i18n";
import { fetchProducts } from "../utils/api";

const BestSellers: React.FC = () => {
  const { t } = useTranslation();

  const [bestSellers, setBestSellers] = useState<ProductData[]>([]);

  useEffect(() => {
    fetchProducts({ page: 1, resultsOnPage: 5, recommend: true }).then((data) => {
      if (data && data.products) setBestSellers(data.products);
    });
  }, []);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text={t("best-sellers")} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore esse, rerum ipsam
          laboriosam, pariatur aperiam obcaecati officia magnam culpa qui eius corrupti. Totam optio
          aperiam labore corrupti at, ex eveniet!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestSellers.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={i18n.language === "uk" ? item.name_uk : item.name_en}
              images={item.images}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
