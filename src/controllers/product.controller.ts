import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import productModel from "../models/product.model";
import { IProduct } from "../utils/interfaces";
import response from "../utils/response";

export default {
  async addProduct(req: Request, res: Response) {
    /**
     #swagger.tags = ['Product']
     #swagger.requestBody = {
        required : true,
        content : {
        "application/json" : {
        schema : {$ref : "#/components/schemas/ProductRegisterRequest"}
            
          }
        }
     }
     */

    const {
      brand,
      category,
      condition,
      description,
      from,
      images,
      price,
      product_name,
      shipping,
      size,
      store_name,
      like,
    } = req.body as IProduct;
    try {
      const result = await productModel.create({
        brand,
        category,
        condition,
        description,
        from,
        images,
        price,
        product_name,
        shipping,
        size,
        store_name,
        like,
      });

      if (!result) {
        response.badRequest(res, "Error occured while adding product");
        return;
      }

      response.success(res, "Success add product!", result);
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `Add Product error - ${err.message}`);
    }
  },

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

  async getProductByIdentifier(req: Request, res: Response) {
    /**
     #swagger.tags=['Product']
     */
    const { identifier } = req.params;

    try {
      const result = await productModel.find({
        $or: [
          { category: { $regex: identifier, $options: "i" } },
          { brand: { $regex: identifier, $options: "i" } },
          { condition: { $regex: identifier, $options: "i" } },
          { from: { $regex: identifier, $options: "i" } },
        ],
      });

      if (!result || result.length === 0)
        response.notFound(res, "identifier Not Found!");

      response.success(res, "success get data by identifier", result);
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(
        res,
        `Error - getProductByIdentifier : ${err.message}`
      );
    }
  },
};
