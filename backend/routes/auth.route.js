import express from "express";
import { signup, signin, googleSync, requestOtpForResetPassword, verifyOtpForResetPassword, resetPassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/profile.controller.js";
import { validateUserRegistration, sanitizeHtml } from "../middleware/validation.middleware.js";

const router = express.Router();

// NextAuth endpoints
router.post("/login", sanitizeHtml, signin);
router.post("/google-sync", sanitizeHtml, googleSync);

router.post("/signup", validateUserRegistration, signup);

// Password reset flow
router.post("/request-otp", sanitizeHtml, requestOtpForResetPassword);
router.post("/verify-otp", sanitizeHtml, verifyOtpForResetPassword);
router.post("/reset-password", sanitizeHtml, resetPassword);

router.put("/profile", protectRoute, updateProfile);

export default router;
