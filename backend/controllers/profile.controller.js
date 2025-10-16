import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { first_name, last_name, phone } = req.body;

    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (phone !== undefined) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password -otp -otpExpiration");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
