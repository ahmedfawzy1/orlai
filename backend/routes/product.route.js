import express from "express";
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct, searchProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", createProduct); // create product
router.get("/", getProducts); // get all products
router.get("/:id", getProduct); // get product by id or slug
router.get("/search", searchProduct); // search product
router.put("/:id", updateProduct); // update product by id
router.delete("/:id", deleteProduct); // delete product by id

export default router;
