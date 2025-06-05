import Wishlist from "../models/wishlist.model.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find()
      .populate({
        path: "customer",
        select: "first_name last_name email role phone",
      })
      .populate({
        path: "products",
        populate: {
          path: "variants.color",
        },
      })
      .select("-__v");

    if (!wishlists || wishlists.length === 0) {
      return res.status(404).json({ message: "No wishlists found" });
    }

    res.status(200).json(wishlists);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const wishlist = await Wishlist.findOne({ customer: userId }).populate({
      path: "products",
      populate: {
        path: "variants.color",
      },
    });

    res.status(200).json({
      products: wishlist?.products || [],
      _id: wishlist?._id || null,
      customer: userId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!productId || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    let wishlist = await Wishlist.findOne({ customer: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ customer: userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.products.push(productId);
    }

    const updatedWishlist = await wishlist.save();

    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!productId || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const wishlist = await Wishlist.findOne({ customer: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const productIndex = wishlist.products.findIndex((id) => id.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    wishlist.products.splice(productIndex, 1);

    if (wishlist.products.length === 0) {
      await Wishlist.findByIdAndDelete(wishlist._id);
      return res.status(200).json({ message: "Product removed and wishlist" });
    } else {
      const updatedWishlist = await wishlist.save();
      res.status(200).json({ message: "Product removed from wishlist", wishlist: updatedWishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
