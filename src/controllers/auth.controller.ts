import { Request, Response } from "express";
import * as Yup from "yup";
import { TRegister } from "../utils/interfaces";
import response from "../utils/response";

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
      response.success(res, "Validate Success", {
        fullName,
        username,
        password,
      });
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, err.message);
    }
  },
};
