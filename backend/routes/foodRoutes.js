import express from "express";
import Food from "../models/Food.js";
import protect from "../middleware/authMiddleware.js";
import protectAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

// ✅ Get all foods (Open to everyone)
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get a single food item by ID (Open to everyone)
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json(food);
  } catch (error) {
    console.error("Error fetching food:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add a new food item (Admin only)
router.post("/", protect, protectAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFood = new Food({ name, description, price, category, image });
    await newFood.save();

    res.status(201).json({ message: "Food added successfully", food: newFood });
  } catch (error) {
    console.error("Error adding food:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a food item (Admin only)
router.put("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food updated successfully", food: updatedFood });
  } catch (error) {
    console.error("Error updating food:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a food item (Admin only)
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
