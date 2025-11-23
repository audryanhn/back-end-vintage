import { Request, Response } from "express";
import * as Yup from "yup";
import userModel from "../models/user.model";
import { encrypt } from "../utils/encrypt";
import response from "../utils/response";
import { TLogin, TRegister } from "../utils/types";

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), "matched"], "Password not match"),
});

export default {
  async register(req: Request, res: Response) {
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        password,
        email,
        confirmPassword,
      });

      const result = await userModel.create({
        fullName,
        username,
        email,
        password,
      });

      response.success(res, "Validate Success", result);
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, err.message);
    }
  },

  async login(req: Request, res: Response) {
    const { identifier, password }: TLogin = req.body as unknown as TLogin;

    try {
      const userByIdentifier = await userModel.findOne({
        $or: [
          {
            username: identifier,
          },
          {
            email: identifier,
          },
        ],
      });

      if (!userByIdentifier) {
        response.badRequest(res, "User not found!");
        return;
      }

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        response.forbidden(res, "Wrong Password, Check again!");
      }

      response.success(res, "Login Success", userByIdentifier);
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `From Login : ${err.message}`);
    }
  },
};
