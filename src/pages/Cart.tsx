import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateProductQuantity, useShopStore } from "../store/store";
import { CartDataFlat } from "../types/products";
import Title from "../components/Title";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const products = useShopStore((state) => state.products);
  const currency = useShopStore((state) => state.currency);
  const cartItems = useShopStore((state) => state.cartItems);

  const [cartData, setCartData] = useState<CartDataFlat[]>([]);

  useEffect(() => {
    const tempData: CartDataFlat[] = [];
    for (const id in cartItems) {
      for (const size in cartItems[id]) {
        if (cartItems[id][size].quantity > 0) {
          tempData.push({
            _id: id,
            size: size,
            quantity: cartItems[id][size].quantity,
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text={t("cart.title")} />
      </div>
      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          if (!productData) {
            toast.error(`No product with id ${item._id}`);
            return;
          }

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  src={productData.image[0]}
                  className="w-16 sm:w-20"
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateProductQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateProductQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>

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
