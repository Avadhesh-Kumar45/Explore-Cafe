import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // Get user token
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` }, // Send auth header
        });

        const orders = response.data;
        if (orders.length > 0) {
          const latestOrder = orders[orders.length - 1]; // Fetch latest order
          setOrderItems(latestOrder.items);
          setTotalAmount(latestOrder.totalAmount);
        }
      } catch (err) {
        setError("Failed to load orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...orderItems];
    updatedItems[index].quantity = newQuantity;
    setOrderItems(updatedItems);

    // Recalculate total amount
    const newTotal = updatedItems.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    setTotalAmount(newTotal.toFixed(2));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);

    // Recalculate total amount
    const newTotal = updatedItems.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    setTotalAmount(newTotal.toFixed(2));
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders/checkout",
        { items: orderItems, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully!");
      setOrderItems([]); // Clear cart
      setTotalAmount(0);
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Place Your Order</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orderItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Item</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{item.food.name}</td>
                  <td className="border p-2">${item.food.price.toFixed(2)}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                      className="w-16 text-center border rounded"
                    />
                  </td>
                  <td className="border p-2">${(item.food.price * item.quantity).toFixed(2)}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right">
            <h3 className="text-lg font-semibold">Total: ${totalAmount}</h3>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;
