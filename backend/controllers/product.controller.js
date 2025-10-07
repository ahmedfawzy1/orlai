import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Color from "../models/color.model.js";
import Size from "../models/size.model.js";
import Order from "../models/order.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, priceRange, category, images, variants, slug } = req.body;

    // Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product description is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!slug || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product slug is required",
      });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one variant is required",
      });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category, category not found",
      });
    }

    // Check for duplicate slug
    const existingProduct = await Product.findOne({ slug: slug.trim() });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug already exists",
      });
    }

    // Validate variants
    for (const variant of variants) {
      if (!variant.color || !variant.size || variant.stock === undefined) {
        return res.status(400).json({
          success: false,
          message: "Each variant must have color, size, and stock",
        });
      }

      // Validate color exists
      const colorExists = await Color.findById(variant.color);
      if (!colorExists) {
        return res.status(400).json({
          success: false,
          message: `Invalid color ID: ${variant.color}`,
        });
      }

      // Validate size exists
      const sizeExists = await Size.findById(variant.size);
      if (!sizeExists) {
        return res.status(400).json({
          success: false,
          message: `Invalid size ID: ${variant.size}`,
        });
      }

      if (variant.stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock cannot be negative",
        });
      }
    }

    // Calculate total inventory from variant stocks
    const totalInventory = variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);

    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      priceRange,
      category,
      inventory: totalInventory,
      images,
      variants,
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, min_price, max_price, color, size, sort, order, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let query = {};

    // Filter by Category (name to ID lookup)
    if (category) {
      const categoryNames = category.split(",");
      const categoryDocs = await Category.find({ name: { $in: categoryNames } });
      if (categoryDocs.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No products found",
          data: [],
          pagination: {
            total_count: 0,
            total_pages: 0,
            current_page: page,
            per_page: limit,
          },
        });
      }
      query.category = { $in: categoryDocs.map((doc) => doc._id) };
    }

    // Filter by Color (name to ID lookup)
    if (color) {
      const colorNames = color.split(",");
      const colorDocs = await Color.find({ name: { $in: colorNames } });
      if (colorDocs.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No products found",
          data: [],
          pagination: {
            total_count: 0,
            total_pages: 0,
            current_page: page,
            per_page: limit,
          },
        });
      }
      query["variants.color"] = { $in: colorDocs.map((doc) => doc._id) };
    }

    // Filter by Size (name to ID lookup)
    if (size) {
      const sizeNames = size.split(",");
      const sizeDocs = await Size.find({ name: { $in: sizeNames } });
      if (sizeDocs.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No products found",
          data: [],
          pagination: {
            total_count: 0,
            total_pages: 0,
            current_page: page,
            per_page: limit,
          },
        });
      }
      query["variants.size"] = { $in: sizeDocs.map((doc) => doc._id) };
    }

    // Filter by Price Range
    if (min_price || max_price) {
      query["priceRange.minVariantPrice"] = {};
      if (min_price) query["priceRange.minVariantPrice"].$gte = parseFloat(min_price);
      if (max_price) query["priceRange.minVariantPrice"].$lte = parseFloat(max_price);
    }

    // Search by Product Name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Sorting
    const allowedSortFields = {
      price: "priceRange.minVariantPrice",
      createdAt: "createdAt",
      name: "name",
    };

    let sortQuery = {};
    if (sort && allowedSortFields[sort]) {
      sortQuery[allowedSortFields[sort]] = order === "asc" ? 1 : -1;
    } else if (sort) {
      sortQuery[sort] = order === "asc" ? 1 : -1;
    }

    // Fetch Products
    const products = await Product.find(query)
      .populate("category", "name -_id")
      .populate("variants.color", "name hexCode -_id")
      .populate("variants.size", "name -_id")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const totalCount = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
      pagination: {
        total_count: totalCount,
        total_pages: Math.ceil(totalCount / limit),
        current_page: page,
        per_page: limit,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let product;
    if (isValidObjectId) {
      product = await Product.findById(id)
        .populate("category", "name -_id")
        .populate("variants.color", "name hexCode -_id")
        .populate("variants.size", "name -_id");
    } else {
      // If not a valid ObjectId, treat it as a slug
      product = await Product.findOne({ slug: id })
        .populate("category", "name -_id")
        .populate("variants.color", "name hexCode -_id")
        .populate("variants.size", "name -_id");
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Debug: Check if category is populated
    if (!product.category) {
      console.warn(`Product ${product._id} (${product.name}) has no category field`);
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Validate category if being updated
    if (updatedData.category) {
      const categoryExists = await Category.findById(updatedData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }
    }

    // Validate slug uniqueness if being updated
    if (updatedData.slug) {
      const slugExists = await Product.findOne({
        slug: updatedData.slug.trim(),
        _id: { $ne: id },
      });
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Product with this slug already exists",
        });
      }
      updatedData.slug = updatedData.slug.trim().toLowerCase().replace(/\s+/g, "-");
    }

    // Validate variants if being updated
    if (updatedData.variants) {
      if (!Array.isArray(updatedData.variants) || updatedData.variants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one variant is required",
        });
      }

      for (const variant of updatedData.variants) {
        if (!variant.color || !variant.size || variant.stock === undefined) {
          return res.status(400).json({
            success: false,
            message: "Each variant must have color, size, and stock",
          });
        }

        // Validate color exists
        const colorExists = await Color.findById(variant.color);
        if (!colorExists) {
          return res.status(400).json({
            success: false,
            message: `Invalid color ID: ${variant.color}`,
          });
        }

        // Validate size exists
        const sizeExists = await Size.findById(variant.size);
        if (!sizeExists) {
          return res.status(400).json({
            success: false,
            message: `Invalid size ID: ${variant.size}`,
          });
        }

        if (variant.stock < 0) {
          return res.status(400).json({
            success: false,
            message: "Stock cannot be negative",
          });
        }
      }
    }

    // Clean up string fields
    if (updatedData.name) updatedData.name = updatedData.name.trim();
    if (updatedData.description) updatedData.description = updatedData.description.trim();

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is in any active (non-delivered) orders
    const activeOrders = await Order.find({
      "items.product": id,
      orderStatus: { $nin: ["delivered", "cancelled", "refunded"] },
    }).select("_id orderStatus createdAt");

    if (activeOrders.length > 0) {
      const orderIds = activeOrders.map((order) => order._id).join(", ");
      return res.status(400).json({
        success: false,
        message: `Cannot delete product as it is in active orders: ${orderIds}`,
        activeOrders: activeOrders.map((order) => ({
          orderId: order._id,
          status: order.orderStatus,
          createdAt: order.createdAt,
        })),
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const bestSellers = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { orderStatus: "delivered" } },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          _id: "$productDetails._id",
          name: "$productDetails.name",
          description: "$productDetails.description",
          priceRange: { $arrayElemAt: ["$productDetails.priceRange", 0] },
          images: "$productDetails.images",
          category: "$categoryDetails.name",
          availableForSale: "$productDetails.availableForSale",
          variants: "$productDetails.variants",
          averageRating: "$productDetails.averageRating",
          slug: "$productDetails.slug",
          totalSold: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Best sellers retrieved successfully",
      data: bestSellers,
      count: bestSellers.length,
    });
  } catch (error) {
    console.error("Error getting bestsellers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
