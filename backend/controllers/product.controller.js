import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Color from "../models/color.model.js";
import Size from "../models/size.model.js";
import Order from "../models/order.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, priceRange, category, images, variants, slug } = req.body;

    // Calculate total inventory from variant stocks
    const totalInventory = variants.reduce((sum, variant) => sum + variant.stock, 0);

    const newProduct = new Product({
      name,
      description,
      priceRange,
      category,
      inventory: totalInventory,
      images,
      variants,
      slug,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
        return res.status(200).json({ products: [], total_count: 0, total_pages: 0, current_page: page, per_page: limit });
      }
      query.category = { $in: categoryDocs.map((doc) => doc._id) };
    }

    // Filter by Color (name to ID lookup)
    if (color) {
      const colorNames = color.split(",");
      const colorDocs = await Color.find({ name: { $in: colorNames } });
      if (colorDocs.length === 0) {
        return res.status(200).json({ products: [], total_count: 0, total_pages: 0, current_page: page, per_page: limit });
      }
      query["variants.color"] = { $in: colorDocs.map((doc) => doc._id) };
    }

    // Filter by Size (name to ID lookup)
    if (size) {
      const sizeNames = size.split(",");
      const sizeDocs = await Size.find({ name: { $in: sizeNames } });
      if (sizeDocs.length === 0) {
        return res.status(200).json({ products: [], total_count: 0, total_pages: 0, current_page: page, per_page: limit });
      }
      query["variants.size"] = { $in: sizeDocs.map((doc) => doc._id) };
    }

    // Filter by Price Range
    if (min_price && max_price) {
      query["priceRange.minVariantPrice"] = { $gte: parseFloat(min_price) };
      query["priceRange.maxVariantPrice"] = { $lte: parseFloat(max_price) };
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
      products,
      total_count: totalCount,
      total_pages: Math.ceil(totalCount / limit),
      current_page: page,
      per_page: limit,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // If variants are being updated, calculate new total inventory
    if (updatedData.variants) {
      const totalInventory = updatedData.variants.reduce((sum, variant) => sum + variant.stock, 0);
      updatedData.inventory = totalInventory;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

    res.status(200).json(bestSellers);
  } catch (error) {
    console.error("Error getting bestsellers:", error);
    res.status(500).json({ message: "Error getting bestsellers" });
  }
};
