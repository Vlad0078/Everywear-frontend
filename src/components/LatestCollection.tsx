import React, { useEffect, useState } from "react";
import { useShopStore } from "../store/store";
import Title from "./Title";
import { useTranslation } from "react-i18next";
import ProductItem from "./ProductItem";
import { ProductData } from "../types/products";

const LatestCollection: React.FC = () => {
  const { t } = useTranslation();
  const products = useShopStore((state) => state.products);
  const [latestProducts, setLatestProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

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
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
