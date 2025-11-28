import mongoose, { Schema } from "mongoose";
import { ICart, ICartItem } from "../utils/interfaces";

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    qty: {
      type: Schema.Types.Number,
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  items: { type: [cartItemSchema], default: [] },
});

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
