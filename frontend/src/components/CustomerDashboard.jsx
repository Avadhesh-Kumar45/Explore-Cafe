import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCustomerData();
  }, [navigate]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls
      // Mock data for now
      setOrders([
        {
          id: 1,
          date: "2024-03-15",
          items: ["Burger", "Fries"],
          total: 25.99,
          status: "delivered"
        }
      ]);
      setAddresses([
        {
          id: 1,
          street: "123 Main St",
          city: "Sample City",
          state: "ST",
          zipCode: "12345",
          isDefault: true
        }
      ]);
      setProfile({
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890"
      });
    } catch (err) {
      setError("Failed to load customer data");
      console.error("Error loading customer data:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderOrders = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Order #{order.id}</p>
              <p className="text-sm text-gray-500">{order.date}</p>
              <p className="text-sm">{order.items.join(", ")}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${order.total.toFixed(2)}</p>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                {order.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add New Address
        </button>
      </div>
      {addresses.map((address) => (
        <div key={address.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              {address.isDefault && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mb-2 inline-block">
                  Default
                </span>
              )}
              <p className="font-medium">{address.street}</p>
              <p className="text-sm text-gray-500">
                {address.city}, {address.state} {address.zipCode}
              </p>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
              <button className="text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Account</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "orders"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "addresses"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Addresses
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "orders" && renderOrders()}
          {activeTab === "addresses" && renderAddresses()}
          {activeTab === "profile" && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;