import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateToken } from "../config/utils.js";

export const signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email }).exec();
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    if (user) {
      generateToken(user._id, res);
      await user.save();
      res.status(201).json({
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(400).json({ message: "Incorrect password" });

    generateToken(user._id, res);
    res.status(200).json({ _id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role });
  } catch (error) {
    console.error("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) return res.status(401).json({ message: "Invalid refresh token" });

    // Generate new access token
    const { accessToken } = generateToken(decoded.userId, res);

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
