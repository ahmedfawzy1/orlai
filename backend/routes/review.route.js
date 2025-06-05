import express from "express";
import { createReview, getProductReviews, getAllReviews } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/:id", getProductReviews);
router.get("/", getAllReviews);

export default router;
