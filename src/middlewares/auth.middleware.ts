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

  try {
    const result = getUserData(token);
    if (!result) {
      response.unauthorized(res, "Middleware - Data not found");
      return;
    }

    (req as IReqUser).user = result;
    next();
  } catch (error) {
    const err = error as unknown as Error;
    response.unauthorized(res, `${err.message}`);
  }
};
