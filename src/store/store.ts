import { create } from "zustand";
import { products } from "../assets/assets";
import { CartProductData, ProductData } from "../types/products";
import { produce } from "immer";

type ShopState = {
  products: ProductData[];
  currency: string;
  delivery_fee: number;
  search: string;
  showSearch: boolean;
  cartItems: CartProductData;
};

// * Defaults

const initialState: ShopState = {
  products: products,
  currency: "$",
  delivery_fee: 10,
  search: "",
  showSearch: false,
  cartItems: {},
};

// * Store
export const useShopStore = create<ShopState>()(() => initialState);

// * Actions
export const setSearch = (search: string) => useShopStore.setState({ search });

export const setShowSearch = (showSearch: boolean) =>
  useShopStore.setState({ showSearch });

// ! async ?
export const addToCart = async (itemId: string, size: string) =>
  useShopStore.setState((state) =>
    produce(state, (draft: ShopState) => {
      if (draft.cartItems[itemId]) {
        if (draft.cartItems[itemId][size]) {
          // вже є такий розмір
          draft.cartItems[itemId][size].quantity += 1;
        } else {
          draft.cartItems[itemId][size] = { quantity: 1 }; // такого розміру ще немає
        }
      } else {
        draft.cartItems[itemId] = { [size]: { quantity: 1 } }; // такого id ще немає
      }
    })
  );

export const updateProductQuantity = async (
  itemId: string,
  size: string,
  quantity: number
) =>
  useShopStore.setState((state) =>
    produce(state, (draft: ShopState) => {
      if (draft.cartItems[itemId] && draft.cartItems[itemId][size]) {
        draft.cartItems[itemId][size].quantity = quantity;
      } else {
        throw new Error("No such product in a cart!");
      }
    })
  );

export const useCartCount = () => {
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

export const useCartTotalCost = () => {
  //! async ?
  return useShopStore((state) => {
    let totalCost = 0;
    for (const id in state.cartItems) {
      const product = products.find((product) => product._id === id);
      if (product === undefined) {
        throw new Error(`No products with id ${id}`);
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
