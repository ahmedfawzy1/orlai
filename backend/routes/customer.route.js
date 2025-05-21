import express from "express";
import { getCustomers, updateCustomer, deleteCustomer } from "../controllers/customer.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCustomers);
router.put("/:id", protectRoute, updateCustomer);
router.delete("/:id", protectRoute, deleteCustomer);

export default router;
