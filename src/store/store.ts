import { create } from "zustand";
import { CartItem, ProductData } from "../types/product";
import { produce } from "immer";
import axios, { AxiosResponse } from "axios";
import { backendUrl } from "../constants";
import { AddToCartRequestBody, ListProductsRequestBody, ResponseBody } from "../types/api-requests";
import { toast } from "react-toastify";
import { Category } from "../types/category";
import { Subcategory } from "../types/subcategory";
import {
  fetchCategories,
  fetchProducts,
  fetchSubcategories,
  fetchUserCart,
  updateCart,
} from "../utils/api";

type ShopState = {
  products: ProductData[];
  categories: Category[];
  subcategories: Subcategory[];
  currency: string;
  delivery_fee: number;
  showSearch: boolean;
  cartItems: CartItem[];
  token: string;
};

// * Defaults

const initialState: ShopState = {
  products: [],
  categories: [],
  subcategories: [],
  currency: "currency_hrn",
  delivery_fee: 10,
  showSearch: false,
  cartItems: [],
  token: localStorage.getItem("token") || "",
};

// * Store
const useShopStore = create<ShopState>()(() => initialState);

// * Actions

// ? Token
const setToken = (token: string) => useShopStore.setState({ token });

const setShowSearch = (showSearch: boolean) => useShopStore.setState({ showSearch });

// ? Add to Cart
const addToCart = async (productId: string, size: string, colorCode: string, price: number) => {
  useShopStore.setState((state) =>
    produce(state, (draft: ShopState) => {
      const itemInCart = draft.cartItems.find((item) => {
        return (
          item.article.productId === productId &&
          item.article.size === size &&
          item.article.colorCode === colorCode
        );
      });

      if (itemInCart) {
        // вже є такий артикул
        itemInCart.quantity += 1;
      } else {
        // такого артикула ще немає
        draft.cartItems.push({
          article: {
            productId,
            size,
            colorCode,
          },
          quantity: 1,
          price,
        });
      }
    })
  );

  // оновлюємо на сервері
  const { token } = useShopStore.getState();

  if (token) {
    try {
      await axios.post<ResponseBody, AxiosResponse<ResponseBody>, AddToCartRequestBody>(
        backendUrl + "/api/cart/add",
        { productId, size, colorCode },
        { headers: { token } }
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    }
  }
};

const clearCart = () => useShopStore.setState({ cartItems: [] });

const updateProductQuantity = async (
  productId: string,
  size: string,
  colorCode: string,
  quantity: number,
  price: number
) => {
  useShopStore.setState((state) =>
    produce(state, (draft: ShopState) => {
      if (quantity === 0) {
        draft.cartItems = draft.cartItems.filter(
          (item) =>
            !(
              item.article.productId === productId &&
              item.article.size === size &&
              item.article.colorCode === colorCode
            )
        );
      } else {
        const itemInCart = draft.cartItems.find(
          (item) =>
            item.article.productId === productId &&
            item.article.size === size &&
            item.article.colorCode === colorCode
        );

        if (itemInCart) {
          if (itemInCart) {
            // вже є такий артикул
            itemInCart.quantity = quantity;
          } else {
            // такого артикула ще немає
            draft.cartItems.push({
              article: {
                productId,
                size,
                colorCode,
              },
              quantity,
              price,
            });
          }
        }
      }
    })
  );

  // оновлюємо на сервері
  const { token } = useShopStore.getState();

  if (token) {
    updateCart({ productId, size, colorCode, quantity }, token);
  }
};

// ? Fetch categories
const loadCategories = async () => {
  const data = await fetchCategories();
  if (data && data.categories) {
    useShopStore.setState({ categories: data.categories });
  }
};

// ? Fetch subcategories
const loadSubcategories = async () => {
  const data = await fetchSubcategories();
  if (data && data.subcategories) {
    useShopStore.setState({ subcategories: data.subcategories });
  }
};

const loadProducts = async (filter?: ListProductsRequestBody) => {
  const data = await fetchProducts(filter);
  if (data && data.products) {
    useShopStore.setState({ products: data.products });
  }
};

const loadUserCart = async () => {
  const { token } = useShopStore.getState();

  const data = await fetchUserCart(token);
  if (data && data.cartData) {
    useShopStore.setState({ cartItems: data.cartData });
  }
};

const useCartCount = () => {
  return useShopStore((state) => {
    return state.cartItems.reduce((totalCount, item) => totalCount + item.quantity, 0);
  });
};

const useCartTotalCost = () => {
  return useShopStore((state) => {
    return state.cartItems.reduce((totalCost, item) => {
      return totalCost + item.quantity * item.price;
    }, 0);
  });
};

export {
  useShopStore,
  setToken,
  setShowSearch,
  addToCart,
  clearCart,
  updateProductQuantity,
  loadUserCart,
  useCartCount,
  loadCategories,
  loadSubcategories,
  loadProducts,
  useCartTotalCost,
};
