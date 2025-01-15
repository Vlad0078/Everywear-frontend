export interface ProductData {
  _id: string;
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

export interface CartProductData {
  [_id: string]: {
    [size: string]: { quantity: number };
  };
}

export interface CartDataFlat {
  _id: string;
  size: string;
  quantity: number;
}
