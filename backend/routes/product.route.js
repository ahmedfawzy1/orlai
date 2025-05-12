import express from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, searchProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", createProduct); // create product
router.get("/", getProducts); // get all products
router.get("/:id", getProductById); // get product by id
router.put("/:id", updateProduct); // update product by id
router.delete("/:id", deleteProduct); // delete product by id

router.get("/search", searchProduct); // search product by id

export default router;
