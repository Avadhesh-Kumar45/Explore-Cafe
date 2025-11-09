import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";
import { isDeliveryPartner } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Update availability status
router.put("/availability", protect, isDeliveryPartner, async (req, res) => {
  try {
    const { activeStatus } = req.body;
    const deliveryPartner = await User.findById(req.user._id);

    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    deliveryPartner.deliveryPartner.activeStatus = activeStatus;
    await deliveryPartner.save();

    res.json({
      message: `Status updated to ${activeStatus ? "active" : "inactive"}`,
      activeStatus: deliveryPartner.deliveryPartner.activeStatus,
    });
  } catch (error) {
    console.error("Update Availability Error:", error.message);
    res.status(500).json({ message: "Error updating availability status" });
  }
});

// Update current location
router.put("/location", protect, isDeliveryPartner, async (req, res) => {
  try {
    const { coordinates } = req.body;
    const deliveryPartner = await User.findById(req.user._id);

    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    deliveryPartner.deliveryPartner.currentLocation.coordinates = coordinates;
    await deliveryPartner.save();

    res.json({
      message: "Location updated successfully",
      currentLocation: deliveryPartner.deliveryPartner.currentLocation,
    });
  } catch (error) {
    console.error("Update Location Error:", error.message);
    res.status(500).json({ message: "Error updating location" });
  }
});

// Get current delivery partner's orders
router.get("/my-orders", protect, isDeliveryPartner, async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user._id,
      status: { $in: ["out_for_delivery", "delivered"] },
    })
      .populate("user", "name phone address")
      .populate("items.food", "name price");

    res.json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error.message);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Get earnings history
router.get("/earnings", protect, isDeliveryPartner, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      deliveryPartner: req.user._id,
      status: "delivered",
    };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const earnings = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalEarnings: { $sum: "$totalAmount" },
          deliveries: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const totalStats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$totalAmount" },
          totalDeliveries: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    res.json({
      earnings,
      stats: totalStats[0] || {
        totalEarnings: 0,
        totalDeliveries: 0,
        averageRating: 0,
      },
    });
  } catch (error) {
    console.error("Fetch Earnings Error:", error.message);
    res.status(500).json({ message: "Error fetching earnings" });
  }
});

// Update bank details
router.put("/bank-details", protect, isDeliveryPartner, async (req, res) => {
  try {
    const { bankDetails } = req.body;
    const deliveryPartner = await User.findById(req.user._id);

    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    deliveryPartner.deliveryPartner.bankDetails = bankDetails;
    await deliveryPartner.save();

    res.json({
      message: "Bank details updated successfully",
      bankDetails: deliveryPartner.deliveryPartner.bankDetails,
    });
  } catch (error) {
    console.error("Update Bank Details Error:", error.message);
    res.status(500).json({ message: "Error updating bank details" });
  }
});

export default router;