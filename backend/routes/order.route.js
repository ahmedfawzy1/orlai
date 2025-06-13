import express from "express";
import { createOrder, getCustomerOrders, getOrderDetails, cancelOrder, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/", protectRoute, getCustomerOrders);
router.get("/:id", protectRoute, getOrderDetails);
router.post("/:id/cancel", protectRoute, cancelOrder);
router.get("/admin/all", protectRoute, getAllOrders);
router.put("/:id/status", protectRoute, updateOrderStatus);

export default router;
