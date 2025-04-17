import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { clearCart, useShopStore } from "../store/store";
import { OrderData, UserAddressInfo } from "../types/product";
import { ResponseBody } from "../types/api-requests";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import { placeOrderCod, placeOrderStripe } from "../utils/api";

const PlaceOrder: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const token = useShopStore((state) => state.token);
  const cartItems = useShopStore((state) => state.cartItems);

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
      if (!cartItems.length) {
        toast.error(t("place-order.cart-empty-error"));
        return;
      }

      const order: OrderData = {
        _id: "",
        customerId: "",
        items: cartItems,
        amount: 0,
        address: formData,
        status: "order-placed",
        paymentMethod: "cod",
        payment: false,
      };

      switch (paymentMethod) {
        case "cod": {
          const response = await placeOrderCod(order, token);
          if (response) {
            clearCart();
            navigate("/orders");
          } else {
            toast.error(t("place-order.place-error"));
          }
          break;
        }

        case "stripe": {
          order.paymentMethod = "stripe";
          const response = await placeOrderStripe(order, token);
          if (response) {
            clearCart();
            const session_url = response.session_url!;
            // перенаправлення користувача на сторінку оплати
            window.location.replace(session_url);
            clearCart();
          } else {
            toast.error(t("place-order.place-error"));
          }
          break;
        }

        default:
          toast.error(t("place-order.place-error"));
          return;
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
      {/* // ? ------------ USER ADDRESS DATA ------------ */}
      <div className="flex flex-col gap-4 w-full max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text={t("place-order.delivery-info")} />
        </div>

        <div className="flex gap-3">
          {/* // ? ------------ LAST NAME ------------ */}
          <TextField
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            label={t("place-order.last-name")}
            variant="outlined"
            size="small"
            required
          />

          {/* // ? ------------ FIRST NAME ------------ */}
          <TextField
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            label={t("place-order.first-name")}
            variant="outlined"
            size="small"
            required
          />

          {/* // ? ------------ SURNAME ------------ */}
          <TextField
            onChange={onChangeHandler}
            name="surName"
            value={formData.surName}
            label={t("place-order.surname")}
            variant="outlined"
            size="small"
            required
          />
        </div>

        {/* // ? ------------ EMAIL ------------ */}
        <TextField
          onChange={onChangeHandler}
          type="email"
          name="email"
          value={formData.email}
          label={t("place-order.email")}
          variant="outlined"
          size="small"
          required
        />

        <div className="flex gap-3">
          {/* // ? ------------ REGION ------------ */}
          <TextField
            onChange={onChangeHandler}
            name="region"
            value={formData.region}
            label={t("place-order.region-placeholder")}
            variant="outlined"
            size="small"
            required
          />

          {/* // ? ------------ CITY ------------ */}
          <TextField
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            label={t("place-order.city-placeholder")}
            variant="outlined"
            size="small"
            required
          />
        </div>

        <div className="flex gap-3">
          {/* // ? ------------ STREET ------------ */}
          <TextField
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            label={t("place-order.street-placeholder")}
            variant="outlined"
            size="small"
            required
          />

          {/* // ? ------------ ZIPCODE ------------ */}
          <TextField
            onChange={onChangeHandler}
            name="zipcode"
            type="number"
            value={formData.zipcode}
            label={t("place-order.zipcode-placeholder")}
            variant="outlined"
            size="small"
            className="no-controls"
            required
          />

          {/* // ? ------------ COUNTRY ------------ */}
          {/* <TextField
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            label={t("place-order.country-placeholder")}
            variant="outlined"
            size="small"
            required
          /> */}
        </div>

        {/* // ? ------------ PHONE ------------ */}
        <TextField
          onChange={onChangeHandler}
          name="phone"
          type="tel"
          value={formData.phone}
          label={t("place-order.phone-placeholder")}
          variant="outlined"
          size="small"
          className="no-controls"
          required
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
            <button type="submit" className="bg-black text-white px-16 py-3 text-sm">
              {t("place-order.place-order-btn")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
