import { Request, Response } from "express";
import productModel from "../models/product.model";
import wishlistModel from "../models/wishlist.model";
import response from "../utils/response";

export default {
  async getAllWishlist(req: Request, res: Response) {
    /**
     #swagger.tags = ['Wishlist']
     */
    try {
      const result = await wishlistModel
        .find()
        .populate("userId", "username")
        .populate("products", "product_name");
      if (result.length === 0) {
        response.success(res, "wishlist is empty", []);
      }
      response.success(res, "Success get all Wishlist", result);
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `getAllWishlist error - ${err.message}`);
    }
  },

  async getWishlist(req: Request, res: Response) {
    /**
     #swagger.tags = ['Wishlist']
     */
    const { userId } = req.params;

    if (!userId) {
      response.notFound(res, "User Not Found");
      return;
    }

    const result = await wishlistModel
      .findOne({ userId: userId })
      .populate("userId", "username")
      .populate("products", "product_name images title price description like");

    if (!result) {
      response.notFound(res, "Wishlist is Not Found or empty");
      return;
    }

    response.success(res, "Wishlist Found", result);

    try {
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `getWishlist error - ${err.message}`);
    }
  },

  async addWishlist(req: Request, res: Response) {
    /**
     #swagger.tags = ['Wishlist']
     */

    const { userId, productId } = req.params;

    try {
      const result = await wishlistModel
        .findOneAndUpdate(
          {
            userId,
          },
          {
            $addToSet: { products: productId },
          },
          { upsert: true, new: true } // UPSERT BUAT BIKIN BARU KALO KAGA ADA
        )
        .populate("userId", "username")
        .populate("products", "product_name images price description like");

      if (!result) {
        response.badRequest(res, "Error occured while adding wishlist");
        return;
      }

      const updateLikes = await productModel.findOneAndUpdate(
        { _id: productId },
        {
          $addToSet: { like: userId },
        },
        { new: true }
      );

      if (!updateLikes) {
        response.badRequest(res, `Error occured while adding product likes`);
        return;
      }

      response.success(res, "Success add product to wishlist", result);
    } catch (error) {
      const err = error as unknown as Error;

      response.badRequest(res, `addWishlist error - ${err.message}`);
    }
  },

  async removeWishlist(req: Request, res: Response) {
    /**
     #swagger.tags = ['Wishlist']
     */
    const { userId, productId } = req.params;
    try {
      const result = await wishlistModel
        .findOneAndUpdate(
          { userId },
          {
            $pull: { products: productId },
          },
          { new: true }
        )
        .populate("products", "product_name images price description like");

      if (!result) {
        response.badRequest(
          res,
          "Error while remove product from wishlist like"
        );
        return;
      }

      const updateLikes = await productModel.findOneAndUpdate(
        { _id: productId },
        { $pull: { like: userId } },
        { new: true }
      );

      if (!updateLikes) {
        response.badRequest(res, "Error occured while removing likes");
      }

      response.success(
        res,
        "Success remove product from wishlist and likes",
        result
      );
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `removeWishlist error - ${err.message}`);
    }
  },
};
