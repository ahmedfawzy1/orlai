import express from "express";
import { getAllCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllCoupons);
router.get("/:id", protectRoute, getCoupon);
router.post("/", protectRoute, createCoupon);
router.put("/:id", protectRoute, updateCoupon);
router.delete("/:id", protectRoute, deleteCoupon);

// Public route for validating coupons
router.post("/validate", validateCoupon);

export default router;
