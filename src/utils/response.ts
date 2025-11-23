import { Response } from "express";

export default {
  success(res: Response, message: string, data: any) {
    return res.status(200).json({
      meta: { status: "200 - SUCCESS", message },
      data,
    });
  },
  badRequest(res: Response, message: string, data: any = null) {
    return res
      .status(400)
      .json({ meta: { status: "400 - Bad Request", message }, data });
  },
  forbidden(res: Response, message: string, data: any = null) {
    return res.status(403).json({
      meta: {
        status: "403 - Forbidden",
        message,
      },
      data,
    });
  },
};
