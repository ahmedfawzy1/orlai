import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, priceRange, category, inventory, availableForSale, images, variants, averageRating, slug } = req.body;

    const newProduct = new Product({
      name,
      description,
      priceRange,
      category,
      inventory,
      availableForSale,
      images,
      variants,
      averageRating,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);

    const totalCount = await Product.countDocuments();

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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

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

export const updateProductInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { inventory } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, { inventory }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product inventory updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
