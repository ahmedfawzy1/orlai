import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllWishlists, getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllWishlists);
router.get("/:userId", protectRoute, getWishlist);
router.post("/", protectRoute, addToWishlist);
router.delete("/", protectRoute, removeFromWishlist);

export default router;
