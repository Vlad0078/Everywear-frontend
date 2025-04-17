import React from "react";
import { useCartTotalCost, useShopStore } from "../store/store";
import Title from "./Title";
import { useTranslation } from "react-i18next";

const CartTotal: React.FC = () => {
  const { t } = useTranslation();

  const cartTotalCost = useCartTotalCost();

  const currency = useShopStore((state) => state.currency);
  // const delivery_fee = useShopStore((state) => state.delivery_fee);

  return (
    <div className="w-full">
      <div className="text-2xl flex justify-end">
        <Title text={t("cart.total-cost")} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        {/* <div className="flex justify-between">
          <p>{t("cart.subtotal")}</p>
          <p>
            {cartTotalCost}.00 {t(currency)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>{t("cart.delivery-fee")}</p>
          <p>
            {delivery_fee}.00 {t(currency)}
          </p>
        </div>
        <div className="flex justify-between">
          <b>{t("cart.total")}</b>
          <b>
            {cartTotalCost === 0 ? 0 : cartTotalCost + delivery_fee}.00 {t(currency)}
          </b>
        </div> */}
        <div className="flex justify-end">
          {/* <div></div> */}
          {/* <p className="text-lg">{t("cart.total")}</p> */}
          <b className="text-lg">
            {cartTotalCost}.00 {t(currency)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
