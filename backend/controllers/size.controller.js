import Size from "../models/size.model.js";

export const createSize = async (req, res) => {
  try {
    const { name } = req.body;

    // Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const trimmedName = name.trim();

    const existingSize = await Size.findOne({ name: trimmedName });
    if (existingSize) {
      return res.status(400).json({
        success: false,
        message: "Size already exists",
      });
    }

    const newSize = new Size({ name: trimmedName });
    const savedSize = await newSize.save();

    res.status(201).json({
      success: true,
      message: "Size created successfully",
      data: savedSize,
    });
  } catch (error) {
    console.error("Create size error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSizes = async (req, res) => {
  try {
    const sizes = await Size.find();

    if (!sizes || sizes.length === 0) {
      return res.status(404).json({ message: "No sizes found" });
    }

    res.status(200).json({
      success: true,
      message: "Sizes retrieved successfully",
      data: sizes,
      count: sizes.length,
    });
  } catch (error) {
    console.error("Get sizes error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateSize = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const trimmedName = name.trim();

    // Check if size exists
    const existingSize = await Size.findById(id);
    if (!existingSize) {
      return res.status(404).json({
        success: false,
        message: "Size not found",
      });
    }

    // Check for duplicate name
    const duplicateSize = await Size.findOne({
      name: trimmedName,
      _id: { $ne: id },
    });
    if (duplicateSize) {
      return res.status(400).json({
        success: false,
        message: "Size with this name already exists",
      });
    }

    const updatedSize = await Size.findByIdAndUpdate(
      id,
      { name: trimmedName },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Size updated successfully",
      data: updatedSize,
    });
  } catch (error) {
    console.error("Update size error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteSize = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if size exists
    const existingSize = await Size.findById(id);
    if (!existingSize) {
      return res.status(404).json({
        success: false,
        message: "Size not found",
      });
    }

    // Check if size is being used in any products
    const Product = (await import("../models/product.model.js")).default;
    const productsUsingSize = await Product.findOne({
      "variants.size": id,
    });

    if (productsUsingSize) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete size as it is being used in products",
      });
    }

    const deletedSize = await Size.findByIdAndDelete(id);

    if (!deletedSize) {
      return res.status(404).json({ message: "Size not found" });
    }

    res.status(200).json({
      success: true,
      message: "Size deleted successfully",
      data: deletedSize,
    });
  } catch (error) {
    console.error("Delete size error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
