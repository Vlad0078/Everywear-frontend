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
  PlataResponseBody,
  SizeTablesResponseBody,
  UpdateProfileRequestBody,
  ChangePasswordRequestBody,
  RequestEmailChangeBody,
  ConfirmEmailChangeBody,
  DeleteProfileRequestBody,
  UserRequestBody,
  UserResponseBody,
  TryOnResponseBody,
  VtonHistoryResponseBody,
} from "../types/api-requests";
import { OrderData } from "../types/product";
import { UserPublicInfo } from "../types/user";

// Інтерфейси для відповідей API Нової Пошти
interface City {
  Ref: string;
  Description: string;
}

interface Warehouse {
  Ref: string;
  Description: string;
}

interface NovaPoshtaResponseBody<T> {
  success: boolean;
  data: T[];
  errors: string[];
  warnings: string[];
  message?: string;
}

// Функція для універсальних POST-запитів
const fetchData = async <ReqBody, ResBody extends ResponseBody>(
  endpoint: string,
  body?: ReqBody,
  headers?: object,
  timeout: number = 10000
) => {
  try {
    const response = await axios.post<ResBody, AxiosResponse<ResBody>, ReqBody>(
      backendUrl + endpoint,
      body,
      { headers, timeout }
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

const fetchSizeTables = async () => {
  return fetchData<object, SizeTablesResponseBody>("/api/size/sizetables");
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

const placeOrderCod = async (orderData: OrderData, token: string) => {
  return fetchData<PlaceOrderRequestBody, ResponseBody>(
    "/api/order/place",
    { order: orderData },
    {
      token,
    }
  );
};

const placeOrderPlata = async (orderData: OrderData, token: string) => {
  return fetchData<PlaceOrderRequestBody, PlataResponseBody>(
    "/api/order/plata",
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

// Нова Пошта
// Отримати області
const fetchRegions = async () => {
  return fetchData<unknown, NovaPoshtaResponseBody<Area>>("/api/novapost/areas");
};

// Отримати міста за областю
const fetchCities = async (areaRef: string) => {
  return fetchData<{ areaRef: string }, NovaPoshtaResponseBody<City>>("/api/novapost/cities", {
    areaRef,
  });
};

// Отримати відділення за містом
const fetchWarehouses = async (cityRef: string) => {
  return fetchData<{ cityRef: string }, NovaPoshtaResponseBody<Warehouse>>(
    "/api/novapost/warehouses",
    { cityRef }
  );
};

// Отримати відгуки
const fetchReviews = async (productId: string) => {
  return fetchData("/api/review/list", { productId });
};

// Залишити відгук
const submitReview = async (productId: string, rating: number, comment: string, token: string) => {
  return fetchData("/api/review/add", { productId, rating, comment }, { token });
};

// ? Керування обліковим записом
// Оновлення профілю користувача
const updateProfile = async (newProfileData: UpdateProfileRequestBody, token: string) => {
  const formData = new FormData();
  if (newProfileData.firstName) formData.append("firstName", newProfileData.firstName);
  if (newProfileData.lastName) formData.append("lastName", newProfileData.lastName);
  if (newProfileData.patronymic) formData.append("patronymic", newProfileData.patronymic);
  if (newProfileData.phone) formData.append("phone", newProfileData.phone);
  if (newProfileData.profilePicture)
    formData.append("profilePicture", newProfileData.profilePicture);

  try {
    const response = await axios.post<
      ResponseBody & { user?: UserPublicInfo },
      AxiosResponse<ResponseBody & { user?: UserPublicInfo }>,
      FormData
    >(backendUrl + "/api/user/updateProfile", formData, {
      headers: { token, "Content-Type": "multipart/form-data" },
    });
    if (response.data.success) {
      return response.data;
    } else {
      toast.error(response.data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
    toast.error("An unexpected error occurred.");
    return false;
  }
};

// Зміна паролю
const changePassword = async (body: ChangePasswordRequestBody, token: string) => {
  return fetchData<ChangePasswordRequestBody, ResponseBody>("/api/user/changePassword", body, {
    token,
  });
};

// Запит на зміну email
const requestEmailChange = async (body: RequestEmailChangeBody, token: string) => {
  return fetchData<RequestEmailChangeBody, ResponseBody>("/api/user/requestEmailChange", body, {
    token,
  });
};

// Підтвердження зміни email
const confirmEmailChange = async (body: ConfirmEmailChangeBody) => {
  return fetchData<ConfirmEmailChangeBody, ResponseBody>("/api/user/confirmEmailChange", body);
};

// Запит на відновлення паролю
const requestPasswordRecovery = async (email: string) => {
  return fetchData<{ email: string }, ResponseBody>("/api/user/requestPasswordRecovery", { email });
};

// Підтвердження відновлення паролю
const confirmPasswordRecovery = async (token: string, newPassword: string) => {
  return fetchData<{ token: string; newPassword: string }, ResponseBody>(
    "/api/user/confirmPasswordRecovery",
    { token, newPassword }
  );
};

// Видалення профілю
const deleteUserProfile = async (body: DeleteProfileRequestBody, token: string) => {
  return fetchData<DeleteProfileRequestBody, ResponseBody>("/api/user/deleteUserProfile", body, {
    token,
  });
};

// Отримання профілю
const fetchUserInfo = async (userId: string, token: string) => {
  return fetchData<UserRequestBody, UserResponseBody>(
    "/api/user/profileInfo",
    { userId },
    {
      token,
    }
  );
};

// ? VTON
// Створення нової примірки
const createTryOn = async (productId: string, token: string, personImage: File) => {
  const formData = new FormData();
  formData.append("productId", productId);
  formData.append("personImage", personImage);

  return fetchData<FormData, TryOnResponseBody>("/api/vton/try-on", formData, { token }, 120000);
};

// Отримання історії примірок
const getTryOnHistory = async (token: string) => {
  return fetchData<object, VtonHistoryResponseBody>("/api/vton/history", {}, { token });
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
  placeOrderPlata,
  fetchCities,
  fetchWarehouses,
  fetchRegions,
  fetchSizeTables,
  updateProfile,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
  requestPasswordRecovery,
  confirmPasswordRecovery,
  deleteUserProfile,
  fetchUserInfo,
  createTryOn,
  getTryOnHistory,
  fetchReviews,
  submitReview,
};
