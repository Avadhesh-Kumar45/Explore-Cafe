import express from "express";
import Food from "../models/Food.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all users (admin only)
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error.message);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Update user status (admin only)
router.put("/users/:userId/status", protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "delivery_partner") {
      user.deliveryPartner.isVerified = status;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Update User Status Error:", error.message);
    res.status(500).json({ message: "Error updating user status" });
  }
});

// Get sales analytics (admin only)
router.get("/analytics/sales", protect, isAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: "delivered" });
    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const topSellingItems = await Order.aggregate([
      { $unwind: "$items" },
      { $group: {
        _id: "$items.food",
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
      }},
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: "foods",
        localField: "_id",
        foreignField: "_id",
        as: "foodDetails",
      }},
    ]);

    res.json({
      totalOrders,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      topSellingItems,
    });
  } catch (error) {
    console.error("Fetch Analytics Error:", error.message);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

// Get delivery partner performance (admin only)
router.get("/analytics/delivery-partners", protect, isAdmin, async (req, res) => {
  try {
    const deliveryPartners = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: {
        _id: "$deliveryPartner",
        totalDeliveries: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        totalEarnings: { $sum: "$totalAmount" },
      }},
      { $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "partnerDetails",
      }},
    ]);

    res.json(deliveryPartners);
  } catch (error) {
    console.error("Fetch Delivery Analytics Error:", error.message);
    res.status(500).json({ message: "Error fetching delivery partner analytics" });
  }
});

export default router;