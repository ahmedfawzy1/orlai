import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// For NextAuth, we'll verify the session token
export const protectRoute = async (req, res, next) => {
  try {
    // Get the NextAuth session token from the request
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the NextAuth JWT
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const adminProtectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in adminProtectRoute middleware", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
