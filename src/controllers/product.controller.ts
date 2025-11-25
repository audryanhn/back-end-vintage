import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import productModel from "../models/product.model";
import response from "../utils/response";

export default {
  async getProductById(req: Request, res: Response) {
    /**
     #swagger.tags = ['Product']
     
     */

    try {
      const { id } = req.params;

      if (!id) {
        response.notFound(res, "Product Not Found");
        return;
      }

      const result = await productModel.findById(id);

      if (!result) {
        response.notFound(res, "Product not found");
        return;
      }

      response.success(res, "Product Found!", result);
    } catch (error) {
      const err = error as unknown as Error;

      response.badRequest(res, `Something went wrong : ${err.message}`);
    }
  },

  async getAllProducts(req: Request, res: Response) {
    /**
     #swagger.tags = ['Product']
     */
    try {
      const result = await productModel.find();

      if (!result) {
        response.notFound(res, "No Products Found");
        return;
      }

      response.success(res, "Success get all products data", result);
    } catch (error) {
      if (error instanceof MongooseError) {
        response.badRequest(res, `get all product error : ${error.message}`);
      }
    }
  },
};
