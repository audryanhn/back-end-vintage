import { Request, Response } from "express";
import wishlistModel from "../models/wishlist.model";
import response from "../utils/response";

export default {
  async getAllWishlist(req: Request, res: Response) {
    try {
      const result = await wishlistModel.find();
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

    const result = await wishlistModel.findOne({ userId: userId });

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
};
