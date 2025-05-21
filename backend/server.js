import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/", rootRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/filters", filtersRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/reviews", reviewRoutes);

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
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
