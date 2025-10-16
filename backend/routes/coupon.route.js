import express from "express";
import { getAllCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { adminProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", adminProtectRoute, getAllCoupons);
router.get("/:id", adminProtectRoute, getCoupon);
router.post("/", adminProtectRoute, createCoupon);
router.put("/:id", adminProtectRoute, updateCoupon);
router.delete("/:id", adminProtectRoute, deleteCoupon);

// Public route for validating coupons
router.post("/validate", validateCoupon);

export default router;
