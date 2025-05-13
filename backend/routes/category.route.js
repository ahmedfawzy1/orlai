import express from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.post("/", createCategory); // create category
router.get("/", getCategories); // get all categories
router.put("/:id", updateCategory); // update category by id
router.delete("/:id", deleteCategory); // delete category by id

export default router;
