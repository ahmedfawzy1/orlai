import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
  googleAuth,
  refreshToken,
  requestOtpForResetPassword,
  verifyOtpForResetPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/profile.controller.js";
import { validateUserRegistration, validateUserLogin, sanitizeHtml } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/signup", validateUserRegistration, signup);
router.post("/login", validateUserLogin, login);
router.post("/logout", logout);
router.post("/google", sanitizeHtml, googleAuth);
router.post("/request-otp", sanitizeHtml, requestOtpForResetPassword);
router.post("/verify-otp", sanitizeHtml, verifyOtpForResetPassword);
router.post("/reset-password", sanitizeHtml, resetPassword);

router.get("/check", protectRoute, checkAuth);
router.get("/refresh", refreshToken);
router.put("/profile", protectRoute, updateProfile);

export default router;
