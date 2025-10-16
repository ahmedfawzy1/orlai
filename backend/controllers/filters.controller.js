import Category from "../models/category.model.js";
import Color from "../models/color.model.js";
import Size from "../models/size.model.js";

export const getFilters = async (req, res) => {
  try {
    const categories = await Category.find();
    const colors = await Color.find();
    const sizes = await Size.find();

    res.status(200).json({ categories, colors, sizes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
