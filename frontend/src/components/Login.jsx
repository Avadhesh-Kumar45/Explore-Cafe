import React, { useState } from "react";
import { loginUser } from "../api/authApi";

const Login = ({ onClose, onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      localStorage.setItem("token", response.data.token);
      onLogin(); // Notify Header.js
      onClose(); // Close the modal
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials. Try again.");
      } else {
        setError("Server is not responding. Please check your connection.");
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
        >
          &times;
        </button>

        {/* Login Title */}
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-700">
          Welcome Back!
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Please log in to continue
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 focus:border-blue-500 focus:outline-none rounded mb-3 text-gray-900 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 border border-gray-300 focus:border-blue-500 focus:outline-none rounded mb-3 text-gray-900 placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white w-full p-2 rounded"
          >
            Login
          </button>
        </form>

        {/* Create Account link */}
        <p className="text-center mt-3 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={onRegister}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
