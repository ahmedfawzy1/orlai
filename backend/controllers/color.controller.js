import Color from "../models/color.model.js";

export const createColor = async (req, res) => {
  try {
    const { name, hexCode } = req.body;

    // Input validation
    if (!name || !hexCode) {
      return res.status(400).json({
        success: false,
        message: "Name and hexCode are required",
      });
    }

    // Validate hex code format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hex code format",
      });
    }

    // Check for existing color by name or hexCode
    const existingColor = await Color.findOne({
      $or: [{ name: name.trim() }, { hexCode: hexCode.toUpperCase() }],
    });

    if (existingColor) {
      return res.status(400).json({
        success: false,
        message: "Color with this name or hex code already exists",
      });
    }

    const newColor = new Color({
      name: name.trim(),
      hexCode: hexCode.toUpperCase(),
    });
    const savedColor = await newColor.save();

    res.status(201).json({
      success: true,
      message: "Color created successfully",
      data: savedColor,
    });
  } catch (error) {
    console.error("Create color error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getColors = async (req, res) => {
  try {
    const colors = await Color.find().sort({ name: 1 });

    if (!colors || colors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No colors found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Colors retrieved successfully",
      data: colors,
      count: colors.length,
    });
  } catch (error) {
    console.error("Get colors error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hexCode } = req.body;

    // Input validation
    if (!name && !hexCode) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name or hexCode) is required",
      });
    }

    // Validate hex code format if provided
    if (hexCode) {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(hexCode)) {
        return res.status(400).json({
          success: false,
          message: "Invalid hex code format",
        });
      }
    }

    // Check if color exists
    const existingColor = await Color.findById(id);
    if (!existingColor) {
      return res.status(404).json({
        success: false,
        message: "Color not found",
      });
    }

    // Check for duplicate name or hexCode
    const duplicateQuery = { _id: { $ne: id } };
    if (name) duplicateQuery.name = name.trim();
    if (hexCode) duplicateQuery.hexCode = hexCode.toUpperCase();

    const duplicate = await Color.findOne(duplicateQuery);
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Color with this name or hex code already exists",
      });
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (hexCode) updateData.hexCode = hexCode.toUpperCase();

    const updatedColor = await Color.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Color updated successfully",
      data: updatedColor,
    });
  } catch (error) {
    console.error("Update color error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if color exists
    const existingColor = await Color.findById(id);
    if (!existingColor) {
      return res.status(404).json({
        success: false,
        message: "Color not found",
      });
    }

    // Check if color is being used in any products
    const Product = (await import("../models/product.model.js")).default;
    const productsUsingColor = await Product.findOne({
      "variants.color": id,
    });

    if (productsUsingColor) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete color as it is being used in products",
      });
    }

    const deletedColor = await Color.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Color deleted successfully",
      data: deletedColor,
    });
  } catch (error) {
    console.error("Delete color error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
