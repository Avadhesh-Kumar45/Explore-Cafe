import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import twilio from "twilio";

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// User Registration
export const registerUser = async (req, res) => {
  console.log("✅ Received Register Request:", req.body);

  try {
    const { name, email, password, phone, role, address, paymentDetails } = req.body;

    if (!name || !password || !(email || phone)) {
      console.log("❌ Validation Failed: Missing Required Fields");
      return res.status(400).json({ success: false, message: "Name, password, and either email or phone are required" });
    }

    // Check for existing user by email
    if (email) {
      let emailUser = await User.findOne({ email });
      if (emailUser) {
        console.log("❌ User Already Exists with Email");
        return res.status(400).json({ success: false, message: "User already exists with this email" });
      }
    }

    // Check for existing user by phone
    if (phone) {
      let phoneUser = await User.findOne({ phone });
      if (phoneUser) {
        console.log("❌ User Already Exists with Phone");
        return res.status(400).json({ success: false, message: "User already exists with this phone number" });
      }
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
      address,
      paymentDetails
    });

    await user.save();
    console.log("✅ User Saved Successfully:", user);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Token Generated:", token);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || !(email || phone)) {
      return res.status(400).json({ message: "Please provide password and either email or phone" });
    }

    // Check if user exists by email or phone
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
