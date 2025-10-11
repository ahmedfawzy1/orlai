import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import { sanitizeHtml } from "../middleware/validation.middleware.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is Google-only (has googleId but no password)
    if (user.googleId && !user.password) {
      return res.status(400).json({
        message: "This account was created with Google. Please use 'Login with Google' instead.",
        isGoogleUser: true,
      });
    }

    // Check if user has a password
    if (!user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error validating credentials:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Sync Google user with backend
export const googleSync = async (req, res) => {
  sanitizeHtml(req, res, () => {});

  const { email, first_name, last_name, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        first_name: first_name || "Google",
        last_name: last_name || "User",
        googleId,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error syncing Google user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  sanitizeHtml(req, res, () => {});

  const { first_name, last_name, email, password } = req.body;

  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email }).exec();
    if (userExists) {
      // Check if it's a Google user
      if (userExists.googleId && !userExists.password) {
        return res.status(400).json({
          message: "This email is already registered with Google. Please use 'Login with Google' instead.",
          isGoogleUser: true,
        });
      }
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (error) {
    console.error("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Generate and send OTP to the user's email
export const requestOtpForResetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in the user model with an expiration time
    user.otp = otp;
    user.otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP to the user's email
    const transporter = nodemailer.createTransport({
      host: "in-v3.mailjet.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_API_KEY,
        pass: process.env.EMAIL_SECRET_KEY,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "OTP for Reset Password",
      text: `Your OTP for reset password is ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to the user's email" });
  } catch (error) {
    console.error("Error in generateOTPForResetPassword controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify OTP
export const verifyOtpForResetPassword = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, otp, otpExpiration: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    if (user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });
  } catch (error) {
    console.error("Error in verifyOtpForResetPassword controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email, otp, otpExpiration: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = undefined; // Clear the OTP
    user.otpExpiration = undefined; // Clear the OTP expiration
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
