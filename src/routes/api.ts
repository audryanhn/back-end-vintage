import express from "express";
import authController from "../controllers/auth.controller";
import cartController from "../controllers/cart.controller";
import productController from "../controllers/product.controller";
import wishlistController from "../controllers/wishlist.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

// Auth endpoint
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

// Product endpoint
router.post("/product/register", productController.addProduct);
router.get("/product", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router.get(
  "/product/filter/:type/:orderBy",
  productController.getProductByFilter
);
router.get("/product/by/:identifier", productController.getProductByIdentifier);

// Wishlist endpoint
router.post("/wishlist/:userId/:productId", wishlistController.addWishlist);
router.delete(
  "/wishlist/:userId/:productId",
  wishlistController.removeWishlist
);
router.get("/wishlist", wishlistController.getAllWishlist);
router.get("/wishlist/:userId", wishlistController.getWishlist);

// Cart Endpoint
router.get("/cart/:userId", cartController.getCart);
router.post("/cart/:userId", cartController.addCart);
router.put("/cart/:userId/:productId", cartController.actionHandler);
router.delete("/cart/:userId/:productId", cartController.removeProduct);

export default router;
