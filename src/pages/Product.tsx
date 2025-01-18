import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCart, useShopStore } from "../store/store";
import { ProductData } from "../types/products";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product: React.FC = () => {
  const { t } = useTranslation();

  const productId = useParams().productId;

  const products = useShopStore((state) => state.products);
  const currency = useShopStore((state) => state.currency);

  const [productData, setProductData] = useState<ProductData | undefined>(
    undefined
  );
  const [size, setSize] = useState("");
  const [image, setImage] = useState("");

  // ! async await?
  const fethProductData = useCallback(async () => {
    const product = await products.find((item) => item._id === productId);
    if (product !== undefined) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  const addToCartHandler = (productId: string) => {
    if (!size) {
      toast.error(t("select-size"));
      return;
    }
    addToCart(productId, size);
  };

  useEffect(() => {
    fethProductData();
  }, [fethProductData]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* //* ----------- PRODUCT DATA ------------ */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* //? ------------ PRODUCT IMAGES ------------ */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full ">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                key={index}
                src={item}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="" />
          </div>
        </div>
        {/* //? ------------ PRODUCT INFO ------------ */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5 ">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>{t("product-info.select-size")}</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
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
      {/* //? ------------ DESCRIPTION & REVIEW SECTION ------------ */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">
            {t("product-info.description")}
          </b>
          <p className="border px-5 py-3 text-sm">
            {t("product-info.reviews")} (122)
          </p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            allows businesses to showcase their products, receive payments, and
            manage transactions electronically.
          </p>
          <p>
            E-commerce websites typically include features such as product
            listings, shopping carts, secure payment gateways, order management
            systems, and customer support functionalities. These websites enable
            businesses to reach a global customer base, operate 24/7, and
            provide consumers with the convenience of purchasing products from
            the comfort of their homes.
          </p>
        </div>
      </div>
      {/* //? ------------ RELATED PRODUCTS ------------ */}
      <RelatedProducts
        productId={productData._id}
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
