import { CartItem } from "./product";

export enum UserRole {
  guest = "guest",
  customer = "customer",
  manager = "manager",
  admin = "admin",
}

export interface UserPublicInfo {
  _id: string;
  lastName?: string;
  firstName: string;
  patronymic?: string;
  email: string;
  role: UserRole;
}

export interface User extends UserPublicInfo {
  password: string;
  cartData: CartItem[];
}
