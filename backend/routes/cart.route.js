import express from "express";
import { getCart, addToCart, updateCart, removeFromCart, clearCart } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/", protectRoute, addToCart);
router.put("/:itemId", protectRoute, updateCart);
router.delete("/:itemId", protectRoute, removeFromCart);
router.delete("/", protectRoute, clearCart);

export default router;
