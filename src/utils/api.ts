import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../constants";
import {
  CategoriesResponseBody as CatResBody,
  CategoriesRequestBody as CatReqBody,
  ResponseBody,
  SubcategoriesRequestBody as SubReqBody,
  SubcategoriesResponseBody as SubResBody,
  SizesRequestBody as SizesReqBody,
  SizesResponseBody as SizesResBody,
  ColorsRequestBody as ColorsReqBody,
  ColorsResponseBody as ColorsResBody,
  BrandsRequestBody,
  BrandsResponseBody,
  ListProductsResponseBody,
  ListProductsRequestBody,
  ProductsByIdRequestBody,
  ProductsByIdResponseBody,
  GetCartResponseBody,
  UpdateCartRequestBody,
  PlaceOrderRequestBody,
  StripeResponseBody,
} from "../types/api-requests";
import { OrderData } from "../types/product";

//post
const fetchData = async <ReqBody, ResBody extends ResponseBody>(
  endpoint: string,
  body?: ReqBody,
  headers?: object
) => {
  try {
    const response = await axios.post<ResBody, AxiosResponse<ResBody>, ReqBody>(
      backendUrl + endpoint,
      body,
      { headers }
    );
    if (response.data.success) {
      return response.data;
    } else {
      toast.error(response.data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchCategories = async (config?: CatReqBody) => {
  return fetchData<CatReqBody, CatResBody>("/api/category/", config ?? {});
};

const fetchSubcategories = async (config?: SubReqBody) => {
  return fetchData<SubReqBody, SubResBody>("/api/subcategory/", config ?? {});
};
const fetchBrands = async (config?: BrandsRequestBody) => {
  return fetchData<BrandsRequestBody, BrandsResponseBody>("/api/brand/", config ?? {});
};
const fetchSizes = async (config?: SizesReqBody) => {
  return fetchData<SizesReqBody, SizesResBody>("/api/size/", config ?? {});
};
const fetchColors = async (config?: ColorsReqBody) => {
  return fetchData<ColorsReqBody, ColorsResBody>("/api/color/", config ?? {});
};
const fetchProducts = async (filters?: ListProductsRequestBody) => {
  return fetchData<ListProductsRequestBody, ListProductsResponseBody>(
    "/api/product/list/",
    filters
  );
};

const fetchProductsById = async (id: string | string[]) => {
  return fetchData<ProductsByIdRequestBody, ProductsByIdResponseBody>(
    "/api/product/productsById/",
    {
      id,
    }
  );
};

const fetchUserCart = async (token: string) => {
  return fetchData<unknown, GetCartResponseBody>("/api/cart/get", {}, { token });
};

const updateCart = async (
  cartItemData: { productId: string; size: string; colorCode: string; quantity: number },
  token: string
) => {
  return fetchData<UpdateCartRequestBody, ResponseBody>("/api/cart/update", cartItemData, {
    token,
  });
};

// ?
const placeOrderCod = async (orderData: OrderData, token: string) => {
  return fetchData<PlaceOrderRequestBody, ResponseBody>(
    "/api/order/place",
    { order: orderData },
    {
      token,
    }
  );
};

const placeOrderStripe = async (orderData: OrderData, token: string) => {
  return fetchData<PlaceOrderRequestBody, StripeResponseBody>(
    "/api/order/stripe",
    { order: orderData },
    {
      token,
    }
  );
};

export {
  fetchCategories,
  fetchSubcategories,
  fetchSizes,
  fetchColors,
  fetchBrands,
  fetchProducts,
  fetchProductsById,
  fetchUserCart,
  updateCart,
  placeOrderCod,
  placeOrderStripe,
};
