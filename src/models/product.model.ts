import mongoose, { Schema } from "mongoose";
import { IProduct } from "../utils/interfaces";

const productSchema = new Schema<IProduct>(
  {
    brand: {
      type: Schema.Types.String,
      required: true,
    },
    category: {
      type: Schema.Types.String,
      required: true,
    },
    condition: {
      type: Schema.Types.String,
      enum: ["good", "excellent", "like-new"],
      default: "good",
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    from: {
      type: Schema.Types.String,
      required: true,
    },
    images: {
      type: [Schema.Types.String],
      validate: [
        {
          validator: (arr) => arr.length >= 1,
          message: "At least 1 image is required",
        },
        {
          validator: (arr) => arr.length <= 3,
          message: "No more than 6 images are allowed.",
        },
      ],
    },
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    product_name: {
      type: Schema.Types.String,
    },
    shipping: {
      type: Schema.Types.Number,
      required: true,
    },
    size: {
      type: Schema.Types.String,
      required: true,
    },
    store_name: {
      type: Schema.Types.String,
      required: true,
    },
    like: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
