import express from "express";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/address.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAddresses);
router.post("/", protectRoute, addAddress);
router.put("/:id", protectRoute, updateAddress);
router.delete("/:id", protectRoute, deleteAddress);

export default router;
