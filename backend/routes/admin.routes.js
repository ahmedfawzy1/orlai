import express from "express";
import { getAdmins, addAdmin, addAdminByEmail, removeAdmin } from "../controllers/admin.controller.js";
import { adminProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", adminProtectRoute, getAdmins);
router.post("/", adminProtectRoute, addAdmin);
router.post("/by-email", adminProtectRoute, addAdminByEmail);
router.delete("/:id", adminProtectRoute, removeAdmin);

export default router;
