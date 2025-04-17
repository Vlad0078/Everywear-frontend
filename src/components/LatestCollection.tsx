import React, { useEffect, useState } from "react";
import Title from "./Title";
import { useTranslation } from "react-i18next";
import ProductItem from "./ProductItem";
import { ProductData } from "../types/product";
import { fetchProducts } from "../utils/api";
import i18n from "../i18n";

const LatestCollection: React.FC = () => {
  const { t } = useTranslation();
  const [latestProducts, setLatestProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    fetchProducts({ page: 1, resultsOnPage: 10, sortField: "createdAt", sortDesc: true }).then(
      (data) => {
        if (data && data.products) setLatestProducts(data.products);
      }
    );
  }, []);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text={t("latest-collections")} />
      </div>

      {/* Відображення товарів */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            images={item.images}
            name={i18n.language === "uk" ? item.name_uk : item.name_en}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
