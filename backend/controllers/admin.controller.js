import User from "../models/user.model.js";
import bcrypt from "bcrypt";

// Get all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password -otp -otpExpiration").sort({ createdAt: -1 });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new admin by email
export const addAdminByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    // Check if user is already an admin
    if (existingUser.role === "admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }

    // Update user role to admin
    existingUser.role = "admin";
    await existingUser.save();

    const { password, otp, otpExpiration, ...adminWithoutSensitive } = existingUser.toObject();
    res.status(200).json(adminWithoutSensitive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new admin with full details
export const addAdmin = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    const { password: _, otp, otpExpiration, ...adminWithoutSensitive } = admin.toObject();
    res.status(201).json(adminWithoutSensitive);
  } catch (error) {
    console.error("Error in addAdmin:", error);
    res.status(500).json({ message: error.message });
  }
};

// Remove admin
export const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if admin exists
    const admin = await User.findOne({ _id: id, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if this is the last admin
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res.status(400).json({ message: "Cannot remove the last admin. At least one admin must remain in the system." });
    }

    // Check if admin is trying to remove themselves
    if (admin._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot remove yourself from admin role" });
    }

    // Change role to user instead of deleting
    admin.role = "user";
    await admin.save();

    const { password, otp, otpExpiration, ...adminWithoutSensitive } = admin.toObject();
    res.status(200).json(adminWithoutSensitive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
