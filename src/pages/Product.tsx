import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart, useItemInCart, useShopStore } from "../store/store";
import { ProductFullData } from "../types/product";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { fetchProductsById } from "../utils/api";
import i18n from "../i18n";
import ProductRating from "../components/UI/ProductRating";
import Reviews from "../components/Reviews";
import AiIcon from "../components/icons/AiIcon";
import RulerIcon from "../components/icons/RulerIcon";

const Product: React.FC = () => {
  const { t } = useTranslation();

  const productId = useParams().productId;
  const navigate = useNavigate();

  const currency = useShopStore((state) => state.currency);

  const [productData, setProductData] = useState<ProductFullData | undefined>();
  const [size, setSize] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [image, setImage] = useState("");

  const itemInCart = useItemInCart(productId ?? "", size, colorCode);

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
    <>
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
            {/* //! hardcode */}
            <ProductRating rating={4.7} totalReviews={0} />
            <p className="mt-5 text-3xl font-medium">
              {productData.price} {t(currency)}
            </p>
            {i18n.language === "uk" ? (
              <>
                <p className="mt-5 text-gray-500 md:w-4/5 ">{productData.description_uk}</p>
                <p className="mt-5 text-gray-500 md:w-4/5 ">
                  {t("product-page.materials")}:{" "}
                  <span className="text-black">{productData.material_uk}</span>
                </p>
                <p className="mt-5 text-gray-500 md:w-4/5 ">
                  {t("product-page.brand")}:{" "}
                  <span className="text-black">{productData.brand.name}</span>
                </p>
              </>
            ) : (
              <>
                <p className="mt-5 text-gray-500 md:w-4/5 ">{productData.description_en}</p>
                <p className="mt-5 text-gray-500 md:w-4/5 ">
                  {t("product-page.materials")}:{" "}
                  <span className="text-black">{productData.material_en}</span>
                </p>
                <p className="mt-5 text-gray-500 md:w-4/5 ">
                  {t("product-page.brand")}:{" "}
                  <span className="text-black">{productData.brand.name}</span>
                </p>
              </>
            )}
            {/* //? SIZES */}
            <div className="flex flex-col gap-4 mt-16 mb-8">
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
            {/* //? BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 my-8">
              <button
                onClick={() => navigate(`/try-on/${productId}`)}
                className="flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-700 px-6 py-3 text-sm font-semibold rounded-full hover:bg-black hover:text-white active:bg-gray-800 transition-colors"
              >
                <AiIcon />
                {t("product-info.virtual-try-on")}
              </button>
              <button
                onClick={() => navigate("/size-tables")}
                className="flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-700 px-6 py-3 text-sm font-semibold rounded-full hover:bg-black hover:text-white active:bg-gray-800 transition-colors"
              >
                <RulerIcon />
                {t("product-info.size-tables")}
              </button>
            </div>
            {/* //? ADD TO CART */}
            {itemInCart ? (
              <button
                onClick={() => navigate("/cart")}
                className="bg-green-500 text-white px-8 py-3 text-sm font-semibold active:bg-green-600"
              >
                {t("product-info.go-to-cart")}
              </button>
            ) : (
              <button
                onClick={() => addToCartHandler(productData._id)}
                className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
              >
                {t("product-info.add-to-cart")}
              </button>
            )}
            {/* Subtext */}
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>{t("product-info.original")}</p>
              <p>{t("product-info.cash-on-delivery")}</p>
              <p>{t("product-info.return-exchange-polisy")}</p>
            </div>
          </div>
        </div>
        {/* //! temporarily removed */}
        {/* //? ------------ RELATED PRODUCTS ------------ */}
        {/* <RelatedProducts
					productId={productData._id}
					category={productData.category}
					subCategory={productData.subCategory}
				/> */}
      </div>
      <Reviews
        className="mt-12"
        reviews={[
          {
            id: 1,
            user: "Олена К.",
            rating: 5,
            comment: "Чудова якість, дуже зручна річ! Швидка доставка.",
            date: "03.06.2025",
          },
          {
            id: 2,
            user: "Максим П.",
            rating: 4,
            comment:
              "Товар сподобався, але розмір трохи замалий. Рекомендую брати на розмір більше.",
            date: "01.06.2025",
          },
          {
            id: 3,
            user: "Анна С.",
            rating: 3,
            comment: "Непогано, але колір трохи відрізняється від фото на сайті.",
            date: "30.05.2025",
          },
        ]}
      />
    </>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
