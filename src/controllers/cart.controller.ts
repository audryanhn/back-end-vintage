import { Request, Response } from "express";
import { Types } from "mongoose";
import cartModel from "../models/cart.model";
import { ICart } from "../utils/interfaces";
import response from "../utils/response";

export default {
  async addCart(req: Request, res: Response) {
    /**
     #swagger.tags=['Cart']
     */
    const { userId } = req.params;
    const { items } = req.body as ICart;

    try {
      const itemSatuan = items.map((item) => ({
        productId: new Types.ObjectId(item.productId),
        qty: item.qty,
      }));

      // For every item: try increment if exists, else push
      for (const item of itemSatuan) {
        const updated = await cartModel
          .findOneAndUpdate(
            { userId, "items.productId": item.productId },
            {
              $inc: { "items.qty": item.qty },
            },
            { new: true }
          )
          .populate("items.productId", "product_name images description price");
        if (!updated) {
          // push new item
          const result = await cartModel.findOneAndUpdate(
            { userId },
            {
              $addToSet: {
                items: { productId: item.productId, qty: item.qty },
              },
            },
            {
              new: true,
              upsert: true,
            }
          );
          if (!result) {
            response.badRequest(res, "Error Occured while adding cart");
            return;
          }
          response.success(res, "Add Cart Success", result);
          return;
        }
        response.success(res, "Success Update Cart", updated);
        return;
      }
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `addCart error - ${err.message}`);
    }
  },
};
