import jwt from "jsonwebtoken";
import { SECRET } from "./env";
import type { IUserToken } from "./interfaces";

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });

  return token;
};

export const getUserData = (token: string): IUserToken => {
  const user = jwt.verify(token, SECRET) as IUserToken;

  return user;
};
