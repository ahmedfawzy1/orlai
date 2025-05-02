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
