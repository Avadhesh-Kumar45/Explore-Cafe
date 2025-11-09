import React from "react";
import { FaStar } from "react-icons/fa";

const FoodItem = ({ food, addToCart }) => {
  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-2xl transition-transform transform hover:scale-105 duration-300">
      {/* Food Image */}
      <div className="relative">
        <img
          src={`http://localhost:5000/uploads/${food.image}`}
          alt={food.name}
          loading="lazy"
          className="w-full h-44 object-cover rounded-md"
        />
        {/* Category Badge */}
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
          {food.category}
        </span>
      </div>

      {/* Food Details */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
        <p className="text-gray-600 text-sm truncate">{food.description}</p>
        
        {/* Rating */}
        <div className="flex items-center mt-2">
          <FaStar className="text-yellow-500" />
          <span className="ml-1 text-gray-700 font-medium">{food.rating || "4.5"}</span>
          <span className="ml-2 text-gray-500 text-xs">({food.reviews || "100+"} reviews)</span>
        </div>

        {/* Price & Availability */}
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold text-xl text-green-600">${food.price}</p>
          {food.stock > 0 ? (
            <span className="text-sm text-green-600">In Stock</span>
          ) : (
            <span className="text-sm text-red-500">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(food)}
          className={`mt-4 px-4 py-2 w-full rounded-md text-white ${
            food.stock > 0
              ? "bg-green-500 hover:bg-green-600 transition duration-200"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={food.stock === 0}
        >
          {food.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default FoodItem;
