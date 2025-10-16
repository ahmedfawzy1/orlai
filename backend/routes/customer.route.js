import express from "express";
import { getCustomers, updateCustomer, deleteCustomer } from "../controllers/customer.controller.js";
import { adminProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", adminProtectRoute, getCustomers);
router.put("/:id", adminProtectRoute, updateCustomer);
router.delete("/:id", adminProtectRoute, deleteCustomer);

export default router;
