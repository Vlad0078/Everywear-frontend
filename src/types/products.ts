interface ProductData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  date: number;
  bestseller: boolean;
}

// Cart
interface CartProductData {
  [_id: string]: {
    [size: string]: { quantity: number };
  };
}

interface CartDataFlat {
  _id: string;
  size: string;
  quantity: number;
}

// Order
interface OrderItem extends ProductData {
  size: string;
  quantity: number;
}

interface UserAddressInfo {
  firstName: string;
  surName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  region: string;
  zipcode: string;
  country: string;
  phone: string;
}

interface OrderData {
  _id: string;
  userId: string;
  items: OrderItem[];
  amount: number;
  address: UserAddressInfo;
  status: string;
  paymentMethod: string;
  payment: boolean;
  date: number;
}

interface OrderItemWithData extends OrderItem {
  amount: number;
  address: UserAddressInfo;
  status: string;
  paymentMethod: string;
  payment: boolean;
  date: number;
}

export type {
  ProductData,
  CartProductData,
  CartDataFlat,
  UserAddressInfo,
  OrderItem,
  OrderData,
  OrderItemWithData,
};
