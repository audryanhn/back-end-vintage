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

     #swagger.requestBody = {
        required : true,
        content : {
          "application/json" : {
              schema : {$ref : "#/components/schemas/PriceFilter"}
          }
        }
     }
     
     */
    const { type, orderBy } = req.params;
    const { lowest, highest } = req.body;

    const minPrice = Number(lowest) || 0;
    const maxPrice = Number(highest) || 0;

    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      let limit = Math.max(1, Number(req.query.limit) || 10);

      if (limit > 100) limit = 100;

      const skip = (page - 1) * limit;

      let priceFilter: any = {};
      if (maxPrice > 0 || minPrice > 0) {
        priceFilter.price = {};
        if (minPrice > 0) priceFilter.price.$gte = minPrice;
        if (maxPrice > 0) priceFilter.price.$lte = maxPrice;
      }

      let sortCriteria: any = {};

      if (type === "like") {
        sortCriteria = { like: orderBy === "ascending" ? 1 : -1 };
      } else if (type === "date") {
        sortCriteria = { createdAt: orderBy === "ascending" ? 1 : -1 };
      } else {
        sortCriteria = { _id: -1 };
      }

      const [result, totalCount] = await Promise.all([
        productModel
          .find(priceFilter)
          .sort(sortCriteria)
          .skip(skip)
          .limit(limit),

        productModel.countDocuments(priceFilter),
      ]);

      res.status(200).json({
        meta: {
          status: "200 - success",
          message: `Success Sorting ${type} - ${orderBy}`,
          total_items: totalCount,
          total_pages: Math.ceil(totalCount / limit),
          current_page: page,
          limit,
          has_next_page: page * limit < totalCount,
          has_previous_page: page > 1,
        },
        data: result,
      });
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
