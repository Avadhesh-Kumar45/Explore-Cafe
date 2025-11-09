import React, { useState, useEffect } from "react";
import axios from "axios";
import FoodItem from "./FoodItem";

const FoodList = ({ addToCart }) => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/foods");
        setFoods(response.data);
        setFilteredFoods(response.data);
      } catch (error) {
        setError("Failed to load food items. Try again!");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Handle search input
  useEffect(() => {
    let filtered = foods.filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (category !== "All") {
      filtered = filtered.filter((food) => food.category === category);
    }

    setFilteredFoods(filtered);
  }, [searchTerm, category, foods]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">🍽️ Explore Our Menu</h2>

      {/* Search & Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="🔍 Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full md:w-1/2 rounded-md shadow-sm focus:ring focus:ring-green-300"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-md shadow-sm focus:ring focus:ring-green-300"
        >
          <option value="All">All Categories</option>
          <option value="Veg">🥦 Veg</option>
          <option value="Non-Veg">🍗 Non-Veg</option>
          <option value="Desserts">🍰 Desserts</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-200 h-60 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No food items found.</p>
          ) : (
            filteredFoods.map((food) => <FoodItem key={food._id} food={food} addToCart={addToCart} />)
          )}
        </div>
      )}
    </div>
  );
};

export default FoodList;
