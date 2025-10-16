import express from "express";
import { createReview, getProductReviews, getAllReviews, checkCanReview } from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createReview);
router.get("/", getAllReviews);
router.get("/:productId/can-review", protectRoute, checkCanReview);
router.get("/:id", getProductReviews);

export default router;
