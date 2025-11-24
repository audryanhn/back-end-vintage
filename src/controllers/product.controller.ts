import { Request, Response } from "express";
import productModel from "../models/product.model";
import response from "../utils/response";

export default {
  async getProducts(req: Request, res: Response) {
    /**
     #swagger.tags = ['Product']
     
     */

    try {
      const { identifier } = req.params;

      if (!identifier) {
        response.notFound(res, "Product Not Found");
        return;
      }

      const result = await productModel.find({
        $or: [
          {
            brand: new RegExp(`^${identifier}$`, "i"),
          },
          {
            category: new RegExp(`^${identifier}`, "i"),
          },
        ],
      });

      if (result.length === 0) {
        response.notFound(res, "Product not found");
        return;
      }

      response.success(res, "Product Found!", result);
    } catch (error) {
      const err = error as unknown as Error;

      response.badRequest(res, `Something went wrong : ${err.message}`);
    }
  },
};
