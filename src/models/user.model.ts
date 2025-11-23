import mongoose from "mongoose";
import { encrypt } from "../utils/encrypt";
import { IUser } from "../utils/interfaces";

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: Schema.Types.String,
      default: "user.jpg",
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: false,
    },
    activationCode: {
      type: Schema.Types.String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this; // untuk memanipulasi data yang akan masuk ke database jadinya pake this
  user.password = encrypt(user.password);
  next();
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
