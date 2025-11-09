import Food from "../models/Food.js";

// Add a new food item (Admin)
export const addFood = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    const newFood = new Food({ name, description, price, image, category });
    await newFood.save();

    res.status(201).json({ message: "Food item added successfully", food: newFood });
  } catch (error) {
    console.error("Food Add Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all food items
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    console.error("Fetch Food Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single food item by ID
export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) return res.status(404).json({ message: "Food item not found" });

    res.status(200).json(food);
  } catch (error) {
    console.error("Get Food By ID Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a food item (Admin)
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFood = await Food.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedFood) return res.status(404).json({ message: "Food item not found" });

    res.json({ message: "Food updated successfully", food: updatedFood });
  } catch (error) {
    console.error("Update Food Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a food item (Admin)
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    await Food.findByIdAndDelete(id);
    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Delete Food Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
