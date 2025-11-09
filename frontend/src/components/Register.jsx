import React, { useState } from "react";
import { registerUser } from "../api/authApi";

const Register = ({ onClose, onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }

      const response = await registerUser(trimmedName, trimmedEmail, trimmedPassword, role);
      
      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        onRegister();
        onClose();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      if (!navigator.onLine) {
        setError("Please check your internet connection and try again.");
      } else if (err.response && err.response.data) {
        setError(err.response.data.message || "Registration failed. Please try again.");
      } else if (err.request) {
        setError("Unable to reach the server. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center text-gray-700">
          Join Us Today!
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Create an account to get started
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full p-2 border border-gray-300 focus:border-green-500 focus:outline-none rounded text-gray-900 placeholder-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 focus:border-green-500 focus:outline-none rounded text-gray-900 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Create a password"
            className="w-full p-2 border border-gray-300 focus:border-green-500 focus:outline-none rounded text-gray-900 placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 focus:border-green-500 focus:outline-none rounded text-gray-900"
            disabled={loading}
          >
            <option value="user">Customer</option>
            <option value="delivery_partner">Delivery Partner</option>
          </select>

          <button
            type="submit"
            className={`w-full p-2 rounded transition-colors ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"} text-white font-medium`}
            disabled={loading}
          >
            {loading ? "Creating your account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <button
            className="text-blue-500 hover:text-blue-700 font-medium"
            onClick={() => {
              onClose();
              onLogin();
            }}
            disabled={loading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
