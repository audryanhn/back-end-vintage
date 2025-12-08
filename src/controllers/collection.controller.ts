import { Request, Response } from "express";
import productModel from "../models/product.model";
import response from "../utils/response";

export default {
  async getProductByFilter(req: Request, res: Response) {
    /**
     #swagger.tags = ['Product']
     */
    const { type, orderBy } = req.params;
    const { lowest, highest } = req.body;

    let priceFilter: any = {};
    if (highest > 0 || lowest > 0) {
      priceFilter.price = {};
      if (lowest > 0) priceFilter.price.$gte = lowest;
      if (highest > 0) priceFilter.price.$lte = highest;
    }

    try {
      if (type === "like") {
        const result = await productModel
          .find()
          .sort({ like: orderBy === "ascending" ? 1 : -1 })
          .limit(6);
        response.success(res, "Filter By Like - Descending", result);
        return;
      }

      if (type === "price") {
        const result = await productModel
          .find(priceFilter)
          .sort({ price: orderBy === "ascending" ? 1 : -1 })
          .limit(6);

        response.success(res, `Success sorting price - ${orderBy}`, result);
        return;
      }

      if (type === "date") {
        const result = await productModel
          .find()
          .sort({ createdAt: orderBy === "ascending" ? 1 : -1 })
          .limit(6);
        response.success(res, `Success sorting date - ${orderBy}`, result);
        return;
      }
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(
        res,
        `Collection - getProductByFilter error : ${err.message}`
      );
    }
  },
};
