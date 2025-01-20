import { create } from "zustand";
import { CartProductData, ProductData } from "../types/products";
import { produce } from "immer";
import axios, { AxiosResponse } from "axios";
import { backendUrl } from "../constants";
import {
  AddToCartRequestBody,
  GetCartResponseBody,
  ListProductsResponseBody,
  ResponseBody,
  UpdateCartRequestBody,
} from "../types/api-requests";
import { toast } from "react-toastify";
import { t } from "i18next";

type ShopState = {
  products: ProductData[];
  currency: string;
  delivery_fee: number;
  search: string;
  showSearch: boolean;
  cartItems: CartProductData;
  token: string;
};

// * Defaults

const initialState: ShopState = {
  products: [],
  currency: "$",
  delivery_fee: 10,
  search: "",
  showSearch: false,
  cartItems: {},
  token: localStorage.getItem("token") || "",
};

// * Store
const useShopStore = create<ShopState>()(() => initialState);

// * Actions
const setSearch = (search: string) => useShopStore.setState({ search });

// ? Token
const setToken = (token: string) => useShopStore.setState({ token });

const setShowSearch = (showSearch: boolean) =>
  useShopStore.setState({ showSearch });

// ? Add to Cart
const addToCart = async (productId: string, size: string) => {
  useShopStore.setState((state) =>
    produce(state, (draft: ShopState) => {
      if (draft.cartItems[productId]) {
        if (draft.cartItems[productId][size]) {
          // вже є такий розмір
          draft.cartItems[productId][size].quantity += 1;
        } else {
          draft.cartItems[productId][size] = { quantity: 1 }; // такого розміру ще немає
        }
      } else {
        draft.cartItems[productId] = { [size]: { quantity: 1 } }; // такого id ще немає
      }
    })
  );

  // оновлюємо на сервері
  const { token } = useShopStore.getState();

  if (token) {
    try {
      await axios.post<
        ResponseBody,
        AxiosResponse<ResponseBody>,
        AddToCartRequestBody
      >(
        backendUrl + "/api/cart/add",
        { productId, size },
        { headers: { token } }
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    }
  }
};

const clearCart = () => useShopStore.setState({ cartItems: {} });

const updateProductQuantity = async (
  productId: string,
  size: string,
  quantity: number
) => {
  useShopStore.setState((state) =>
    produce(state, (draft: ShopState) => {
      if (draft.cartItems[productId] && draft.cartItems[productId][size]) {
        draft.cartItems[productId][size].quantity = quantity;
      } else {
        throw new Error("No such product in a cart!");
      }
    })
  );

  // оновлюємо на сервері
  const { token } = useShopStore.getState();

  if (token) {
    try {
      await axios.post<
        ResponseBody,
        AxiosResponse<ResponseBody>,
        UpdateCartRequestBody
      >(
        backendUrl + "/api/cart/update",
        { productId, size, quantity },
        { headers: { token } }
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    }
  }
};

const fetchProducts = async () => {
  try {
    const response = await axios.get<ListProductsResponseBody>(
      backendUrl + "/api/product/list"
    );
    if (response.data.success) {
      useShopStore.setState({ products: response.data.products });
    } else {
      toast.error(t("store.fetch-product-list-error"));
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};

const fetchUserCart = async () => {
  const { token } = useShopStore.getState();

  try {
    const response = await axios.post<GetCartResponseBody>(
      backendUrl + "/api/cart/get",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      useShopStore.setState({ cartItems: response.data.cartData });
    } else {
      toast.error(t("store.fetch-product-list-error"));
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) toast.error(error.message);
  }
};

const useCartCount = () => {
  return useShopStore((state) => {
    let totalCount = 0;
    for (const id in state.cartItems) {
      for (const size in state.cartItems[id]) {
        totalCount += state.cartItems[id][size].quantity;
      }
    }

    return totalCount;
  });
};

const useCartTotalCost = () => {
  //! async ?
  return useShopStore((state) => {
    let totalCost = 0;
    for (const id in state.cartItems) {
      const product = state.products.find((product) => product._id === id); // ! тут може бути помилка
      if (product === undefined) {
        // throw new Error(`No products with id ${id}`);
        return 0;
      }

      for (const size in state.cartItems[id]) {
        if (state.cartItems[id][size].quantity > 0) {
          totalCost += product.price * state.cartItems[id][size].quantity;
        }
      }
    }

    return totalCost;
  });
};

export {
  useShopStore,
  setSearch,
  setToken,
  setShowSearch,
  addToCart,
  clearCart,
  updateProductQuantity,
  fetchProducts,
  fetchUserCart,
  useCartCount,
  useCartTotalCost,
};
