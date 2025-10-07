import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Lax for development, None for production
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".orlai.store" : undefined, // Don't set domain in development
  });
  return { accessToken, refreshToken };
};
