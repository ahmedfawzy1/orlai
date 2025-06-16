import express from "express";
import { getAdmins, addAdmin, addAdminByEmail, removeAdmin } from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAdmins);
router.post("/", protectRoute, addAdmin);
router.post("/by-email", protectRoute, addAdminByEmail);
router.delete("/:id", protectRoute, removeAdmin);

export default router;
