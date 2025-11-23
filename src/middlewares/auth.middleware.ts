import { NextFunction, Response } from "express";
import type { IReqUser } from "../utils/interfaces";
import { getUserData } from "../utils/jwt";
import response from "../utils/response";

export default (req: IReqUser, res: Response, next: NextFunction) => {
  const authorization: string | undefined = req.headers?.authorization;

  if (!authorization) {
    response.unauthorized(res, "Unauthorized, please add your accessToken");
    return;
  }

  const [prefix, token] = authorization?.split(" ");

  if (!(prefix === "Bearer" && token)) {
    response.unauthorized(res, "Unauthorized, token is invalid");
  }

  const result = getUserData(token);

  if (!result) {
    response.forbidden(res, "Middleware - Data not found");
    return;
  }

  (req as IReqUser).user = result;
  next();
};
