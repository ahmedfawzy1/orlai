import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Color from "../models/color.model.js";
import Size from "../models/size.model.js";

const cartPopulateOptions = [
  {
    path: "items.product",
    populate: {
      path: "variants.color",
    },
  },
  { path: "items.color" },
  { path: "items.size" },
];

export const getCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const cart = await Cart.findOne({ user: req.user._id }).populate(cartPopulateOptions);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, color, size, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (variant.stock < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${variant.stock}, Requested: ${quantity}`,
      });
    }

    // Find color and size by name
    const colorDoc = await Color.findOne({ name: color });
    if (!colorDoc) return res.status(404).json({ message: "Color not found" });

    const sizeDoc = await Size.findOne({ name: size });
    if (!sizeDoc) return res.status(404).json({ message: "Size not found" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.variantId.toString() === variantId &&
        item.color.toString() === colorDoc._id.toString() &&
        item.size.toString() === sizeDoc._id.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        variantId,
        color: colorDoc._id,
        size: sizeDoc._id,
        quantity,
      });
    }

    await cart.save();

    const populatedCart = await cart.populate(cartPopulateOptions);

    res.status(200).json({ message: "Item added to cart", cart: populatedCart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) return res.status(400).json({ message: "Quantity must be at least 1" });

    // Find the user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find the item in the cart
    const cartItem = cart.items.id(itemId);
    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    const product = await Product.findById(cartItem.product);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.id(cartItem.variantId);
    if (!variant) {
      cartItem.remove();
      await cart.save();
      return res.status(400).json({ message: "Product variant no longer available" });
    }

    // Check if the item has enough stock
    if (variant.stock < quantity)
      return res.status(400).json({
        message: `Only ${variant.stock} items available in stock`,
      });

    // Update the quantity
    cartItem.quantity = quantity;

    await cart.save();

    const populatedCart = await cart.populate(cartPopulateOptions);

    res.status(200).json({ message: "Cart updated", cart: populatedCart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const cartItem = cart.items.id(itemId);
    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    cart.items.pull(itemId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(cartPopulateOptions);

    if (!updatedCart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Item removed from cart", cart: updatedCart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: error.message });
  }
};
