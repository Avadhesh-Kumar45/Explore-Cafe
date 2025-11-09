import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Fetch Profile Error:", error.message);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// Update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Error updating user profile" });
  }
});

// Upload profile picture
router.post("/profile-picture", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle file upload logic here
    // For now, just update the URL
    if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Profile Picture Upload Error:", error.message);
    res.status(500).json({ message: "Error uploading profile picture" });
  }
});

export default router;