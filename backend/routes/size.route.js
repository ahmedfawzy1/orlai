import express from "express";
import { createSize, getSizes, updateSize, deleteSize } from "../controllers/size.controller.js";
import { adminProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", adminProtectRoute, createSize); // create size
router.get("/", adminProtectRoute, getSizes); // get all sizes
router.put("/:id", adminProtectRoute, updateSize); // update size by id
router.delete("/:id", adminProtectRoute, deleteSize); // delete size by id

export default router;
