import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;

    // Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!slug || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    // Check for existing category by name or slug
    const existingCategory = await Category.findOne({
      $or: [{ name: trimmedName }, { slug: trimmedSlug }],
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name or slug already exists",
      });
    }

    const newCategory = new Category({
      name: trimmedName,
      description: description?.trim() || "",
      slug: trimmedSlug,
    });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, slug } = req.body;

    // Input validation
    if (!name && !description && !slug) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name, description, or slug) is required",
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || "";
    if (slug) updateData.slug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    // Check for duplicate name or slug
    if (name || slug) {
      const duplicateQuery = { _id: { $ne: id } };
      if (name) duplicateQuery.name = name.trim();
      if (slug) duplicateQuery.slug = slug.trim().toLowerCase().replace(/\s+/g, "-");

      const duplicate = await Category.findOne(duplicateQuery);
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Category with this name or slug already exists",
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category is being used in any products
    const Product = (await import("../models/product.model.js")).default;
    const productsUsingCategory = await Product.findOne({
      category: id,
    });

    if (productsUsingCategory) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category as it is being used in products",
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
