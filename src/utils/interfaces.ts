import { Request } from "express";
import { Types } from "mongoose";

export interface IUser {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
}

// ------------------------- FOR JWT TOKEN START -------------------------

export interface IUserToken
  extends Omit<
    IUser,
    | "fullName"
    | "username"
    | "email"
    | "password"
    | "profilePicture"
    | "isActive"
    | "activationCode"
  > {
  id: Types.ObjectId;
}

export interface IReqUser extends Request {
  user?: IUserToken; // ini isinya cuman id sama roles
}

// ------------------------- FOR JWT TOKEN END -------------------------

// ------------------------- FOR JWT TOKEN START -------------------------

export interface IProduct {
  brand: string;
  category: string;
  condition: string;
  description: string;
  from: string;
  images: Array<string>;
  price: number;
  product_name: string;
  shipping: number;
  size: string;
  store_name: string;
}

// ------------------------- FOR JWT TOKEN END -------------------------
