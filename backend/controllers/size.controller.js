import Size from "../models/size.model.js";

export const createSize = async (req, res) => {
  try {
    const { name } = req.body;

    const existingSize = await Size.findOne({ name });
    if (existingSize) {
      return res.status(400).json({ message: "Size already exists" });
    }

    const newSize = new Size({ name });
    const savedSize = await newSize.save();

    res.status(201).json({
      message: "Size created successfully",
      size: savedSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSizes = async (req, res) => {
  try {
    const sizes = await Size.find();

    if (!sizes || sizes.length === 0) {
      return res.status(404).json({ message: "No sizes found" });
    }

    res.status(200).json(sizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSize = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedSize = await Size.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedSize) {
      return res.status(404).json({ message: "Size not found" });
    }

    res.status(200).json({
      message: "Size updated successfully",
      updatedSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSize = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSize = await Size.findByIdAndDelete(id);

    if (!deletedSize) {
      return res.status(404).json({ message: "Size not found" });
    }

    res.status(200).json({
      message: "Size deleted successfully",
      deletedSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
