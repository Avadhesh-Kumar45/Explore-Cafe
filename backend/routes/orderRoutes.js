import express from "express";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create an order (only authenticated users can place orders)
router.post("/", protect, async (req, res) => {
  const { items, totalAmount } = req.body;
  const user = req.user._id; // Get user ID from the token


  try {
    const newOrder = new Order({ user, items, totalAmount });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
});

// Get user's orders (only authenticated users can view their orders)
router.get("/:userId", protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: "You can only view your own orders" });
    }
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;
