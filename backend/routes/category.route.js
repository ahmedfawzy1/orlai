import express from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { adminProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", adminProtectRoute, createCategory); // create category
router.get("/", adminProtectRoute, getCategories); // get all categories
router.put("/:id", adminProtectRoute, updateCategory); // update category by id
router.delete("/:id", adminProtectRoute, deleteCategory); // delete category by id

export default router;
