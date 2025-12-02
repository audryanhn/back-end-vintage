import { Request, Response } from "express";
import { Types } from "mongoose";
import cartModel from "../models/cart.model";
import { ICart } from "../utils/interfaces";
import response from "../utils/response";

export default {
  async getCart(req: Request, res: Response) {
    /**
     #swagger.tags = ['Cart']
     */
    const { userId } = req.params;
    try {
      const result = await cartModel.find({ userId });
      if (!result) {
        response.badRequest(res, "error occured while get cart info");
        return;
      }
      response.success(res, "success get Cart info", result);
      return;
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `getCart error ${err.message}`);
      return;
    }
  },
  async addCart(req: Request, res: Response) {
    /**
     #swagger.tags=['Cart']
     */
    const { userId } = req.params;
    const { items } = req.body as ICart;

    const itemSatuan = items.map((item) => ({
      productId: new Types.ObjectId(item.productId),
      qty: item.qty ?? 1,
    }));
    try {
      // For every item: try increment if exists, else push
      for (const item of itemSatuan) {
        const updated = await cartModel
          .findOneAndUpdate(
            { userId, "items.productId": item.productId },
            {
              $inc: { "items.$.qty": item.qty },
            },
            { new: true }
          )
          .populate(
            "items.productId",
            "product_name images description price like"
          );
        if (!updated) {
          // push new item
          await cartModel.findOneAndUpdate(
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
          // if (!result) {
          //   response.badRequest(res, "Error Occured while adding cart");
          //   return;
          // }
          // response.success(res, "Add Cart Success", result);
        }
        // response.success(res, "Success Update Cart", updated);
      }
      const result = await cartModel
        .findOne({ userId })
        .populate(
          "items.productId",
          "product_name image like description brand"
        );
      response.success(res, "Success add Cart", result);
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `addCart error - ${err.message}`);
    }
  },

  async decreaseQuantity(req: Request, res: Response) {
    /**
     #swagger.tags = ['Cart']
     */

    // Check user qty
    const { userId, productId } = req.params;

    let decrease = await cartModel
      .findOneAndUpdate(
        { userId, "items.productId": productId },
        {
          $inc: { "items.$.qty": -1 },
        },
        { new: true }
      )
      .populate(
        "items.productId",
        "product_name brand title description image price like"
      );

    if (!decrease) {
      response.badRequest(res, "Error occured while decreasing qty");
    }

    const checkQty = await cartModel.findOne({ userId });

    if (!checkQty) {
      response.badRequest(res, "product is not find");
      return;
    }
    const item = checkQty.items.find(
      (i) => i.productId.toString() === productId
    );

    if (item && item.qty <= 0) {
      decrease = await cartModel
        .findOneAndUpdate(
          { userId, "items.productId": productId },
          {
            $pull: { items: { productId } },
          },
          { new: true }
        )
        .populate(
          "items.productId",
          "product_name description title image price like"
        );

      // response.success(res, "Success Remove Product", result);
      // return;
    }

    response.success(res, "Success Decreasing Quantity", decrease);
    try {
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `decreaseQuantity error ${err.message}`);
    }
  },
  async removeProduct(req: Request, res: Response) {
    /**
     #swagger.tags = ['Cart']
     */
    const { userId, productId } = req.params;

    try {
      const result = await cartModel
        .findOneAndUpdate(
          { userId, "items.productId": productId },
          {
            $pull: { items: { productId } },
          },
          { new: true }
        )
        .populate(
          "items.productId",
          "product_name brand image like description price"
        );

      if (!result) {
        response.badRequest(res, "Error occured while remove product");
        return;
      }

      response.success(res, "success remove product", result);
      return;
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `removeProduct error ${err.message}`);
      return;
    }
  },
};
