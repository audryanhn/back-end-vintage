import { Request, Response } from "express";
import * as Yup from "yup";
import userModel from "../models/user.model";
import { encrypt } from "../utils/encrypt";
import type { IReqUser } from "../utils/interfaces";
import { generateToken } from "../utils/jwt";
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

const loginValidateSchema = Yup.object({
  identifier: Yup.string().required(),
  password: Yup.string().required(),
});

export default {
  async register(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
     required :  true,
     content : {
      "application/json" : {
        schema : {$ref : "#/components/schemas/RegisterRequest"}
      }
     }
     }
     */

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
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
     required : true,
     content : {
      "application/json" : {
      schema : {$ref : "#/components/schemas/LoginRequest"}
      }
     }
     }
     */
    const { identifier, password } = req.body as unknown as TLogin;

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

      // GENERATE TOKEN DULU

      const accessToken = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      response.success(res, "Login Success", accessToken);
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `From Login : ${err.message}`);
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
     "bearerAuth" : []
     }]
     */
    const user = req.user;

    if (!user) {
      response.badRequest(res, "Data Not Found!");
      return;
    }

    try {
      const result = await userModel.findById(user.id);

      if (!result) {
        response.badRequest(res, "User not found");
        return;
      }

      response.success(res, "Get Info Success", result);
    } catch (error) {
      const err = error as unknown as Error;
      response.badRequest(res, `Something went wrong`, err.message);
    }
  },
};
