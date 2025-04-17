import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateProductQuantity, useShopStore } from "../store/store";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";
import { fetchProductsById } from "../utils/api";
import { produce } from "immer";
import { CartItem, ProductFullData } from "../types/product";

const Cart: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const currency = useShopStore((state) => state.currency);
  const cartItems = useShopStore((state) => state.cartItems);

  const [cartProducts, setCartProducts] = useState<{ [id: string]: ProductFullData }>({});
  const [productsLoaded, setProductsLoaded] = useState(false);

  const getColor = (cartItems: CartItem) => {
    return cartProducts[cartItems.article.productId].colors.find(
      (color) => color.code === cartItems.article.colorCode
    );
  };

  useEffect(() => {
    setProductsLoaded(false);

    const missingProdsId = cartItems
      .filter((item) => !(item.article.productId in cartProducts))
      .map((item) => item.article.productId);

    if (missingProdsId.length === 0) {
      if (cartItems.length) setProductsLoaded(true);
      return;
    }

    fetchProductsById(missingProdsId).then((data) => {
      if (data && data.products) {
        const products = data.products;
        setCartProducts((prevState) =>
          produce(prevState, (draft) => {
            for (const product of products) {
              draft[product._id] = product;
            }
          })
        );
        setProductsLoaded(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text={t("cart.title")} />
      </div>
      {productsLoaded && ( // ? ******** products
        <div>
          {cartItems.map((item, index) => {
            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={cartProducts[item.article.productId].images[0]}
                    className="w-16 sm:w-20"
                    alt=""
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {i18n.language === "uk"
                        ? cartProducts[item.article.productId].name_uk
                        : cartProducts[item.article.productId].name_en}
                    </p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {item.price} {t(currency)}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.article.size}</p>
                      <div className="flex gap-2 items-center px-2 sm:px-3 sm:py-1 border bg-slate-50">
                        <div
                          className="rounded-full w-4 h-4 border border-gray-400"
                          style={{
                            backgroundColor: getColor(item)?.hex,
                          }}
                        ></div>
                        {(i18n.language === "uk"
                          ? getColor(item)?.name_uk
                          : getColor(item)?.name_en) ?? item.article.colorCode}
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateProductQuantity(
                          item.article.productId,
                          item.article.size,
                          item.article.colorCode,
                          Number(e.target.value),
                          item.price
                        )
                  }
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                <img
                  onClick={() =>
                    updateProductQuantity(
                      item.article.productId,
                      item.article.size,
                      item.article.colorCode,
                      0,
                      item.price
                    )
                  }
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt=""
                />
              </div>
            );
          })}
        </div>
      )}

      {/* //? CART TOTAL */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              {t("cart.proceed-to-checkout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
