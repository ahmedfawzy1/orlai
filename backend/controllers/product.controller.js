import Product from "../models/product.model.js";

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
    const { category, min_price, max_price, sort, order, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let query = {};

    // Filter by category
    if (category) query.category = category;

    // Filter by price range
    if (min_price && max_price) {
      query.priceRange = {
        $elemMatch: {
          minVariantPrice: { $gte: parseFloat(min_price) },
          maxVariantPrice: { $lte: parseFloat(max_price) },
        },
      };
    }

    // search by product name
    if (search) query.name = { $regex: search, $options: "i" };

    // sort by price
    let sortQuery = {};
    if (sort) {
      sortQuery[sort] = order === "asc" ? 1 : -1;
    }

    const products = await Product.find(query).sort(sortQuery).skip(skip).limit(limit);

    const totalCount = await Product.countDocuments(query);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

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
      product = await Product.findById(id);
    } else {
      // If not a valid ObjectId, treat it as a slug
      product = await Product.findOne({ slug: id });
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

export const searchProduct = async (req, res) => {
  try {
    const { name, category, min_price, max_price } = req.query;

    let query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = category;
    if (min_price && max_price) {
      query.priceRange = {
        $elemMatch: {
          minVariantPrice: { $gte: parseFloat(min_price) },
          maxVariantPrice: { $lte: parseFloat(max_price) },
        },
      };
    }

    const products = await Product.find(query);

    res.status(200).json({
      products,
      total_count: products.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
