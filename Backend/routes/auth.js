const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body;
    console.log("Registration request received:", { name, email, role }); // Debug log

    // Validate required fields
    if (!name || !email || !password) {
      console.error("Missing required fields:", { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected. Current state:", mongoose.connection.readyState);
      return res.status(503).json({
        success: false,
        message: "Database connection not ready. Please try again.",
      });
    }

    // Check if user already exists with timeout
    let user;
    try {
      user = await User.findOne({ email }).maxTimeMS(5000);
    } catch (findError) {
      console.error("Error finding user:", findError);
      return res.status(503).json({
        success: false,
        message: "Database operation timed out. Please try again.",
      });
    }

    if (user) {
      console.log("User already exists:", email);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Verify admin key if registering as admin
    if (role === "admin") {
      if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        console.error("Invalid admin key attempt:", { provided: !!adminKey, expected: !!process.env.ADMIN_KEY });
        return res.status(403).json({
          success: false,
          message: "Invalid admin key",
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Use provided role or default to user
    });
    console.log("User created successfully:", {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Create token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error("Registration error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check role if specified
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Invalid ${role} credentials`,
      });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
});

// Logout user
router.get("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
