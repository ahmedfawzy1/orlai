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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
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
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Transform category to just the name
        if (ret.category) {
          ret.category = ret.category.name || ret.category;
        }

        // Transform variants to handle color/size objects and remove duplicate ids
        if (ret.variants) {
          ret.variants = ret.variants.map((variant) => {
            // Remove id from variant level
            const { id, ...variantWithoutId } = variant;

            // Handle color object
            if (variant.color && typeof variant.color === "object") {
              const { id, ...colorWithoutId } = variant.color;
              variantWithoutId.color = colorWithoutId;
            }

            // Handle size - return name directly
            if (variant.size) {
              if (typeof variant.size === "object") {
                variantWithoutId.size = variant.size.name;
              } else {
                variantWithoutId.size = variant.size;
              }
            }

            return variantWithoutId;
          });
        }

        // Transform priceRange to remove numeric key and duplicate id
        if (ret.priceRange && ret.priceRange.length > 0) {
          const { id, ...priceRangeWithoutId } = ret.priceRange[0];
          ret.priceRange = priceRangeWithoutId;
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        // Transform category to just the name
        if (ret.category) {
          ret.category = ret.category.name || ret.category;
        }

        // Transform variants to handle color/size objects and remove duplicate ids
        if (ret.variants) {
          ret.variants = ret.variants.map((variant) => {
            // Remove id from variant level
            const { id, ...variantWithoutId } = variant;

            // Handle color object
            if (variant.color && typeof variant.color === "object") {
              const { id, ...colorWithoutId } = variant.color;
              variantWithoutId.color = colorWithoutId;
            }

            // Handle size - return name directly
            if (variant.size) {
              if (typeof variant.size === "object") {
                variantWithoutId.size = variant.size.name;
              } else {
                variantWithoutId.size = variant.size;
              }
            }

            return variantWithoutId;
          });
        }

        // Transform priceRange to remove numeric key and duplicate id
        if (ret.priceRange && ret.priceRange.length > 0) {
          const { id, ...priceRangeWithoutId } = ret.priceRange[0];
          ret.priceRange = priceRangeWithoutId;
        }
        return ret;
      },
    },
  }
);

// Virtual field for inventory
productSchema.virtual("inventory").get(function () {
  if (!this.variants || !Array.isArray(this.variants)) {
    return 0;
  }
  return this.variants.reduce((sum, variant) => sum + variant.stock, 0);
});

// Middleware to automatically update 'availableForSale' based on inventory
productSchema.pre("save", function (next) {
  if (this.variants && Array.isArray(this.variants)) {
    const inventory = this.variants.reduce((sum, variant) => sum + variant.stock, 0);

    if (inventory === 0) {
      this.availableForSale = false;
    } else if (inventory > 0 && this.availableForSale === false) {
      this.availableForSale = true;
    }
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
