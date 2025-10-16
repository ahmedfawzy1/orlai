import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

import corsOptions from "./config/corsOptions.js";
import rootRoutes from "./routes/root.js";
import authRoutes from "./routes/auth.route.js";
import customerRoutes from "./routes/customer.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import sizeRoutes from "./routes/size.route.js";
import colorRoutes from "./routes/color.route.js";
import reviewRoutes from "./routes/review.route.js";
import filtersRoutes from "./routes/filters.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import cartRoutes from "./routes/cart.route.js";
import addressRoutes from "./routes/address.route.js";
import orderRoutes from "./routes/order.route.js";
import couponRoutes from "./routes/coupon.route.js";
import adminRoutes from "./routes/admin.routes.js";
import dashboardRoutes from "./routes/dashboard.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

// Security middleware
const isDevelopment = process.env.NODE_ENV === "development";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'", "https://accounts.google.com"],
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          "https://accounts.google.com",
          ...(isDevelopment ? ["http://localhost:5001", "http://localhost:3000"] : []),
        ],
        frameSrc: ["'self'", "https://js.stripe.com", "https://accounts.google.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 auth requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// More lenient rate limiter for auth check
const authCheckLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 auth check requests per minute
  message: "Too many auth check requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Middleware
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/", rootRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/auth/check", authCheckLimiter);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/filters", filtersRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.type("txt").send("404 Not Found");
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Error handler
app.use((err, req, res, next) => {
  // Log error details for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.error("Error details:", err.stack);
  } else {
    console.error("Error occurred:", err.message);
  }

  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === "development";
  res.status(500).json({
    error: isDevelopment ? err.message : "Internal server error",
    ...(isDevelopment && { stack: err.stack }),
  });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  mongoose.connection.once("open", () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;
