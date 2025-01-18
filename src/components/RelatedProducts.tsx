import React, { useEffect, useState } from "react";
import { useShopStore } from "../store/store";
import { ProductData } from "../types/products";
import Title from "./Title";
import { useTranslation } from "react-i18next";
import ProductItem from "./ProductItem";

interface RelatedProductsProps {
  productId: string;
  category: string;
  subCategory: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  category,
  subCategory,
}) => {
  const { t } = useTranslation();

  const products = useShopStore((state) => state.products);
  const [related, setRelated] = useState<ProductData[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) =>
          item._id !== productId &&
          item.category === category &&
          item.subCategory === subCategory
      );

      setRelated(productsCopy.slice(0, 5));
    }
  }, [category, productId, products, subCategory]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text={t("related-products")} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
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

export default RelatedProducts;
