import express from "express";
import { createReview, getProductReviews, getAllReviews } from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createReview);
router.get("/:id", getProductReviews);
router.get("/", protectRoute, getAllReviews);

export default router;
