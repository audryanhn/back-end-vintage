import { Request, Response } from "express";
import productModel from "../models/product.model";
import response from "../utils/response";

export default {
  async getProducts(req: Request, res: Response) {
    try {
      const { identifier } = req.body;
      const result = await productModel.find({
        $or: [
          {
            brand: identifier,
          },
          {
            category: identifier,
          },
        ],
      });

      if (!result) {
        response.badRequest(res, "Product not found");
        return;
      }

      response.success(res, "Product Found!", result);
    } catch (error) {
      const err = error as unknown as Error;

      response.badRequest(res, `Something went wrong : ${err.message}`);
    }
  },
};
