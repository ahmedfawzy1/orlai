import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    required: true,
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Size",
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate total price
cartSchema.pre("save", async function (next) {
  const populatedCart = await this.populate({
    path: "items.product",
    select: "priceRange variants",
  });
  this.total = populatedCart.items.reduce((total, item) => {
    const product = item.product;
    return total + product.priceRange.minVariantPrice * item.quantity;
  }, 0);

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
