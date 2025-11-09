import React from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">Your cart is empty. Start adding delicious food! 🍔</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="py-3 px-4 text-left">Item</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="border-b">
                  {/* Food Image & Name */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
                    <span>{item.name}</span>
                  </td>

                  {/* Quantity Controls */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className={`p-1 rounded-md ${item.quantity > 1 ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-200 cursor-not-allowed"}`}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 rounded-md bg-gray-300 hover:bg-gray-400"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">${(item.price * item.quantity).toFixed(2)}</td>

                  {/* Remove Button */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Price Section */}
          <div className="flex justify-between items-center mt-6 p-4 border-t">
            <h3 className="text-xl font-semibold text-gray-800">Total:</h3>
            <p className="text-xl font-bold text-green-600">${totalPrice.toFixed(2)}</p>
          </div>

          {/* Checkout Button */}
          <button
            className="mt-4 bg-blue-500 text-white w-full py-2 rounded-md text-lg hover:bg-blue-600 transition duration-200"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
