import User from "../models/User.js";

// Middleware to check if user has required role
export const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied. You don't have permission to perform this action",
        });
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
};

// Middleware specifically for delivery partners
export const isDeliveryPartner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== "delivery_partner") {
      return res.status(403).json({
        message: "Access denied. Only delivery partners can access this resource",
      });
    }

    if (!user.deliveryPartner.isVerified) {
      return res.status(403).json({
        message: "Your account is not verified yet. Please complete verification",
      });
    }

    next();
  } catch (error) {
    console.error("Delivery Partner Middleware Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware specifically for customers
export const isCustomer = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== "user") {
      return res.status(403).json({
        message: "Access denied. Only customers can access this resource",
      });
    }

    next();
  } catch (error) {
    console.error("Customer Middleware Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware specifically for admins
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only admins can access this resource",
      });
    }

    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};