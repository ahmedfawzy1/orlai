import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

export const createReview = async (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;
    const { id } = req.params;
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = {
      name,
      email,
      rating,
      comment,
      product: id,
    };

    await product.save();

    const product = await Product.findById(id);
    product.reviews.push(newReview._id);
    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("reviews");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("product");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json({
      reviews,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
