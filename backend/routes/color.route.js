import express from "express";
import { createColor, getColors, updateColor, deleteColor } from "../controllers/color.controller.js";

const router = express.Router();

router.post("/", createColor); // create color
router.get("/", getColors); // get all colors
router.put("/:id", updateColor); // update color by id
router.delete("/:id", deleteColor); // delete color by id

export default router;
