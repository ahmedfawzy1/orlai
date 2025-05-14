import express from "express";
import { createSize, getSizes, updateSize, deleteSize } from "../controllers/size.controller.js";

const router = express.Router();

router.post("/", createSize); // create size
router.get("/", getSizes); // get all sizes
router.put("/:id", updateSize); // update size by id
router.delete("/:id", deleteSize); // delete size by id

export default router;
