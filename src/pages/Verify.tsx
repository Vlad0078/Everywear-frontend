import React, { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearCart, useShopStore } from "../store/store";
import axios, { AxiosResponse } from "axios";
import { ResponseBody, VerifyStripeRequestBody } from "../types/api-requests";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";

interface VerifyProps {
  paymentMethod: "stripe" | "plata";
}

const Verify: React.FC<VerifyProps> = ({ paymentMethod }) => {
  const navigate = useNavigate();
  const token = useShopStore((state) => state.token);

  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = useCallback(async () => {
    if (!token || success === null || orderId === null) return null;

    try {
      // plata
      if (paymentMethod === "plata") {
        clearCart();
        navigate("/orders");
        return;
      }

      // verify stripe
      const response = await axios.post<
        ResponseBody,
        AxiosResponse<ResponseBody>,
        VerifyStripeRequestBody
      >(
        backendUrl + "/api/order/verifyStripe",
        {
          orderId,
          success,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        clearCart();
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    }
  }, [navigate, orderId, paymentMethod, success, token]);

  useEffect(() => {
    verifyPayment();
  }, [token, verifyPayment]);

  return <div>Підтвердження оплати...</div>;
};

export default Verify;
