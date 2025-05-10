import express from "express";
import { createReview, getProductReviews, getAllReviews } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/products/:id/reviews", createReview);
router.get("/products/:id/reviews", getProductReviews);
router.get("/reviews", getAllReviews);

export default router;
