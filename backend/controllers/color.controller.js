import Color from "../models/color.model.js";

export const createColor = async (req, res) => {
  try {
    const { name, hexCode } = req.body;

    const existingColor = await Color.findOne({ hexCode });
    if (existingColor) {
      return res.status(400).json({ message: "Color already exists" });
    }

    const newColor = new Color({ name, hexCode });
    const savedColor = await newColor.save();

    res.status(201).json({
      message: "Color created successfully",
      color: savedColor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getColors = async (req, res) => {
  try {
    const colors = await Color.find();

    if (!colors || colors.length === 0) {
      return res.status(404).json({ message: "No colors found" });
    }

    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedColor = await Color.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedColor) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.status(200).json({
      message: "Color updated successfully",
      updatedColor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedColor = await Color.findByIdAndDelete(id);

    if (!deletedColor) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.status(200).json({
      message: "Color deleted successfully",
      deletedColor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
