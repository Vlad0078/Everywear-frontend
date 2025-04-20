import React, { useCallback, useEffect, useState } from "react";
import { useShopStore } from "../store/store";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";
import axios, { AxiosResponse } from "axios";
import { ColorsRequestBody, ColorsResponseBody, OrdersResponseBody } from "../types/api-requests";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";
import { OrderData, ProductData } from "../types/product";
import { assets } from "../assets/assets";
import { fetchProducts } from "../utils/api";
import i18n from "../i18n";
import { Color } from "../types/color";

const Orders: React.FC = () => {
  const { t } = useTranslation();

  const token = useShopStore((state) => state.token);
  const currency = useShopStore((state) => state.currency);

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  const fetchColors = useCallback(async () => {
    try {
      const response = await axios.post<
        ColorsResponseBody,
        AxiosResponse<ColorsResponseBody>,
        ColorsRequestBody
      >(backendUrl + "/api/color/", {});
      if (response.data.success) {
        setColors(response.data.colors!);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : t("error.unexpected-error"));
    }
  }, [t]);

  const listProducts = useCallback(async () => {
    const data = await fetchProducts();
    if (data && data.products) {
      setAllProducts(data.products);
    }
  }, []);

  const stringifyDate = (timestamp: number) => {
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    // return `${day} ${t(`month-names.short.${month}`)} ${year}`;
    return `${year}-${month < 9 ? "0" : ""}${month + 1}-${day}`;
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
        console.log(response.data);

        const orders = response.data.orders!;
        // const orders: OrderData[] = [];

        // ordersData.forEach((orderData) => {
        //   orderData.items.forEach((item) => {
        //     orders.push({
        //       ...item,
        //       amount: orderData.amount,
        //       address: orderData.address,
        //       status: orderData.status,
        //       paymentMethod: orderData.paymentMethod,
        //       deliveryMethod: orderData.deliveryMethod,
        //       payment: orderData.payment,
        //     });
        //   });
        // });

        setOrders(orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    }
  }, [token]);

  const receiveHandler = async (orderId: string) => {
    if (!token) {
      return false;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/receive",
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    listProducts();
    fetchColors();
  }, [fetchColors, fetchOrders, listProducts]);

  useEffect(() => {
    console.log(orders);
  }, [orders]);
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text={t("orders.orders-title")} />
      </div>

      <div>
        {orders.map((order, index) => {
          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid gap-4 md:grid-cols-[3fr_1.5fr_1fr_1fr] md:gap-x-6 items-start"
            >
              {/* Колонка 1: Фото + товари */}
              <div className="flex items-start gap-4 text-sm">
                <img
                  className="w-16 sm:w-28 aspect-[3/4] object-cover"
                  src={
                    allProducts.find((prod) => prod._id === order.items[0].article.productId)
                      ?.images[0]
                  }
                  alt=""
                />
                <div>
                  <p className="text-gray-500 py-0.5 sm:text-lg font-normal">
                    {t("orders-page.product-list-title")}
                  </p>
                  {order.items.map((item, index) => (
                    <div key={index} className="py-0.5 sm:text-base font-medium">
                      <p className="py-1">
                        {
                          allProducts.find((prod) => prod._id === item.article.productId)?.[
                            i18n.language === "uk" ? "name_uk" : "name_en"
                          ]
                        }
                        , колір:{" "}
                        {colors
                          .find((color) => color.code === item.article.colorCode)
                          ?.[i18n.language === "uk" ? "name_uk" : "name_en"]?.toLocaleLowerCase()}
                        , {item.quantity} {t("orders-page.pcs")}.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Колонка 2: Інформація про замовлення */}
              <div className="text-gray-500 text-sm sm:text-base font-normal">
                <p className="py-0.5">
                  {t("orders-page.product-qty")}:{" "}
                  <span className="text-gray-700 font-medium">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </p>
                <p className="py-0.5">
                  {t("orders-page.order-amount")}:{" "}
                  <span className="text-gray-700 font-medium">
                    {order.amount} {t("currency_hrn")}
                  </span>
                </p>
                <p className="py-0.5">
                  {t("orders-page.payment-status")}:{" "}
                  <span className="text-gray-700 font-medium">
                    {order.payment
                      ? t("orders-page.payment-status-paid")
                      : t("orders-page.payment-status-not-paid")}
                  </span>
                </p>
                <p className="py-0.5">
                  Метод оплати:{" "}
                  <span className="text-gray-700 font-medium">
                    {t(`orders-page.payment-method-${order.paymentMethod}`)}
                  </span>
                </p>
              </div>

              {/* Колонка 3: Дата */}
              <div className="text-sm">
                <p className="text-gray-500 py-0.5 sm:text-base font-normal">
                  {t("orders-page.order-date")}:
                </p>
                <p className="text-gray-500 py-0.5 sm:text-base font-normal">
                  <span className="text-gray-700 font-medium">
                    {stringifyDate(order.createdAt)}
                  </span>
                </p>
              </div>

              {/* Колонка 4: Статус */}
              <div className="flex flex-col justify-center items-start h-full gap-5 text-base md:text-lg font-medium">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p>{t(`orders.status.${order.status}`)}</p>
                </div>
                {order.status === "Delivered" ? (
                  <button
                    className="border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition-all duration-500"
                    onClick={() => receiveHandler(order._id)}
                  >
                    Підтвердити отримання
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
