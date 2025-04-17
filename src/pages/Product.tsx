import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCart, useShopStore } from "../store/store";
import { ProductFullData } from "../types/product";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { fetchProductsById } from "../utils/api";
import i18n from "../i18n";

const Product: React.FC = () => {
  const { t } = useTranslation();

  const productId = useParams().productId;

  const currency = useShopStore((state) => state.currency);

  const [productData, setProductData] = useState<ProductFullData | undefined>();
  const [size, setSize] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [image, setImage] = useState("");

  const loadProductData = useCallback(async () => {
    if (productId) {
      const data = await fetchProductsById(productId);
      if (data && data.products && data.products.length) {
        const product = data.products[0];
        setProductData(product);
        setImage(product.images[0]);
      }
    }
  }, [productId]);

  const addToCartHandler = (productId: string) => {
    if (!productData) {
      toast.error(t("product-not-found"));
      return;
    } else if (!size) {
      toast.error(t("select-size"));
      return;
    } else if (!colorCode) {
      toast.error(t("select-color"));
      return;
    }
    addToCart(productId, size, colorCode, productData.price);
  };

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* //* ----------- PRODUCT DATA ------------ */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* //? ------------ PRODUCT IMAGES ------------ */}
        <div className="relative h-fit flex-1 flex flex-col-reverse gap-3 sm:flex-row ">
          <div className="sm:w-[19%]"></div>
          <div className="sm:absolute h-full overflow-hidden flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[19%] w-full">
            {productData.images.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                key={index}
                src={item}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer aspect-[13/15] object-cover"
                alt=""
              />
            ))}
          </div>
          <div className="w-full h-fit sm:w-[80%]">
            <img src={image} className="w-full h-auto aspect-[13/15] object-cover" alt="" />
          </div>
        </div>
        {/* //? ------------ PRODUCT INFO ------------ */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">
            {i18n.language === "uk" ? productData.name_uk : productData.name_en}
          </h1>
          {/* //! temporarily removed (reviews) */}
          {/* <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div> */}
          <p className="mt-5 text-3xl font-medium">
            {productData.price} {t(currency)}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5 ">
            {i18n.language === "uk" ? productData.description_uk : productData.description_en}
          </p>
          {/* //? SIZES */}
          <div className="flex flex-col gap-4 my-8">
            <p>{t("product-info.select-size")}</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item.size)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item.size === size ? "border-orange-500" : ""
                  }`}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>

          {/* //? COLORS */}
          <div className="flex flex-col gap-4 my-8">
            <p>{t("product-info.select-color")}</p>
            <div className="flex gap-2 flex-wrap">
              {productData.colors.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setColorCode(item.code)}
                  className={`flex items-center gap-2 border py-2 px-4 bg-gray-100 ${
                    item.code === colorCode ? "border-orange-500" : ""
                  }`}
                >
                  <div
                    className="rounded-full w-5 h-5 border border-gray-400"
                    style={{
                      backgroundColor: item.hex,
                    }}
                  ></div>
                  {i18n.language === "uk" ? item.name_uk : item.name_en}
                </button>
              ))}
            </div>
          </div>

          {/* //? ADD TO CART */}
          <button
            onClick={() => addToCartHandler(productData._id)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            {t("product-info.add-to-cart")}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>{t("product-info.original")}</p>
            <p>{t("product-info.cash-on-delivery")}</p>
            <p>{t("product-info.return-exchange-polisy")}</p>
          </div>
        </div>
      </div>
      {/* //! temporarily removed */}
      {/* //? ------------ DESCRIPTION & REVIEW SECTION ------------ */}
      {/* <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">{t("product-info.description")}</b>
          <p className="border px-5 py-3 text-sm">{t("product-info.reviews")} (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the buying and selling of
            products or services over the internet. It allows businesses to showcase their products,
            receive payments, and manage transactions electronically.
          </p>
          <p>
            E-commerce websites typically include features such as product listings, shopping carts,
            secure payment gateways, order management systems, and customer support functionalities.
            These websites enable businesses to reach a global customer base, operate 24/7, and
            provide consumers with the convenience of purchasing products from the comfort of their
            homes.
          </p>
        </div>
      </div> */}
      {/* //! temporarily removed */}
      {/* //? ------------ RELATED PRODUCTS ------------ */}
      {/* <RelatedProducts
        productId={productData._id}
        category={productData.category}
        subCategory={productData.subCategory}
      /> */}
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
