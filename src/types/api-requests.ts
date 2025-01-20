import { Request } from "express";
import { IncomingHttpHeaders } from "http";
import {
  CartProductData,
  OrderData,
  OrderItem,
  ProductData,
  UserAddressInfo,
} from "./products";

interface CustomRequest extends Request {
  headers: IncomingHttpHeaders & {
    token?: string; // security
  };
}

interface ResponseBody {
  success: boolean;
  message?: string;
  token?: string;
  [key: string]: unknown;
}

// user
interface LoginRequestBody {
  email: string;
  password: string;
}

interface RegisterRequestBody extends LoginRequestBody {
  name: string;
}

// product
interface AddProductRequestBody {
  name: string;
  description: string;
  price: string;
  category: string;
  subCategory: string;
  sizes: string;
  bestseller: string;
}

interface SingleProductRequestBody {
  id: string;
}

interface SingleProductResponseBody extends ResponseBody {
  product?: ProductData;
}

interface ListProductsResponseBody extends ResponseBody {
  products?: ProductData[];
}

// cart
interface AddToCartRequestBody {
  productId: string;
  size: string;
}

interface UpdateCartRequestBody extends AddToCartRequestBody {
  quantity: number;
}

interface GetCartResponseBody extends ResponseBody {
  cartData?: CartProductData;
}

// orders
interface AllOrdersRequestBody {}
interface UpdateStatusRequestBody {
  orderId: string;
  status: string;
}

interface PlaceOrderRequestBody {
  items: OrderItem[];
  amount: number;
  address: UserAddressInfo;
}

interface VerifyStripeRequestBody {
  orderId: string;
  success: string;
}

interface PlaceOrderRazorpayRequestBody {}

interface OrdersResponseBody extends ResponseBody {
  orders?: OrderData[];
}

// payment
interface StripeResponseBody extends ResponseBody {
  session_url?: string | null;
}

export type {
  CustomRequest,
  ResponseBody,
  LoginRequestBody,
  RegisterRequestBody,
  AddProductRequestBody,
  SingleProductRequestBody,
  SingleProductResponseBody,
  ListProductsResponseBody,
  AddToCartRequestBody,
  UpdateCartRequestBody,
  GetCartResponseBody,
  AllOrdersRequestBody,
  UpdateStatusRequestBody,
  PlaceOrderRequestBody,
  VerifyStripeRequestBody,
  PlaceOrderRazorpayRequestBody,
  OrdersResponseBody,
  StripeResponseBody,
};
