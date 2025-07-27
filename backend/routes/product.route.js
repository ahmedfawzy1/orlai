import express from "express";
import { createProduct, getProducts, getProduct, getBestSellers, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { adminProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", adminProtectRoute, createProduct); // create product
router.get("/", getProducts); // get all products
router.get("/bestsellers", getBestSellers); // get best sellers
router.get("/:id", getProduct); // get product by id or slug
router.put("/:id", adminProtectRoute, updateProduct); // update product by id
router.delete("/:id", adminProtectRoute, deleteProduct); // delete product by id

export default router;
