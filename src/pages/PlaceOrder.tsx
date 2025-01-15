import React, { useState } from "react";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const PlaceOrder: React.FC = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* // ? ------------ LEFT SIDE ------------ */}
      <div className="flex flex-col gap-4 w-full max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text={t("place-order.delivery-info")} />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.first-name")}
          />
          {i18n.language === "uk" ? (
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder={t("place-order.surname")}
            />
          ) : null}
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.last-name")}
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder={t("place-order.email")}
        />
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder={t("place-order.street-placeholder")}
        />

        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.city-placeholder")}
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.region-placeholder")}
          />
        </div>

        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full no-controls"
            type="number"
            placeholder={t("place-order.zipcode-placeholder")}
          />

          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder={t("place-order.country-placeholder")}
          />
        </div>

        <input
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
              onClick={() => navigate("/orders")}
              className="bg-black text-white px-16 py-3 text-sm"
            >
              {t("place-order.place-order-btn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
