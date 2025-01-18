import { CartProductData, ProductData } from "./products";
import { Request } from "express";
import { IncomingHttpHeaders } from "http";

interface CustomRequest extends Request {
  headers: IncomingHttpHeaders & {
    token?: string; // security
  };
}

interface ResponseBody {
  success: boolean;
  message?: string;
  token?: string;
  [key: string]: any;
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

export {
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
};
