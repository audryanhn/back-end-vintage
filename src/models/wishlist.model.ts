import mongoose, { Schema } from "mongoose";
import { IWishlist } from "../utils/interfaces";

const wishlistSchema = new Schema<IWishlist>({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  products: {
    type: [Schema.Types.String],
  },
});

const wishlistModel = mongoose.model("wishlist", wishlistSchema);

export default wishlistModel;
