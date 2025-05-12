import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priceRange: [
      {
        maxVariantPrice: { type: Number, min: 0 },
        minVariantPrice: { type: Number, min: 0 },
      },
    ],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    availableForSale: {
      type: Boolean,
      required: true,
      default: true,
    },
    images: [
      {
        type: String,
        required: true,
        match: [/\.(jpg|jpeg|png|webp|avif)$/i, "Invalid image format"],
      },
    ],
    variants: [
      {
        color: {
          type: String,
          required: true,
          trim: true,
        },
        size: {
          type: String,
          required: true,
          trim: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    averageRating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

// Middleware to automatically update 'availableForSale' based on 'inventory'
productSchema.pre("save", function (next) {
  if (this.inventory === 0) {
    this.availableForSale = false;
  } else if (this.inventory > 0 && this.availableForSale === false) {
    this.availableForSale = true;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
