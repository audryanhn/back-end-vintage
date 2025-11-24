import express from "express";
import authController from "../controllers/auth.controller";
import productController from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);
router.get("/product/:identifier", productController.getProducts);

export default router;
