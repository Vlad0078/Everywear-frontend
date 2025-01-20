import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { clearCart, useCartTotalCost, useShopStore } from "../store/store";
import { OrderItem, UserAddressInfo } from "../types/products";
import axios, { AxiosResponse } from "axios";
import {
  PlaceOrderRequestBody,
  ResponseBody,
  StripeResponseBody,
} from "../types/api-requests";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";

const PlaceOrder: React.FC = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const token = useShopStore((state) => state.token);
  const cartItems = useShopStore((state) => state.cartItems);
  const products = useShopStore((state) => state.products);
  const amount = useCartTotalCost();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState<UserAddressInfo>({
    firstName: "",
    surName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    region: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler: FormEventHandler = async (event) => {
    event.preventDefault();
    try {
      const orderItems: OrderItem[] = [];
      for (const id in cartItems) {
        for (const size in cartItems[id]) {
          if (cartItems[id][size].quantity > 0) {
            const product = products.find((product) => product._id === id);
            if (!product) throw new Error(t("product.not-found-error"));
            const itemInfo: OrderItem = {
              ...product,
              size: size,
              quantity: cartItems[id][size].quantity,
            };
            orderItems.push(itemInfo);
          }
        }
      }

      if (!orderItems.length)
        throw new Error(t("place-order.cart-empty-error"));

      const orderData = {
        items: orderItems,
        amount: amount,
        address: formData,
      };

      switch (paymentMethod) {
        case "cod": {
          const response = await axios.post<
            ResponseBody,
            AxiosResponse<ResponseBody>,
            PlaceOrderRequestBody
          >(backendUrl + "/api/order/place", orderData, { headers: { token } });
          if (response.data.success) {
            clearCart();
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case "stripe": {
          const response = await axios.post<
            StripeResponseBody,
            AxiosResponse<StripeResponseBody>,
            PlaceOrderRequestBody
          >(backendUrl + "/api/order/stripe", orderData, {
            headers: { token },
          });
          if (response.data.success && response.data.session_url) {
            const { session_url } = response.data;
            // перенаправлення користувача на сторінку
            window.location.replace(session_url);
            clearCart();
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        // ! ...

        default:
          return; // !
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* // ? ------------ LEFT SIDE ------------ */}
      <div className="flex flex-col gap-4 w-full max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text={t("place-order.delivery-info")} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.first-name")}
          />
          {i18n.language === "uk" ? (
            <input
              required
              onChange={onChangeHandler}
              name="surName"
              value={formData.surName}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder={t("place-order.surname")}
            />
          ) : null}
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.last-name")}
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder={t("place-order.email")}
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder={t("place-order.street-placeholder")}
        />

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.city-placeholder")}
          />
          <input
            required
            onChange={onChangeHandler}
            name="region"
            value={formData.region}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.region-placeholder")}
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full no-controls"
            type="number"
            placeholder={t("place-order.zipcode-placeholder")}
          />

          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.country-placeholder")}
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full no-controls"
          type="number"
          placeholder={t("place-order.phone-placeholder")}
        />
      </div>

      {/* // ? ------------ RIGHT SIDE ------------ */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text={t("place-order.payment-method")} />

          {/* // ? ------------ PAYMENT METHOD SELECTION ------------ */}

          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setPaymentMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.stripe_logo} className="h-5 mx-4" alt="" />
            </div>

            <div
              onClick={() => setPaymentMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.razorpay_logo} className="h-5 mx-4" alt="" />
            </div>

            <div
              onClick={() => setPaymentMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                {t("place-order.cash-on-delivery")}
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              {t("place-order.place-order-btn")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
