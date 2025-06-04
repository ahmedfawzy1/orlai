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

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google", googleAuth);
router.post("/request-otp", requestOtpForResetPassword);
router.post("/verify-otp", verifyOtpForResetPassword);
router.post("/reset-password", resetPassword);

router.get("/check", protectRoute, checkAuth);
router.get("/refresh", refreshToken);
router.put("/profile", protectRoute, updateProfile);

export default router;
