import mongoose, { Schema } from "mongoose";
import { IWishlist } from "../utils/interfaces";

const wishlistSchema = new Schema<IWishlist>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const wishlistModel = mongoose.model("Wishlist", wishlistSchema);

export default wishlistModel;
