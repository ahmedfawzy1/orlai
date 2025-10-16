import express from "express";
import { createColor, getColors, updateColor, deleteColor } from "../controllers/color.controller.js";
import { adminProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", adminProtectRoute, createColor); // create color
router.get("/", adminProtectRoute, getColors); // get all colors
router.put("/:id", adminProtectRoute, updateColor); // update color by id
router.delete("/:id", adminProtectRoute, deleteColor); // delete color by id

export default router;
