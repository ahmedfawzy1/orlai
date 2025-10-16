import express from "express";
import { getSalesOverview, getOrderStatusOverview, getChartData, getRecentOrders, getDashboardSummary } from "../controllers/dashboard.controller.js";
import { adminProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// All dashboard routes require authentication

// Get sales overview data
router.get("/sales-overview", adminProtectRoute, getSalesOverview);

// Get order status overview
router.get("/order-status", adminProtectRoute, getOrderStatusOverview);

// Get chart data (weekly sales/orders and best selling products)
router.get("/chart-data", adminProtectRoute, getChartData);

// Get recent orders
router.get("/recent-orders", adminProtectRoute, getRecentOrders);

// Get complete dashboard summary (all data in one request)
router.get("/summary", adminProtectRoute, getDashboardSummary);

export default router;
