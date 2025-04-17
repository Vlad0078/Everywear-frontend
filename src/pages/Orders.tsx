import React, { useCallback, useEffect, useState } from "react";
import { useShopStore } from "../store/store";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";
import { OrderItemWithData } from "../types/products";
import axios from "axios";
import { OrdersResponseBody } from "../types/api-requests";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";

const Orders: React.FC = () => {
  const { t } = useTranslation();

  const token = useShopStore((state) => state.token);
  const currency = useShopStore((state) => state.currency);

  const [orders, setOrders] = useState<OrderItemWithData[]>([]);

  const stringifyDate = (timestamp: number) => {
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day}, ${t(`month-names.short.${month}`)}, ${year}`;
  };

  const fetchOrders = useCallback(async () => {
    if (!token) {
      return [];
    }

    try {
      const response = await axios.post<OrdersResponseBody>(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const ordersData = response.data.orders!;
        const orders: OrderItemWithData[] = [];

        ordersData.forEach((orderData) => {
          orderData.items.forEach((item) => {
            orders.push({
              ...item,
              amount: orderData.amount,
              address: orderData.address,
              status: orderData.status,
              paymentMethod: orderData.paymentMethod,
              payment: orderData.payment,
              date: orderData.date,
            });
          });
        });

        setOrders(orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text={t("orders.orders-title")} />
      </div>

      <div>
        {orders.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img src={item.image[0]} className="w-16 sm:w-20" alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p className="text-lg">
                    {item.price} {t(currency)}
                  </p>
                  <p>
                    {t("orders-page.item-quantity")}: {item.quantity}
                  </p>
                  <p>
                    {t("orders-page.item-size")}: {item.size}
                  </p>
                </div>
                <p className="mt-1">
                  {t("orders.purchase-date")}:{" "}
                  <span className="text-gray-500">{stringifyDate(item.date)}</span>
                </p>
                <p className="mt-1">
                  {t("orders.payment-method")}:{" "}
                  <span className="text-gray-500">{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{t(`orders.status.${item.status}`)}</p>
              </div>
              <button className="border px-4 py-2 text-sm font-medium rounded-sm">
                {t("orders.track-order")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
