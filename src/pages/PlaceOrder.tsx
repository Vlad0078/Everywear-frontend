import React, { ChangeEventHandler, FormEventHandler, useState, useEffect } from "react";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { clearCart, useShopStore } from "../store/store";
import { OrderData, UserAddressInfo } from "../types/product";
import { toast } from "react-toastify";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Autocomplete,
} from "@mui/material";
import {
  placeOrderCod,
  placeOrderStripe,
  placeOrderPlata,
  fetchCities,
  fetchWarehouses,
} from "../utils/api";

interface City {
  Ref: string;
  Description: string;
}

interface Warehouse {
  Ref: string;
  Description: string;
}

const PlaceOrder: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const token = useShopStore((state) => state.token);
  const cartItems = useShopStore((state) => state.cartItems);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "plata" | "stripe">("cod");
  const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "warehouse">("courier");
  const [formData, setFormData] = useState<UserAddressInfo>({
    firstName: "",
    surName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    cityRef: "",
    region: "",
    zipcode: "",
    phone: "",
    warehouse: "",
    warehouseRef: "",
  });
  const [cities, setCities] = useState<City[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  // Завантаження списку міст
  useEffect(() => {
    const loadCities = async () => {
      const response = await fetchCities();
      if (response && response.success) {
        setCities(response.data);
      } else {
        toast.error(t("place-order.cities-load-error"));
      }
    };
    if (deliveryMethod === "warehouse") {
      loadCities();
    }
  }, [deliveryMethod, t]);

  // Завантаження списку відділень
  useEffect(() => {
    const loadWarehouses = async () => {
      if (!formData.cityRef) {
        setWarehouses([]);
        return;
      }
      const response = await fetchWarehouses(formData.cityRef);
      if (response && response.success) {
        setWarehouses(response.data);
      } else {
        toast.error(t("place-order.warehouses-load-error"));
      }
    };
    if (deliveryMethod === "warehouse") {
      loadWarehouses();
    }
  }, [formData.cityRef, deliveryMethod, t]);

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

      // Валідація для кур'єрської доставки
      if (
        deliveryMethod === "courier" &&
        (!formData.city || !formData.street || !formData.region || !formData.zipcode)
      ) {
        toast.error(t("place-order.invalid-address"));
        return;
      }
      // Валідація для доставки у відділення
      if (deliveryMethod === "warehouse" && (!formData.cityRef || !formData.warehouseRef)) {
        toast.error(t("place-order.invalid-warehouse"));
        return;
      }

      const order: OrderData = {
        _id: "",
        customerId: "",
        items: cartItems,
        amount: 0,
        address: formData,
        status: "order-placed",
        paymentMethod,
        deliveryMethod,
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

        case "plata": {
          order.paymentMethod = "plata";
          const response = await placeOrderPlata(order, token);
          if (response) {
            clearCart();
            const session_url = response.session_url!;
            window.location.replace(session_url);
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
            window.location.replace(session_url);
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
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[56vh] border-t"
    >
      {/* Лівий блок: Інформація про доставку */}
      <div className="flex flex-col gap-4 w-full max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text={t("place-order.delivery-info")} />
        </div>

        {/* Перемикач способу доставки */}
        <FormControl component="fieldset">
          <FormLabel component="legend">{t("place-order.delivery-method")}</FormLabel>
          <RadioGroup
            row
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value as "courier" | "warehouse")}
          >
            <FormControlLabel
              value="courier"
              control={<Radio />}
              label={t("place-order.courier-delivery")}
            />
            <FormControlLabel
              value="warehouse"
              control={<Radio />}
              label={t("place-order.warehouse-delivery")}
            />
          </RadioGroup>
        </FormControl>

        {/* Поля для введення особистих даних */}
        <div className="flex gap-3">
          <TextField
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            label={t("place-order.last-name")}
            variant="outlined"
            size="small"
            required
          />
          <TextField
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            label={t("place-order.first-name")}
            variant="outlined"
            size="small"
            required
          />
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

        {/* Умовний рендеринг полів залежно від способу доставки */}
        {deliveryMethod === "courier" ? (
          <>
            <div className="flex gap-3">
              <TextField
                onChange={onChangeHandler}
                name="region"
                value={formData.region}
                label={t("place-order.region-placeholder")}
                variant="outlined"
                size="small"
                required
              />
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
              <TextField
                onChange={onChangeHandler}
                name="street"
                value={formData.street}
                label={t("place-order.street-placeholder")}
                variant="outlined"
                size="small"
                required
              />
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
            </div>
          </>
        ) : (
          <>
            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option.Description}
              onChange={(event, value) =>
                setFormData({
                  ...formData,
                  city: value?.Description || "",
                  cityRef: value?.Ref || "",
                  warehouse: "",
                  warehouseRef: "",
                })
              }
              value={cities.find((city) => city.Ref === formData.cityRef) || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("place-order.city-placeholder")}
                  variant="outlined"
                  size="small"
                  required
                />
              )}
            />
            <Autocomplete
              options={warehouses}
              getOptionLabel={(option) => option.Description}
              onChange={(event, value) =>
                setFormData({
                  ...formData,
                  warehouse: value?.Description || "",
                  warehouseRef: value?.Ref || "",
                })
              }
              disabled={!formData.cityRef}
              value={warehouses.find((wh) => wh.Ref === formData.warehouseRef) || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("place-order.warehouse-placeholder")}
                  variant="outlined"
                  size="small"
                  required
                />
              )}
            />
          </>
        )}

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

      {/* Правий блок: Кошик і методи оплати */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text={t("place-order.payment-method")} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setPaymentMethod("plata")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "plata" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.plata_logo} className="h-5 mx-4" alt="" />
            </div>
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
              <p className="text-gray-500 text-sm font-semibold mx-4">
                {t("place-order.cash-on-delivery")}
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button type="submit" className="bg-black text-white px-16 py-3 text-sm">
              {paymentMethod === "cod"
                ? t("place-order.place-order-btn")
                : t("place-order.proceed-to-payment")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
